import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getDemoProgress } from '../demoStore';
import './ProgressPage.css';

export default function ProgressPage() {
  const [period, setPeriod] = useState('week');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setData(getDemoProgress(period));
    setLoading(false);
  }, [period]);

  const summary = data?.summary || { totalTime: 0, totalSessions: 0, avgDuration: 0, totalCalories: 0 };

  const periodLabel = period === 'week' ? "This Week's" : period === 'month' ? "This Month's" : "This Year's";

  return (
    <div>
      <div className="page-header">
        <h1>Progress</h1>
        <p>Your fitness journey</p>
      </div>

      <div className="period-toggle">
        <div className="toggle-group">
          {['week', 'month', 'year'].map((p) => (
            <button
              key={p}
              className={period === p ? 'active' : ''}
              onClick={() => setPeriod(p)}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-title">{periodLabel} Activity (minutes)</div>
        {loading ? (
          <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="spinner" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data?.chart || []} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
              />
              <Tooltip
                contentStyle={{
                  background: '#FFFFFF',
                  border: '1px solid #D9E2EC',
                  borderRadius: '14px',
                  color: '#0F172A',
                  fontSize: '0.8rem',
                  padding: '10px 12px',
                  boxShadow: '0 18px 38px rgba(15, 23, 42, 0.12)',
                }}
                itemStyle={{ color: '#0F172A' }}
                cursor={{ fill: 'rgba(148, 163, 184, 0.16)' }}
              />
              <Bar dataKey="minutes" fill="#0F172A" radius={[8, 8, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="section-header">
        <span className="section-title">{periodLabel} Summary</span>
      </div>

      <div className="summary-grid">
        <div className="card summary-card">
          <div className="summary-label">Total Time</div>
          <div className="summary-value">
            {Math.round(summary.totalTime)}
            <span className="summary-unit">min</span>
          </div>
        </div>
        <div className="card summary-card">
          <div className="summary-label">Workouts</div>
          <div className="summary-value">
            {summary.totalSessions}
            <span className="summary-unit">sessions</span>
          </div>
        </div>
        <div className="card summary-card">
          <div className="summary-label">Avg Duration</div>
          <div className="summary-value">
            {Math.round(summary.avgDuration || 0)}
            <span className="summary-unit">min</span>
          </div>
        </div>
        <div className="card summary-card">
          <div className="summary-label">Calories</div>
          <div className="summary-value">
            ~{Math.round(summary.totalCalories)}
            <span className="summary-unit">kcal</span>
          </div>
        </div>
      </div>

      <div className="section-header">
        <span className="section-title">Recent Achievements</span>
      </div>

      <ul className="achievements-list card">
        {summary.totalSessions >= 1 && (
          <li className="achievement-item">
            <div className="achievement-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </div>
            <div>
              <div className="achievement-text">First workout logged</div>
              <div className="achievement-date">Keep it up</div>
            </div>
          </li>
        )}
        {summary.totalSessions >= 5 && (
          <li className="achievement-item">
            <div className="achievement-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>
            </div>
            <div>
              <div className="achievement-text">5 workouts completed</div>
              <div className="achievement-date">Consistency streak</div>
            </div>
          </li>
        )}
        {summary.totalTime >= 100 && (
          <li className="achievement-item">
            <div className="achievement-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div>
              <div className="achievement-text">100+ minutes active</div>
              <div className="achievement-date">Milestone reached</div>
            </div>
          </li>
        )}
        {summary.totalSessions === 0 && (
          <li className="achievement-item">
            <div className="achievement-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <div>
              <div className="achievement-text">No achievements yet</div>
              <div className="achievement-date">Start logging workouts to earn badges</div>
            </div>
          </li>
        )}
      </ul>
    </div>
  );
}
