import { useMode } from '../context/ModeContext';

export default function TopNav() {
  const { mode, setMode } = useMode();
  const isPBI = mode === 'powerbi';

  return (
    <nav style={{
      background: isPBI ? '#FFFFFF' : '#0C447C',
      borderBottom: isPBI ? '1px solid #E0DEDD' : 'none',
      color: isPBI ? '#252423' : '#FFFFFF',
      display: 'flex', alignItems: 'center', padding: '0 20px',
      height: 52, flexShrink: 0, gap: 16, zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em', flexShrink: 0 }}>
        {isPBI ? (
          <span>
            <span style={{ color: '#F2B705', fontWeight: 900 }}>■</span>
            <span style={{ color: '#0065A3', fontWeight: 900 }}>■</span>
            {' '}SBCERS
          </span>
        ) : 'SBCERS'}
      </div>

      {/* App title */}
      <div style={{ fontSize: 14, opacity: 0.85, flexShrink: 0 }}>
        {isPBI ? 'Member Portal — Power BI' : 'Member Portal'}
      </div>

      <div style={{ flex: 1 }} />

      {/* Mode toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: isPBI ? '#F3F2F1' : 'rgba(255,255,255,0.15)', borderRadius: 20, padding: '4px 6px' }}>
        <button
          onClick={() => setMode('custom')}
          style={{
            padding: '3px 12px', borderRadius: 14, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500,
            background: mode === 'custom' ? '#185FA5' : 'transparent',
            color: mode === 'custom' ? '#fff' : (isPBI ? '#605E5C' : 'rgba(255,255,255,0.7)'),
            transition: 'all 0.15s',
          }}
        >Custom App</button>
        <button
          onClick={() => setMode('powerbi')}
          style={{
            padding: '3px 12px', borderRadius: 14, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500,
            background: mode === 'powerbi' ? '#0065A3' : 'transparent',
            color: mode === 'powerbi' ? '#fff' : (isPBI ? '#605E5C' : 'rgba(255,255,255,0.7)'),
            transition: 'all 0.15s',
          }}
        >Power BI Embedded</button>
      </div>

      {/* User */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <div style={{ width: 30, height: 30, borderRadius: '50%', background: isPBI ? '#0065A3' : '#378ADD', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff' }}>SR</div>
        <div style={{ fontSize: 13 }}>
          <div style={{ fontWeight: 500 }}>Sandra R.</div>
          <div style={{ fontSize: 11, opacity: 0.7 }}>
            <span style={{ background: isPBI ? '#E6F1FB' : 'rgba(255,255,255,0.2)', padding: '1px 6px', borderRadius: 8, color: isPBI ? '#0065A3' : '#fff' }}>Member Services</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
