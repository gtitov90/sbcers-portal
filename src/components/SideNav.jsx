import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Search, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMode } from '../context/ModeContext';

const navItems = [
  { to: '/search', label: 'Member Search', Icon: Search },
  { to: '/audit',  label: 'Audit Log',     Icon: Shield },
];

export default function SideNav() {
  const { mode } = useMode();
  const [collapsed, setCollapsed] = useState(false);
  const isPBI = mode === 'powerbi';

  const sidebarBg    = isPBI ? '#FAF9F8' : '#0F172A';
  const borderRight  = isPBI ? '1px solid #E0DEDD' : 'none';
  const toggleColor  = isPBI ? '#605E5C' : '#94A3B8';

  return (
    <aside
      className="sidebar"
      style={{
        width: collapsed ? 52 : 220,
        flexShrink: 0,
        background: sidebarBg,
        borderRight,
        display: 'flex',
        flexDirection: 'column',
        overflowY: collapsed ? 'visible' : 'auto',
        overflowX: 'hidden',
      }}
    >
      {/* Collapse toggle */}
      <div style={{
        display: 'flex',
        justifyContent: collapsed ? 'center' : 'flex-end',
        padding: '10px 10px 4px',
        flexShrink: 0,
      }}>
        <button
          className="sidebar-toggle"
          onClick={() => setCollapsed(c => !c)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{ color: toggleColor }}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav items */}
      <nav style={{ padding: collapsed ? '4px 6px' : '4px 8px', flex: 1 }}>
        {navItems.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            title={collapsed ? label : undefined}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start',
              gap: 10,
              padding: collapsed ? '10px 0' : '9px 12px',
              borderRadius: isPBI ? 2 : 6,
              marginBottom: 2,
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? (isPBI ? '#252423' : '#FFFFFF') : (isPBI ? '#605E5C' : '#94A3B8'),
              background: isActive ? (isPBI ? '#EDEBE9' : 'rgba(255,255,255,0.08)') : 'transparent',
              borderLeft: !collapsed && isActive ? `3px solid ${isPBI ? '#0065A3' : '#378ADD'}` : '3px solid transparent',
              transition: 'all 0.15s',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            })}
          >
            <Icon size={16} style={{ flexShrink: 0 }} />
            {!collapsed && label}
          </NavLink>
        ))}
      </nav>

      {/* Mode indicator */}
      {!collapsed && (
        <div style={{
          padding: '12px 16px',
          fontSize: 11,
          color: isPBI ? '#A19F9D' : '#475569',
          borderTop: isPBI ? '1px solid #E0DEDD' : '1px solid rgba(255,255,255,0.05)',
          whiteSpace: 'nowrap',
        }}>
          {isPBI && (
            <div style={{ marginBottom: 6 }}>
              <span style={{ color: '#F2B705', fontWeight: 900, fontSize: 14 }}>■</span>
              <span style={{ color: '#0065A3', fontWeight: 900, fontSize: 14 }}>■</span>
              <span style={{ color: '#605E5C', fontSize: 11, marginLeft: 4 }}>Power BI</span>
            </div>
          )}
          Viewing as: {isPBI ? 'Power BI Embedded' : 'Custom App'}
        </div>
      )}
    </aside>
  );
}
