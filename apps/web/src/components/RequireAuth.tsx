import { Navigate, Outlet, useLocation } from 'react-router-dom';

export function RequireAuth() {
  const location = useLocation();
  const token = localStorage.getItem('pp_token');

  if (!token) {
    return (
      <Navigate
        to='/login'
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  return <Outlet />;
}
