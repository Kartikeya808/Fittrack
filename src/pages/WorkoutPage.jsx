import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import './WorkoutPage.css';

const CATEGORIES = [
  { name: 'Cardio', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { name: 'Strength', icon: 'M6 4v16M18 4v16M6 12h12M2 8h4M18 8h4M2 16h4M18 16h4' },
  { name: 'Yoga/Stretching', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' },
  { name: 'Sports', icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4z' },
  { name: 'Walking/Running', icon: 'M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7' },
  { name: 'Custom', icon: 'M12 4v16m8-8H4' },
];

export default function WorkoutPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkouts();
  }, [selectedCategory]);

  const fetchWorkouts = async () => {
    try {
      const params = {};
      if (selectedCategory) params.type = selectedCategory;
      if (search) params.search = search;
      const res = await API.get('/api/workouts', { params });
      setWorkouts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchWorkouts();
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleCategoryClick = (name) => {
    setSelectedCategory(selectedCategory === name ? '' : name);
    setLoading(true);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Workout Tracking</h1>
        <p>Select workout type</p>
      </div>

      <form className="workout-search" onSubmit={handleSearch}>
        <input
          type="text"
          className="search-input"
          placeholder="Search workouts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>

      <div className="section-header">
        <span className="section-title">Workout Categories</span>
        <Link to="/workout/log" className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '8px 16px' }}>
          + Log Workout
        </Link>
      </div>

      <div className="category-grid">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.name}
            className={`category-card${selectedCategory === cat.name ? ' selected' : ''}`}
            onClick={() => handleCategoryClick(cat.name)}
          >
            <svg className="category-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d={cat.icon} />
            </svg>
            {cat.name}
          </div>
        ))}
      </div>

      <div className="section-header">
        <span className="section-title">Recent Workouts</span>
      </div>
      <div className="recent-list">
        {loading ? (
          <div style={{ padding: 24, textAlign: 'center' }}><span className="spinner" /></div>
        ) : workouts.length > 0 ? (
          workouts.map((w) => (
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
              <p style={{ color: 'var(--text-muted)' }}>No workouts found</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
