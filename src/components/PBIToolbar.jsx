import { useNavigate, useLocation } from 'react-router-dom';

const pages = [
  { label: 'Member Search',  path: '/search' },
  { label: 'Member Profile', path: '/member/M-00847' },
  { label: 'Audit Log',      path: '/audit' },
];

export default function PBIToolbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div>
      <div className="pbi-toolbar">
        <span style={{ fontWeight: 600, fontSize: 12, color: '#252423', marginRight: 8 }}>SBCERS Member Analytics</span>
        <div style={{ flex: 1 }} />
        <button onClick={() => alert('Refreshing data…')}>↻ Refresh</button>
        <button onClick={() => alert('Exporting data… audit log entry created.')}>↓ Export</button>
        <button onClick={() => alert('Share link copied to clipboard.')}>⤴ Share</button>
      </div>
      <div className="pbi-tabs">
        {pages.map(p => (
          <div
            key={p.path}
            className={`pbi-tab ${pathname.startsWith(p.path.split('/').slice(0,2).join('/')) ? 'active' : ''}`}
            onClick={() => navigate(p.path)}
          >
            {p.label}
          </div>
        ))}
      </div>
    </div>
  );
}
