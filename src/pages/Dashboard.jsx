import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import './Dashboard.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/api/stats/dashboard')
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>FitTrack</h1>
          <p className="dashboard-subtitle">Dashboard</p>
        </div>
        <button className="logout-btn" onClick={logout}>Sign Out</button>
      </div>

      <div className="section-header" style={{ marginTop: 24 }}>
        <span className="section-title">Quick Stats</span>
      </div>

      <div className="dashboard-stats">
        <div className="card stat-card">
          <span className="stat-label">Today's Activity</span>
          <div>
            <span className="stat-value">{loading ? '--' : data?.todayMinutes || 0}</span>
            <span className="stat-unit">min</span>
          </div>
        </div>
        <div className="card stat-card">
          <span className="stat-label">Week Total</span>
          <div>
            <span className="stat-value">{loading ? '--' : data?.weekMinutes || 0}</span>
            <span className="stat-unit">min</span>
          </div>
        </div>
      </div>

      <div className="section-header">
        <span className="section-title">Today's Schedule</span>
      </div>
      <div className="card schedule-card">
        {loading ? (
          <div className="schedule-empty"><span className="spinner" /></div>
        ) : data?.todaySchedule ? (
          <div className="schedule-workout">
            <div>
              <div className="schedule-type">{data.todaySchedule.type}</div>
              <div className="schedule-meta">{data.todaySchedule.duration} min &middot; {data.todaySchedule.intensity}</div>
            </div>
            <span className="workout-entry-duration">{formatDate(data.todaySchedule.date)}</span>
          </div>
        ) : (
          <div className="schedule-empty">No workouts scheduled</div>
        )}
      </div>

      <div className="section-header">
        <span className="section-title">Recent Activity</span>
      </div>
      <div className="recent-list">
        {loading ? (
          <div style={{ padding: 24, textAlign: 'center' }}><span className="spinner" /></div>
        ) : data?.recentWorkouts?.length > 0 ? (
          data.recentWorkouts.map((w) => (
            <div key={w._id} className="workout-entry">
              <div className="workout-entry-info">
                <h4>{w.type}</h4>
                <p>{formatDate(w.date)}</p>
              </div>
              <span className="workout-entry-duration">{w.duration} min</span>
            </div>
          ))
        ) : (
          <div className="workout-entry">
            <div className="workout-entry-info">
              <p style={{ color: 'var(--text-muted)' }}>No workouts yet. Start tracking!</p>
            </div>
          </div>
        )}
      </div>

      <div className="dashboard-actions">
        <Link to="/workout/log" className="btn btn-primary btn-lg" style={{ flex: 1 }}>
          Start Quick Workout
        </Link>
        <Link to="/workout" className="btn btn-ghost">View All</Link>
      </div>
    </div>
  );
}
