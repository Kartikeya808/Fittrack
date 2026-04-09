import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDemoDashboard } from '../demoStore';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const firstName = user?.name?.trim().split(/\s+/)[0] || 'Athlete';

  useEffect(() => {
    setData(getDemoDashboard());
    setLoading(false);
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div>
      <div className="dashboard-hero card">
        <div className="dashboard-hero-content">
          <span className="dashboard-eyebrow">Daily overview</span>
          <h1>Welcome back, {firstName}</h1>
          <p className="dashboard-subtitle">Review your activity, see what is scheduled, and keep your momentum moving forward.</p>
        </div>
        <div className="btn btn-secondary logout-btn" aria-hidden="true">Demo Mode</div>
      </div>

      <div className="dashboard-overview-grid">
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

        <div className="card schedule-card">
          <div className="schedule-card-header">
            <span className="section-title">Today's Schedule</span>
            <span className="schedule-chip">{loading ? 'Updating' : data?.todaySchedule ? 'Planned' : 'Open'}</span>
          </div>

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
            <div className="schedule-empty">No workout is scheduled yet for today.</div>
          )}
        </div>
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
        <Link to="/workout/log" className="btn btn-primary btn-lg">
          Start Quick Workout
        </Link>
        <Link to="/workout" className="btn btn-secondary">View All Workouts</Link>
      </div>
    </div>
  );
}
