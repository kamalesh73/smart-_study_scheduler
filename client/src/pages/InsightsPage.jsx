import { useEffect, useState } from "react";
import api from "../api/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
import StatCard from "../components/StatCard";

const InsightsPage = () => {
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get("/insights");
      setInsights(data);
    };

    load();
  }, []);

  return (
    <div className="page">
      <div className="page-head">
        <h1>Insights</h1>
        <p className="muted">Measure consistency and compare progress by subject.</p>
      </div>
      <div className="grid stats-grid">
        <StatCard label="Weekly Completed" value={insights?.weekCompleted || 0} />
        <StatCard label="Completion Rate" value={`${insights?.completionRate || 0}%`} />
        <StatCard label="Hours Completed" value={insights?.hoursCompleted || 0} />
        <StatCard label="Total Tasks" value={insights?.totalTasks || 0} />
      </div>

      <section className="card chart-card">
        <h2>Subject Progress</h2>
        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer>
            <BarChart data={insights?.subjectBreakdown || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="progress" fill="#1565C0" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};

export default InsightsPage;
