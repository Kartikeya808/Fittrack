import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function Layout() {
  return (
    <>
      <main className="page">
        <div className="container">
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </>
  );
}