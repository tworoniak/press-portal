import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import ContactsPage from './features/contacts/ContactsPage';
import ContactDetailPage from './features/contacts/ContactDetailsPage';
import DashboardPage from './features/dashboard/DashboardPage';
import LoginPage from './pages/LoginPage';
import { RequireAuth } from './components/RequireAuth';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: 16 }}>
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link to='/dashboard'>Dashboard</Link>
            <Link to='/contacts'>Contacts</Link>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem('pp_token');
              window.location.href = '/login';
            }}
          >
            Logout
          </button>
        </nav>

        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/' element={<Navigate to='/dashboard' replace />} />
          <Route
            path='/dashboard'
            element={
              <RequireAuth>
                <DashboardPage />
              </RequireAuth>
            }
          />
          <Route
            path='/contacts'
            element={
              <RequireAuth>
                <ContactsPage />
              </RequireAuth>
            }
          />
          <Route path='/contacts/:id' element={<ContactDetailPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
