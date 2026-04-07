import { Link, Outlet, useLocation } from 'react-router-dom';

import BottomNav from './BottomNav';
import BrandLogo from './BrandLogo';
import { useAuth } from '../context/AuthContext';

function getSectionLabel(pathname) {
  if (pathname === '/') return 'Dashboard';
  if (pathname.startsWith('/workout/log')) return 'Log Workout';
  if (pathname.startsWith('/workout')) return 'Workouts';
  if (pathname.startsWith('/goals')) return 'Goals';
  if (pathname.startsWith('/progress')) return 'Progress';
  return 'FitTrack';
}

export default function Layout() {
  const { user } = useAuth();
  const location = useLocation();
  const firstName = user?.name?.trim().split(/\s+/)[0] || 'Athlete';

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="container">
          <div className="app-header-inner">
            <Link to="/" className="brand-link">
              <BrandLogo className="brand-logo" />
              <div className="brand-copy">
                <span className="brand-kicker">Performance Tracking</span>
                <span className="brand-name">FitTrack</span>
              </div>
            </Link>

            <div className="app-header-meta">
              <span className="app-header-label">{getSectionLabel(location.pathname)}</span>
              <span className="app-header-user">{firstName}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="page">
        <div className="container">
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
