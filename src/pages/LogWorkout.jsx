import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import './LogWorkout.css';

const TYPES = ['Cardio', 'Strength', 'Yoga/Stretching', 'Sports', 'Walking/Running', 'Custom'];

export default function LogWorkout() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    type: '',
    duration: '',
    intensity: 'Med',
    date: new Date().toISOString().split('T')[0],
    calories: '',
    notes: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.type) {
      setError('Please select a workout type');
      return;
    }
    if (!form.duration || parseInt(form.duration) < 1) {
      setError('Please enter a valid duration');
      return;
    }

    setLoading(true);
    try {
      await API.post('/api/workouts', {
        type: form.type,
        duration: parseInt(form.duration),
        intensity: form.intensity,
        date: new Date(form.date).toISOString(),
        calories: form.calories ? parseInt(form.calories) : null,
        notes: form.notes,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save workout');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div>
        <div className="page-header log-header">
          <h1>Log Workout</h1>
        </div>
        <div className="success-message card">
          <h3>Workout saved successfully</h3>
          <p>Your {form.type} session has been logged.</p>
          <div className="success-actions">
            <button className="btn btn-primary" onClick={() => { setSuccess(false); setForm({ type: '', duration: '', intensity: 'Med', date: new Date().toISOString().split('T')[0], calories: '', notes: '' }); }}>
              Log Another
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/workout')}>
              View Workouts
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header page-header-row log-header">
        <div>
          <h1>Log Workout</h1>
          <p>Capture the key details from your latest session in one clean entry form.</p>
        </div>
        <button className="close-btn" onClick={() => navigate('/workout')}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      {error && <div className="alert alert-error" style={{ marginTop: 16 }}>{error}</div>}

      <form className="log-form card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Workout Type</label>
          <select className="form-input" value={form.type} onChange={(e) => handleChange('type', e.target.value)}>
            <option value="">Select type...</option>
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Duration (minutes)</label>
          <input
            type="number"
            className="form-input"
            placeholder="Enter duration..."
            min="1"
            value={form.duration}
            onChange={(e) => handleChange('duration', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Intensity Level</label>
          <div className="toggle-group">
            {['Low', 'Med', 'High'].map((level) => (
              <button
                key={level}
                type="button"
                className={form.intensity === level ? 'active' : ''}
                onClick={() => handleChange('intensity', level)}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Date & Time</label>
          <input
            type="date"
            className="form-input"
            value={form.date}
            onChange={(e) => handleChange('date', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Calories Burned (optional)</label>
          <input
            type="number"
            className="form-input"
            placeholder="Enter calories..."
            min="0"
            value={form.calories}
            onChange={(e) => handleChange('calories', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Notes (optional)</label>
          <textarea
            className="form-input"
            placeholder="Add notes..."
            value={form.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
          />
        </div>

        <div className="log-actions">
          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Save Workout'}
          </button>
        </div>
      </form>
    </div>
  );
}
