export default function StatusBadge({ value }) {
  const cls = {
    'Active': 'badge-active',
    'Retired': 'badge-retired',
    'Deferred': 'badge-deferred',
    'Survivor': 'badge-survivor',
    'Critical': 'badge-critical',
    'Warning': 'badge-warning',
    'Info': 'badge-info',
    'Paid': 'badge-paid',
    'Pending': 'badge-pending',
    'On Hold': 'badge-on-hold',
    'Current': 'badge-current',
    'Late': 'badge-late',
    'Open': 'badge-open',
    'In Review': 'badge-in-review',
    'Resolved': 'badge-resolved',
  }[value] || 'badge-info';
  return <span className={`badge ${cls}`}>{value}</span>;
}
