import { useEffect, useState } from "react";
import dayjs from "dayjs";
import api from "../api/client";

const initialTask = {
  subject: "",
  title: "",
  description: "",
  dueDate: "",
  estimatedMinutes: 60,
  priority: 3
};

const PlannerPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [taskForm, setTaskForm] = useState(initialTask);

  const loadData = async () => {
    const [subjectsRes, tasksRes, scheduleRes] = await Promise.all([
      api.get("/subjects"),
      api.get("/tasks"),
      api.get("/schedule")
    ]);

    setSubjects(subjectsRes.data);
    setTasks(tasksRes.data);
    setSchedule(scheduleRes.data.sessions);

    if (subjectsRes.data.length && !taskForm.subject) {
      setTaskForm((prev) => ({ ...prev, subject: subjectsRes.data[0]._id }));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onChange = (e) => setTaskForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    await api.post("/tasks", taskForm);
    setTaskForm((prev) => ({ ...initialTask, subject: prev.subject }));
    loadData();
  };

  const markDone = async (id) => {
    await api.put(`/tasks/${id}`, { status: "completed" });
    loadData();
  };

  return (
    <div className="page">
      <div className="page-head">
        <h1>Planner</h1>
        <p className="muted">Create tasks and let the scheduler map focused study sessions.</p>
      </div>
      <div className="grid two-col">
        <form className="card" onSubmit={onSubmit}>
          <h2>Add Study Task</h2>
          <select name="subject" value={taskForm.subject} onChange={onChange} required>
            <option value="">Select subject</option>
            {subjects.map((subject) => (
              <option value={subject._id} key={subject._id}>
                {subject.name}
              </option>
            ))}
          </select>
          <input name="title" placeholder="Task title" value={taskForm.title} onChange={onChange} required />
          <textarea
            name="description"
            placeholder="Task description"
            value={taskForm.description}
            onChange={onChange}
          />
          <label>Due date</label>
          <input name="dueDate" type="date" value={taskForm.dueDate} onChange={onChange} required />
          <label>Estimated minutes</label>
          <input
            name="estimatedMinutes"
            type="number"
            min="15"
            value={taskForm.estimatedMinutes}
            onChange={onChange}
          />
          <label>Priority (1-5)</label>
          <input name="priority" type="number" min="1" max="5" value={taskForm.priority} onChange={onChange} />
          <button type="submit">Create Task</button>
        </form>

        <section className="card">
          <h2>Task List</h2>
          <div className="list">
            {tasks.map((task) => (
              <div key={task._id} className="list-item">
                <div>
                  <strong>{task.title}</strong>
                  <p className="small">{task.subject?.name}</p>
                  <p className="small">Due: {dayjs(task.dueDate).format("DD MMM YYYY")}</p>
                </div>
                {task.status !== "completed" ? (
                  <button onClick={() => markDone(task._id)}>Done</button>
                ) : (
                  <span className="pill">Completed</span>
                )}
              </div>
            ))}
            {tasks.length === 0 ? <p className="muted">No tasks created yet.</p> : null}
          </div>
        </section>
      </div>

      <section className="card">
        <h2>Smart Schedule Sessions</h2>
        <div className="list">
          {schedule.map((slot, idx) => (
            <div key={`${slot.taskId}-${idx}`} className="list-item">
              <div>
                <strong>{slot.title}</strong>
                <p className="small">{slot.subject}</p>
              </div>
              <div>
                <p>{dayjs(slot.start).format("DD MMM, hh:mm A")}</p>
                <p className="small">{slot.durationMinutes} min</p>
              </div>
            </div>
          ))}
          {schedule.length === 0 ? <p className="muted">No schedule yet. Add tasks first.</p> : null}
        </div>
      </section>
    </div>
  );
};

export default PlannerPage;
