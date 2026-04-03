const StatCard = ({ label, value, note }) => (
  <div className="card stat-card">
    <p className="small muted">{label}</p>
    <h3>{value}</h3>
    {note ? <p className="muted">{note}</p> : null}
  </div>
);

export default StatCard;
