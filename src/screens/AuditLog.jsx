import { useMode } from '../context/ModeContext';
import { auditLog } from '../data/sampleData';
import StatusBadge from '../components/StatusBadge';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ACTION_COLORS = { 'Viewed Record': '#0065A3', 'Downloaded Data': '#ED7D31', 'Ran Report': '#10B981' };

export default function AuditLog() {
  const { mode } = useMode();
  const isPBI = mode === 'powerbi';

  // Charts data
  const byUser = Object.entries(
    auditLog.reduce((acc, r) => { acc[r.user] = (acc[r.user] || 0) + 1; return acc; }, {})
  ).map(([user, count]) => ({ user, count }));

  const byAction = Object.entries(
    auditLog.reduce((acc, r) => { acc[r.action] = (acc[r.action] || 0) + 1; return acc; }, {})
  ).map(([action, value]) => ({ action, value }));

  const COLORS = ['#0065A3', '#ED7D31', '#10B981'];

  if (isPBI) {
    return (
      <div style={{ padding: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div className="pbi-visual">
            <div className="pbi-visual-title">Access by user (last 30 days)</div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={byUser} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="user" type="category" tick={{ fontSize: 11 }} width={80} />
                <Tooltip />
                <Bar dataKey="count" fill="#0065A3" radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="pbi-visual">
            <div className="pbi-visual-title">Access by action type</div>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={byAction} dataKey="value" nameKey="action" cx="50%" cy="50%" outerRadius={60} label={({ action }) => action.split(' ')[0]}>
                  {byAction.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="pbi-visual">
          <div className="pbi-visual-title">Audit log</div>
          <AuditTable isPBI />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 10px', color: '#0F172A' }}>Audit Log</h1>
        <div style={{ background: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: 8, padding: '8px 14px', marginBottom: 10, fontSize: 13, color: '#92400E', display: 'flex', alignItems: 'center', gap: 8 }}>
          ⚠️ This screen is visible to Admin role only. You are viewing as Member Services for demonstration purposes.
        </div>
        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <select style={{ padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: 6, fontSize: 13 }}>
          <option>All users</option>
          {[...new Set(auditLog.map(r => r.user))].map(u => <option key={u}>{u}</option>)}
        </select>
        <select style={{ padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: 6, fontSize: 13 }}>
          <option>All actions</option>
          <option>Viewed Record</option><option>Downloaded Data</option><option>Ran Report</option>
        </select>
        <select style={{ padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: 6, fontSize: 13 }}>
          <option>Last 30 days</option>
        </select>
        <div style={{ flex: 1 }} />
        <button onClick={() => alert('Downloading audit_log.xlsx — audit log entry created.')}
          style={{ padding: '8px 14px', background: '#185FA5', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>
          Export Audit Log (Excel)
        </button>
      </div>
      </div>

      <div className="card">
        <AuditTable isPBI={false} />
      </div>
    </div>
  );
}

function AuditTable({ isPBI }) {
  const ACTION_BADGE = {
    'Viewed Record': { bg: '#E6F1FB', color: '#0C447C' },
    'Downloaded Data': { bg: '#FAEEDA', color: '#633806' },
    'Ran Report': { bg: '#EAF3DE', color: '#3B6D11' },
  };
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Timestamp</th><th>User</th><th>Role</th><th>Member Accessed</th><th>Action</th><th>Details</th>
        </tr>
      </thead>
      <tbody>
        {auditLog.map(r => {
          const ab = ACTION_BADGE[r.action] || {};
          return (
            <tr key={r.id}>
              <td style={{ fontFamily: 'monospace', fontSize: 11 }}>{r.ts}</td>
              <td style={{ fontWeight: 500 }}>{r.user}</td>
              <td style={{ fontSize: 12, color: isPBI ? '#605E5C' : '#64748B' }}>{r.role}</td>
              <td>{r.member}</td>
              <td>
                <span className="badge" style={{ background: ab.bg, color: ab.color }}>{r.action}</span>
              </td>
              <td style={{ fontSize: 12, color: isPBI ? '#605E5C' : '#64748B' }}>{r.details}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
