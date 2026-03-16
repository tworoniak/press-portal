import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ContactsPage from './features/contacts/ContactsPage';
import ContactDetailPage from './features/contacts/ContactDetailPage';
import DashboardPage from './features/dashboard/DashboardPage';
import LoginPage from './pages/LoginPage';
import { RequireAuth } from './components/RequireAuth';
import BandDetailPage from './features/bands/BandDetailPage';
import FestivalDetailPage from './features/festivals/FestivalDetailPage';
import { CommandPalette } from './components/ui/CommandPalette/CommandPalette';
import FestivalsPage from './features/festivals/FestivalsPage';
import BandsPage from './features/bands/BandsPage';
import AppLayout from './components/layout/AppLayout/AppLayout';

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/' element={<Navigate to='/dashboard' replace />} />

          <Route element={<RequireAuth />}>
            <Route element={<AppLayout />}>
              <Route path='/dashboard' element={<DashboardPage />} />
              <Route path='/contacts' element={<ContactsPage />} />
              <Route path='/contacts/:id' element={<ContactDetailPage />} />
              <Route path='/bands' element={<BandsPage />} />
              <Route path='/bands/:id' element={<BandDetailPage />} />
              <Route path='/festivals' element={<FestivalsPage />} />
              <Route path='/festivals/:id' element={<FestivalDetailPage />} />
            </Route>
          </Route>
        </Routes>

        {/* </div> */}
        <CommandPalette />
      </BrowserRouter>
    </>
  );
}
