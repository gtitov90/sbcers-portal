const colors = {
  Active: '#185FA5',
  Retired: '#6B7280',
  Deferred: '#92400E',
  Survivor: '#72243E',
};

export default function MemberAvatar({ name, status, size = 36 }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const bg = colors[status] || '#94A3B8';
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.35, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
      {initials}
    </div>
  );
}
