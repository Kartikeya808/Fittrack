import { useState, useEffect } from 'react';
import API from '../api/axios';
import './GoalsPage.css';

const SUGGESTED_GOALS = [
  { title: 'Improve Flexibility', target: 3, unit: 'sessions/week' },
  { title: 'Daily Walking', target: 30, unit: 'min/day' },
  { title: 'Hydration Target', target: 8, unit: 'glasses/day' },
];

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [form, setForm] = useState({ title: '', target: '', current: '', unit: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const res = await API.get('/api/goals');
      setGoals(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditingGoal(null);
    setForm({ title: '', target: '', current: '0', unit: '' });
    setError('');
    setShowModal(true);
  };

  const openEdit = (goal) => {
    setEditingGoal(goal);
    setForm({ title: goal.title, target: String(goal.target), current: String(goal.current), unit: goal.unit });
    setError('');
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title || !form.target || !form.unit) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      if (editingGoal) {
        await API.put(`/api/goals/${editingGoal._id}`, {
          title: form.title,
          target: parseInt(form.target),
          current: parseInt(form.current) || 0,
          unit: form.unit,
        });
      } else {
        await API.post('/api/goals', {
          title: form.title,
          target: parseInt(form.target),
          current: parseInt(form.current) || 0,
          unit: form.unit,
        });
      }
      setShowModal(false);
      fetchGoals();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save goal');
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/api/goals/${id}`);
      fetchGoals();
    } catch (err) {
      console.error(err);
    }
  };

  const addSuggested = async (suggestion) => {
    try {
      await API.post('/api/goals', {
        title: suggestion.title,
        target: suggestion.target,
        current: 0,
        unit: suggestion.unit,
      });
      fetchGoals();
    } catch (err) {
      console.error(err);
    }
  };

  const getPercent = (current, target) => {
    if (!target) return 0;
    return Math.min(Math.round((current / target) * 100), 100);
  };

  return (
    <div>
      <div className="page-header page-header-row">
        <div>
          <h1>Goals</h1>
          <p>Set focused targets, monitor progress, and keep momentum visible.</p>
        </div>
        <button className="btn btn-primary page-header-button" onClick={openAdd}>
          Add Goal
        </button>
      </div>

      <div className="section-header" style={{ marginTop: 24 }}>
        <span className="section-title">Current Goals</span>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center' }}><span className="spinner" /></div>
      ) : goals.length > 0 ? (
        goals.map((goal) => {
          const pct = getPercent(goal.current, goal.target);
          return (
            <div key={goal._id} className="card goal-card">
              <div className="goal-header">
                <div>
                  <div className="goal-title">{goal.title}</div>
                  <div className="goal-target">{goal.target} {goal.unit}</div>
                </div>
                <div className="goals-actions">
                  <button className="btn btn-ghost" style={{ fontSize: '0.75rem' }} onClick={() => openEdit(goal)}>Edit</button>
                  <button className="btn btn-ghost" style={{ fontSize: '0.75rem', color: 'var(--error)' }} onClick={() => handleDelete(goal._id)}>Del</button>
                </div>
              </div>
              <div className="goal-progress-row">
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${pct}%` }} />
                </div>
                <span className="goal-percent">{pct}% Complete</span>
              </div>
            </div>
          );
        })
      ) : (
        <div className="empty-state">No goals set yet. Add your first goal above.</div>
      )}

      <div className="divider" />

      <div className="section-header">
        <span className="section-title">Suggested Goals</span>
      </div>

      {SUGGESTED_GOALS.map((s, idx) => (
        <div key={idx} className="card suggested-card">
          <span className="suggested-title">{s.title}</span>
          <button className="add-goal-btn" onClick={() => addSuggested(s)}>+Add to goals</button>
        </div>
      ))}

      {showModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal-card">
            <h2>{editingGoal ? 'Edit Goal' : 'New Goal'}</h2>
            {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Goal Title</label>
                <input className="form-input" placeholder="e.g. Weekly Exercise" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Target</label>
                  <input type="number" className="form-input" placeholder="150" min="1" value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Unit</label>
                  <input className="form-input" placeholder="min/week" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Current Progress</label>
                <input type="number" className="form-input" placeholder="0" min="0" value={form.current} onChange={(e) => setForm({ ...form, current: e.target.value })} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingGoal ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
