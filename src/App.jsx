import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { ModeProvider, useMode } from './context/ModeContext';
import TopNav from './components/TopNav';
import SideNav from './components/SideNav';
import PBIToolbar from './components/PBIToolbar';
import MemberSearch from './screens/MemberSearch';
import MemberProfile from './screens/MemberProfile';
import BenefitPayroll from './screens/BenefitPayroll';
import Contributions from './screens/Contributions';
import Reports from './screens/Reports';
import AuditLog from './screens/AuditLog';
import ExceptionReports from './screens/ExceptionReports';

function AppShell() {
  const { mode } = useMode();
  const isPBI = mode === 'powerbi';
  const [transitioning, setTransitioning] = useState(false);

  return (
    <div className="app-shell">
      <TopNav />
      {isPBI && <PBIToolbar />}
      <div className="app-body">
        <SideNav />
        <main className={`main-content${transitioning ? ' transitioning' : ''}`}>
          <Routes>
            <Route path="/" element={<Navigate to="/search" replace />} />
            <Route path="/search" element={<MemberSearch />} />
            <Route path="/member/:id" element={<MemberProfile />} />
            <Route path="/payroll" element={<BenefitPayroll />} />
            <Route path="/contributions" element={<Contributions />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/audit" element={<AuditLog />} />
            <Route path="/exceptions" element={<ExceptionReports />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ModeProvider>
        <AppShell />
      </ModeProvider>
    </BrowserRouter>
  );
}
