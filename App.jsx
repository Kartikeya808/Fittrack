import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import Layout from './src/components/Layout';
import ProtectedRoute from './src/components/ProtectedRoute.jsx';
import { AuthProvider } from './src/context/AuthContext';
import Dashboard from './src/pages/Dashboard';
import GoalsPage from './src/pages/GoalsPage';
import LogWorkout from './src/pages/LogWorkout';
import LoginPage from './src/pages/LoginPage';
import ProgressPage from './src/pages/ProgressPage';
import RegisterPage from './src/pages/RegisterPage';
import WorkoutPage from './src/pages/WorkoutPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/workout" element={<WorkoutPage />} />
            <Route path="/workout/log" element={<LogWorkout />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/progress" element={<ProgressPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
