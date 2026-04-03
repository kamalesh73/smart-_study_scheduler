import { useEffect, useState } from "react";
import api from "../api/client";

const initialForm = {
  name: "",
  difficulty: 3,
  weeklyGoalHours: 6,
  targetExamDate: "",
  color: "#1E88E5"
};

const SubjectsPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState(initialForm);

  const loadSubjects = async () => {
    const { data } = await api.get("/subjects");
    setSubjects(data);
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    await api.post("/subjects", form);
    setForm(initialForm);
    loadSubjects();
  };

  const onDelete = async (id) => {
    await api.delete(`/subjects/${id}`);
    loadSubjects();
  };

  return (
    <div className="page">
      <div className="page-head">
        <h1>Subjects</h1>
        <p className="muted">Track difficulty, exam targets, and weekly focus goals.</p>
      </div>
      <div className="grid two-col">
        <form className="card" onSubmit={onSubmit}>
          <h2>Add Subject</h2>
          <input name="name" placeholder="Subject name" value={form.name} onChange={onChange} required />
          <label>Difficulty (1-5)</label>
          <input name="difficulty" type="number" min="1" max="5" value={form.difficulty} onChange={onChange} />
          <label>Weekly Goal Hours</label>
          <input
            name="weeklyGoalHours"
            type="number"
            min="1"
            max="70"
            value={form.weeklyGoalHours}
            onChange={onChange}
          />
          <label>Target Exam Date</label>
          <input name="targetExamDate" type="date" value={form.targetExamDate} onChange={onChange} />
          <label>Color</label>
          <input name="color" type="color" value={form.color} onChange={onChange} />
          <button type="submit">Create Subject</button>
        </form>

        <section className="card">
          <h2>Your Subjects</h2>
          <div className="list">
            {subjects.map((subject) => (
              <div key={subject._id} className="list-item">
                <div>
                  <strong>{subject.name}</strong>
                  <p className="small">Difficulty: {subject.difficulty}</p>
                  <p className="small">Goal: {subject.weeklyGoalHours}h/week</p>
                </div>
                <button className="danger" onClick={() => onDelete(subject._id)}>
                  Delete
                </button>
              </div>
            ))}
            {subjects.length === 0 ? <p className="muted">No subjects yet.</p> : null}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SubjectsPage;
