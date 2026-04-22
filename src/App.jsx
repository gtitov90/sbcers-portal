import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';

const ACCESS_CODE = 'sbcers2026';
const STORAGE_KEY = 'sbcers_access';

function GateScreen({ onUnlock }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (input.trim().toLowerCase() === ACCESS_CODE) {
      sessionStorage.setItem(STORAGE_KEY, '1');
      onUnlock();
    } else {
      setError(true);
      setInput('');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F172A' }}>
      <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 12, padding: '40px 48px', width: 360, textAlign: 'center' }}>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#FFFFFF', marginBottom: 4 }}>SBCERS</div>
        <div style={{ fontSize: 13, color: '#94A3B8', marginBottom: 32 }}>Member Portal — Prototype</div>
        <form onSubmit={submit}>
          <input
            type="password"
            value={input}
            onChange={e => { setInput(e.target.value); setError(false); }}
            placeholder="Enter access code"
            autoFocus
            style={{
              width: '100%', padding: '10px 14px', borderRadius: 8, border: `1px solid ${error ? '#EF4444' : '#334155'}`,
              background: '#0F172A', color: '#FFFFFF', fontSize: 15, outline: 'none',
              boxSizing: 'border-box', marginBottom: error ? 8 : 16,
            }}
          />
          {error && <div style={{ fontSize: 12, color: '#EF4444', marginBottom: 12, textAlign: 'left' }}>Incorrect code. Try again.</div>}
          <button type="submit" style={{
            width: '100%', padding: '10px 0', borderRadius: 8, border: 'none',
            background: '#185FA5', color: '#FFFFFF', fontSize: 15, fontWeight: 600, cursor: 'pointer',
          }}>
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}
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
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(STORAGE_KEY) === '1');

  if (!unlocked) return <GateScreen onUnlock={() => setUnlocked(true)} />;

  return (
    <BrowserRouter>
      <ModeProvider>
        <AppShell />
      </ModeProvider>
    </BrowserRouter>
  );
}
