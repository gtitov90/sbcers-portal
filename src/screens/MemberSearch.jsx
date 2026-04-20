import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useMode } from '../context/ModeContext';
import { members } from '../data/sampleData';
import StatusBadge from '../components/StatusBadge';
import MemberAvatar from '../components/MemberAvatar';

const STATUSES = ['Active', 'Retired', 'Deferred', 'Survivor'];
const AGENCIES = ['County of Santa Barbara', 'Carpinteria-Summerland Fire', 'Goleta Cemetery District'];

export default function MemberSearch() {
  const { mode } = useMode();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState([]);
  const [agencyFilter, setAgencyFilter] = useState([]);
  const [statusSelect, setStatusSelect] = useState('');
  const [agencySelect, setAgencySelect] = useState('');

  const filtered = members.filter(m => {
    const q = query.toLowerCase();
    const matchQ = !q || m.name.toLowerCase().includes(q) || m.id.toLowerCase().includes(q);
    const matchStatus = mode === 'powerbi'
      ? (statusFilter.length === 0 || statusFilter.includes(m.status))
      : (!statusSelect || m.status === statusSelect);
    const matchAgency = mode === 'powerbi'
      ? (agencyFilter.length === 0 || agencyFilter.includes(m.agency))
      : (!agencySelect || m.agency === agencySelect);
    return matchQ && matchStatus && matchAgency;
  });

  const toggleFilter = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);

  const goToMember = (id) => {
    if (mode === 'powerbi') {
      alert(`Drilling through to: Member Profile — ${id}`);
    }
    navigate(`/member/${id}`);
  };

  if (mode === 'powerbi') {
    return (
      <div style={{ display: 'flex', gap: 0, height: '100%' }}>
        {/* Main content */}
        <div style={{ flex: 1, padding: '16px' }}>
          <div className="pbi-visual">
            <div className="pbi-visual-title">Member list</div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th><th>Member ID</th><th>Status</th>
                  <th>Agency</th><th>Plan Tier</th><th>Yrs Service</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(m => (
                  <tr key={m.id} style={{ cursor: 'pointer' }} onClick={() => goToMember(m.id)}>
                    <td style={{ color: '#0065A3', fontWeight: 500 }}>{m.name}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{m.id}</td>
                    <td><StatusBadge value={m.status} /></td>
                    <td>{m.agency}</td>
                    <td>{m.tier}</td>
                    <td>{m.yearsService ?? '—'}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: 'center', color: '#94A3B8', padding: 32 }}>No members found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Filter pane */}
        <div className="filter-pane">
          <h4>Filters</h4>
          <div className="filter-section">
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Member Status</div>
            {STATUSES.map(s => (
              <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, cursor: 'pointer', fontSize: 12 }}>
                <input type="checkbox" checked={statusFilter.includes(s)} onChange={() => toggleFilter(statusFilter, setStatusFilter, s)} />
                {s}
              </label>
            ))}
          </div>
          <div className="filter-section">
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Agency</div>
            {AGENCIES.map(a => (
              <label key={a} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, cursor: 'pointer', fontSize: 12 }}>
                <input type="checkbox" checked={agencyFilter.includes(a)} onChange={() => toggleFilter(agencyFilter, setAgencyFilter, a)} />
                {a}
              </label>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Custom App mode
  return (
    <div style={{ maxWidth: 900 }}>
      <div className="page-header">
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', margin: '0 0 12px' }}>Member Search</h1>
        {/* Filters */}
        <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search by name, member ID, or last 4 of SSN…"
            style={{ width: '100%', padding: '9px 12px 9px 36px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <select value={statusSelect} onChange={e => setStatusSelect(e.target.value)}
          style={{ padding: '9px 12px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14, background: '#fff' }}>
          <option value="">All statuses</option>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={agencySelect} onChange={e => setAgencySelect(e.target.value)}
          style={{ padding: '9px 12px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14, background: '#fff' }}>
          <option value="">All agencies</option>
          {AGENCIES.map(a => <option key={a}>{a}</option>)}
        </select>
      </div>
      </div>

      {/* Count */}
      <div style={{ fontSize: 13, color: '#64748B', marginBottom: 12 }}>
        Showing {filtered.length} of {members.length} members
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 48, color: '#94A3B8' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>No members found</div>
          <div style={{ fontSize: 13 }}>Try a different name or ID.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(m => (
            <div key={m.id} onClick={() => goToMember(m.id)}
              style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 8, padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, transition: 'box-shadow 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              <MemberAvatar name={m.name} status={m.status} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: '#0F172A' }}>{m.name}</div>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{m.agency} · {m.tier}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 12, color: '#64748B', fontFamily: 'monospace' }}>{m.id}</span>
                <StatusBadge value={m.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
