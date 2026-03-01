import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import ContactsPage from './features/contacts/ContactsPage';
import ContactDetailPage from './features/contacts/ContactDetailsPage';
import DashboardPage from './features/dashboard/DashboardPage';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: 16 }}>
        <nav style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <Link to='/dashboard'>Dashboard</Link>
          <Link to='/contacts'>Contacts</Link>
        </nav>

        <Routes>
          <Route path='/' element={<Navigate to='/dashboard' replace />} />
          <Route path='/dashboard' element={<DashboardPage />} />
          <Route path='/contacts' element={<ContactsPage />} />
          <Route path='/contacts/:id' element={<ContactDetailPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
