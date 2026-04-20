import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMode } from '../context/ModeContext';
import { payrollRecords } from '../data/sampleData';
import StatusBadge from '../components/StatusBadge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const agencyTotals = [
  { agency: 'County of SB', total: 21400000 },
  { agency: 'CSF', total: 6400 },
  { agency: 'Goleta Cem.', total: 2100 },
];

export default function BenefitPayroll() {
  const { mode } = useMode();
  const navigate = useNavigate();
  const [agencyFilter, setAgencyFilter] = useState('');
  const [tierFilter, setTierFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [statusPBIFilter, setStatusPBIFilter] = useState([]);

  const isPBI = mode === 'powerbi';

  const filtered = payrollRecords.filter(r =>
    (!agencyFilter || r.agency === agencyFilter) &&
    (!tierFilter || r.tier === tierFilter) &&
    (!methodFilter || r.method === methodFilter) &&
    (!statusPBIFilter.length || statusPBIFilter.includes(r.status))
  );

  const PayrollTable = () => (
    <table className="data-table">
      <thead>
        <tr>
          <th>Member Name</th><th>Member ID</th><th>Agency</th><th>Plan Tier</th>
          <th>Gross Benefit</th><th>Health Ded.</th><th>Net Payment</th><th>Method</th><th>Status</th>
        </tr>
      </thead>
      <tbody>
        {filtered.map((r, i) => (
          <tr key={i}>
            <td><span style={{ color: isPBI ? '#0065A3' : '#185FA5', cursor: 'pointer', fontWeight: 500 }} onClick={() => navigate(`/member/${r.memberId}`)}>{r.name}</span></td>
            <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{r.memberId}</td>
            <td>{r.agency}</td><td>{r.tier}</td>
            <td>${r.gross.toLocaleString()}</td>
            <td>${r.healthDed.toLocaleString()}</td>
            <td style={{ fontWeight: 600 }}>${r.net.toLocaleString()}</td>
            <td>{r.method}</td>
            <td><StatusBadge value={r.status} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  if (isPBI) {
    return (
      <div style={{ display: 'flex', gap: 0 }}>
        <div style={{ flex: 1, padding: 16 }}>
          <div className="kpi-row cols-4" style={{ marginBottom: 16 }}>
            {[
              { label: 'Total Payroll', value: '$21.4M' },
              { label: 'Members on Payroll', value: '5,500' },
              { label: 'COLA Rate', value: '2.3%' },
              { label: 'Members on Hold', value: '1' },
            ].map(k => (
              <div key={k.label} className="kpi-card">
                <div className="kpi-label">{k.label}</div>
                <div className="kpi-value">{k.value}</div>
              </div>
            ))}
          </div>
          <div className="pbi-visual">
            <div className="pbi-visual-title">Payroll by agency</div>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={agencyTotals} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="agency" type="category" tick={{ fontSize: 11 }} width={80} />
                <Tooltip />
                <Bar dataKey="total" fill="#0065A3" radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="pbi-visual">
            <div className="pbi-visual-title">Payroll — April 2026</div>
            <PayrollTable />
          </div>
        </div>
        <div className="filter-pane">
          <h4>Filters</h4>
          <div className="filter-section">
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Status</div>
            {['Paid', 'Pending', 'On Hold'].map(s => (
              <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, cursor: 'pointer', fontSize: 12 }}>
                <input type="checkbox" checked={statusPBIFilter.includes(s)} onChange={() => setStatusPBIFilter(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])} />
                {s}
              </label>
            ))}
          </div>
          <div className="filter-section">
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Payment Method</div>
            {['Direct Deposit', 'Check'].map(s => (
              <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, cursor: 'pointer', fontSize: 12 }}>
                <input type="checkbox" checked={methodFilter === s} onChange={() => setMethodFilter(prev => prev === s ? '' : s)} />
                {s}
              </label>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: '#0F172A' }}>Benefit Payroll</h1>
          <div style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>April 2026 payroll run — 5,500 members on payroll.</div>
        </div>
        <button onClick={() => alert('Downloading payroll_report.xlsx — audit log entry created.')}
          style={{ padding: '8px 14px', background: '#185FA5', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>
          Download Payroll Report (Excel)
        </button>
      </div>

      <div className="kpi-row cols-3" style={{ marginBottom: 20 }}>
        {[
          { label: 'Total Payroll This Month', value: '$21.4M' },
          { label: 'Members on Payroll', value: '5,500' },
          { label: 'COLA Applied', value: '2.3%' },
        ].map(k => (
          <div key={k.label} className="metric-card">
            <div style={{ fontSize: 11, color: '#64748B', marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#0F172A' }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <select value={agencyFilter} onChange={e => setAgencyFilter(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: 6, fontSize: 13 }}>
          <option value="">All agencies</option>
          {[...new Set(payrollRecords.map(r => r.agency))].map(a => <option key={a}>{a}</option>)}
        </select>
        <select value={tierFilter} onChange={e => setTierFilter(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: 6, fontSize: 13 }}>
          <option value="">All tiers</option>
          {[...new Set(payrollRecords.map(r => r.tier))].map(t => <option key={t}>{t}</option>)}
        </select>
        <select value={methodFilter} onChange={e => setMethodFilter(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: 6, fontSize: 13 }}>
          <option value="">All methods</option>
          <option>Direct Deposit</option><option>Check</option>
        </select>
      </div>

      <div className="card">
        <PayrollTable />
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12, marginTop: 12, fontSize: 13, color: '#64748B' }}>
          <button style={{ padding: '6px 12px', border: '1px solid #E2E8F0', borderRadius: 6, background: '#fff', cursor: 'pointer' }}>← Previous</button>
          <span>Page 1 of 5</span>
          <button style={{ padding: '6px 12px', border: '1px solid #E2E8F0', borderRadius: 6, background: '#fff', cursor: 'pointer' }}>Next →</button>
        </div>
      </div>
    </div>
  );
}
