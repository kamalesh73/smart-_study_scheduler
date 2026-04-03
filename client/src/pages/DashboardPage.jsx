import { useEffect, useState } from "react";
import dayjs from "dayjs";
import api from "../api/client";
import StatCard from "../components/StatCard";

const DashboardPage = () => {
  const [insights, setInsights] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [insightsRes, tasksRes] = await Promise.all([
        api.get("/insights"),
        api.get("/tasks?status=pending")
      ]);
      setInsights(insightsRes.data);
      setTasks(tasksRes.data.slice(0, 6));
    };

    load();
  }, []);

  return (
    <div className="page">
      <div className="page-head">
        <h1>Dashboard</h1>
        <p className="muted">Your progress snapshot and upcoming priorities.</p>
      </div>
      <div className="grid stats-grid">
        <StatCard label="Completion Rate" value={`${insights?.completionRate || 0}%`} />
        <StatCard label="Tasks Done" value={insights?.completedTasks || 0} />
        <StatCard label="Pending Tasks" value={insights?.pendingTasks || 0} />
        <StatCard label="Hours Completed" value={insights?.hoursCompleted || 0} />
      </div>

      <section className="card">
        <h2>Upcoming Tasks</h2>
        {tasks.length === 0 ? (
          <p className="muted">No pending tasks. Great progress.</p>
        ) : (
          <div className="list">
            {tasks.map((task) => (
              <div key={task._id} className="list-item">
                <div>
                  <strong>{task.title}</strong>
                  <p className="muted">{task.subject?.name || "General"}</p>
                </div>
                <div>
                  <p>{dayjs(task.dueDate).format("DD MMM YYYY")}</p>
                  <p className="small">{task.estimatedMinutes} min</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardPage;
