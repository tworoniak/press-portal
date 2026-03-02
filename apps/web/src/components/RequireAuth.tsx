import type React from 'react';
import { Navigate } from 'react-router-dom';

export function RequireAuth({ children }: { children: React.ReactElement }) {
  const token = localStorage.getItem('pp_token');
  return token ? children : <Navigate to='/login' replace />;
}
