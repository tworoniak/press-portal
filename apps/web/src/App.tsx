import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import ContactsPage from './features/contacts/ContactsPage';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: 16 }}>
        <nav style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <Link to='/contacts'>Contacts</Link>
        </nav>

        <Routes>
          <Route path='/' element={<Navigate to='/contacts' replace />} />
          <Route path='/contacts' element={<ContactsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
