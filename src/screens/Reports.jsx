import { useNavigate } from 'react-router-dom';
import { useMode } from '../context/ModeContext';
import { reports } from '../data/sampleData';
import { Download, RefreshCw, Bell } from 'lucide-react';

export default function Reports() {
  const { mode } = useMode();
  const navigate = useNavigate();
  const isPBI = mode === 'powerbi';

  if (isPBI) {
    return (
      <div style={{ padding: 16 }}>
        <div className="pbi-visual">
          <div className="pbi-visual-title">Report subscriptions & exports</div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Report Name</th><th>Description</th><th>Last Refreshed</th>
                <th>Scheduled Refresh</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 500, color: '#0065A3' }}>{r.name}</td>
                  <td style={{ fontSize: 12, color: '#605E5C', maxWidth: 260 }}>{r.desc}</td>
                  <td>{r.lastGenerated}</td>
                  <td>{r.schedule}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => alert(`Subscription created. You will receive "${r.name}" by email on the configured schedule.`)}
                        style={{ padding: '3px 8px', fontSize: 11, border: '1px solid #E0DEDD', borderRadius: 2, cursor: 'pointer', background: '#fff', color: '#0065A3' }}>
                        <Bell size={10} style={{ display: 'inline', marginRight: 3 }} />Subscribe
                      </button>
                      <button
                        onClick={() => alert(`Exporting "${r.name}"…`)}
                        style={{ padding: '3px 8px', fontSize: 11, border: '1px solid #E0DEDD', borderRadius: 2, cursor: 'pointer', background: '#fff', color: '#252423' }}>
                        <Download size={10} style={{ display: 'inline', marginRight: 3 }} />Export
                      </button>
                      <button
                        onClick={() => alert(`Share link for "${r.name}" copied to clipboard.`)}
                        style={{ padding: '3px 8px', fontSize: 11, border: '1px solid #E0DEDD', borderRadius: 2, cursor: 'pointer', background: '#fff', color: '#252423' }}>
                        Share
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Custom App mode
  return (
    <div>
      <div className="page-header">
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: '#0F172A' }}>Reports</h1>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {reports.map(r => (
          <div key={r.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15, color: '#0F172A', marginBottom: 4 }}>
                {r.link
                  ? <span style={{ color: '#185FA5', cursor: 'pointer' }} onClick={() => navigate(r.link)}>{r.name}</span>
                  : r.name}
              </div>
              <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5 }}>{r.desc}</div>
            </div>
            <div style={{ fontSize: 12, color: '#94A3B8' }}>Last generated: {r.lastGenerated}</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
              <button
                onClick={() => alert(`Downloading ${r.name} — audit log entry created.`)}
                style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', background: '#185FA5', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>
                <Download size={13} /> Download (Excel)
              </button>
              <button
                onClick={() => alert(`Report queued. You will be notified when ready.`)}
                style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', border: '1px solid #E2E8F0', background: '#fff', borderRadius: 6, cursor: 'pointer', fontSize: 13, color: '#64748B' }}>
                <RefreshCw size={13} /> Generate now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
