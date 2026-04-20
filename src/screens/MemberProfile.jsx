import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useMode } from '../context/ModeContext';
import { memberDetails, members, earningsCodeMap } from '../data/sampleData';
import StatusBadge from '../components/StatusBadge';
import MemberAvatar from '../components/MemberAvatar';

const TABS = ['Overview', 'Employment History', 'Earnings & Hours', 'Contributions', 'Pension Transactions', 'Health & Benefits'];
const RANGES = ['Last 12 months', 'Last 3 years', 'Full career'];

function KV({ label, value }) {
  return (
    <div style={{ display: 'flex', gap: 8, padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
      <div style={{ width: 180, fontSize: 13, color: '#64748B', flexShrink: 0 }}>{label}</div>
      <div style={{ fontSize: 13, color: '#0F172A', fontWeight: 500 }}>{value}</div>
    </div>
  );
}

export default function MemberProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { mode } = useMode();
  const [activeTab, setActiveTab] = useState('Overview');
  const [earningsRange, setEarningsRange] = useState('Last 12 months');
  const [txFilter, setTxFilter] = useState('');

  const member = memberDetails[id] || memberDetails['M-00847'];
  const isPBI = mode === 'powerbi';

  // Filter earnings by range
  const allEarnings = member.earnings || [];
  const recentEarnings = allEarnings.filter(e => !e.period.includes('200'));
  const displayEarnings = earningsRange === 'Full career' ? allEarnings : recentEarnings;

  // Chart data
  const earningsChartData = recentEarnings.slice(0, 12).map(e => ({
    period: e.period.split(',')[0].replace(/\d{4}/, '').trim().slice(0, 8),
    Gross: e.gross,
  })).reverse();

  const contribChartData = (member.contributions || []).slice(0, 12).map(c => ({
    period: c.period,
    Member: c.member,
    Employer: c.employer,
  })).reverse();

  const txFiltered = (member.transactions || []).filter(t => !txFilter || t.type === txFilter);

  if (isPBI) {
    return (
      <div style={{ maxWidth: 1000, paddingTop: 20 }}>
        <div className="drillthrough-bar">
          <Link to="/search">Member Search</Link> &gt; Member Profile: {member.name} ({member.id})
        </div>

        {/* Member details table */}
        <div className="pbi-visual">
          <div className="pbi-visual-title">Member details</div>
          <table className="data-table">
            <tbody>
              {[
                ['Name', member.name], ['ID', member.id], ['Status', member.status],
                ['Agency', member.agency], ['Plan Tier', member.tier], ['DOB', member.dob],
                ['Address', member.address], ['Beneficiary', member.beneficiary],
              ].map(([k, v]) => (
                <tr key={k}><td style={{ color: '#605E5C', width: 160 }}>{k}</td><td style={{ fontWeight: 500 }}>{v}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Earnings code table */}
        <div className="pbi-visual">
          <div className="pbi-visual-title">Earnings by pay code</div>
          <table className="data-table">
            <thead><tr><th>Pay Period</th><th>Code</th><th>Normalized Category</th><th>Gross Earnings</th><th>Hours</th></tr></thead>
            <tbody>
              {displayEarnings.map((e, i) => {
                const info = earningsCodeMap[e.rawCode];
                const isLegacy = info?.legacy;
                return (
                  <tr key={i} className={isLegacy ? 'amber-row' : ''}>
                    <td>{e.period}</td>
                    <td>
                      {isLegacy
                        ? <span className="legacy-code" title={info?.notes}>{e.rawCode} ⚠</span>
                        : <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{e.rawCode}</span>}
                    </td>
                    <td>
                      {isLegacy
                        ? <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            {info?.normalized}
                            <span style={{ color: '#D97706', fontSize: 14 }}>⚠</span>
                          </span>
                        : info?.normalized}
                    </td>
                    <td>${e.gross.toLocaleString()}</td>
                    <td>{e.hours}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Transactions table */}
        <div className="pbi-visual">
          <div className="pbi-visual-title">Pension transactions</div>
          <table className="data-table">
            <thead><tr><th>Date</th><th>Type</th><th>Amount</th><th>Balance After</th><th>Notes</th></tr></thead>
            <tbody>
              {(member.transactions || []).map((t, i) => (
                <tr key={i}>
                  <td>{t.date}</td><td>{t.type}</td><td style={{ fontFamily: 'monospace' }}>{t.amount}</td>
                  <td style={{ fontFamily: 'monospace' }}>{t.balance}</td><td style={{ color: '#64748B', fontSize: 12 }}>{t.notes}</td>
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
    <div style={{ maxWidth: 960 }}>
      {/* Sticky header: back button + member card + tabs */}
      <div className="page-header" style={{ paddingBottom: 0 }}>
        <button onClick={() => navigate('/search')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#185FA5', cursor: 'pointer', fontSize: 13, marginBottom: 12, padding: 0 }}>
          <ArrowLeft size={14} /> Back to search results
        </button>

        {/* Member header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
          <MemberAvatar name={member.name} status={member.status} size={48} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#0F172A' }}>{member.name}</h1>
              <StatusBadge value={member.status} />
            </div>
            <div style={{ fontSize: 12, color: '#64748B', marginTop: 3 }}>
              {member.id} · {member.tier} · {member.agency} · {member.yearsService ? `${member.yearsService} yrs service` : 'Survivor'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            {[
              ['Member Summary', 'member_summary.xlsx'],
              ['Earnings History', 'earnings_history.xlsx'],
              ['Contribution History', 'contribution_history.xlsx'],
            ].map(([label, file]) => (
              <button key={file} onClick={() => alert(`Downloading ${file} — audit log entry created.`)}
                style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', border: '1px solid #E2E8F0', borderRadius: 6, background: '#fff', cursor: 'pointer', fontSize: 12, color: '#185FA5', whiteSpace: 'nowrap' }}>
                <Download size={13} /> {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', overflowX: 'auto', marginBottom: -1 }}>
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: '8px 14px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, fontWeight: activeTab === tab ? 600 : 400, color: activeTab === tab ? '#185FA5' : '#64748B', borderBottom: activeTab === tab ? '2px solid #185FA5' : '2px solid transparent', whiteSpace: 'nowrap', transition: 'all 0.15s' }}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === 'Overview' && (
        <div>
          {/* Demographics */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <div className="card">
              <div className="section-title" style={{ marginBottom: 8 }}>Demographics</div>
              <KV label="Date of Birth" value={member.dob} />
              <KV label="Gender" value={member.gender} />
              <KV label="Marital Status" value={member.maritalStatus} />
              <KV label="Address" value={member.address} />
              <KV label="Phone" value={member.phone} />
              <KV label="Email" value={member.email} />
              <KV label="Entity ID" value={member.entityId} />
            </div>

            {/* Recent activity */}
            <div className="card">
              <div className="section-title" style={{ marginBottom: 8 }}>Recent Activity</div>
              {(member.transactions || []).slice(0, 5).map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: t.type === 'Interest Posting' ? '#3B82F6' : t.type === 'Service Purchase' ? '#10B981' : '#F59E0B', marginTop: 4, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: '#0F172A' }}>{t.type}</div>
                    <div style={{ fontSize: 11, color: '#64748B' }}>{t.date} · {t.amount}</div>
                  </div>
                </div>
              ))}
              {(member.transactions || []).length === 0 && <div style={{ color: '#94A3B8', fontSize: 13 }}>No recent activity.</div>}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Employment History' && (
        <div className="card">
          <table className="data-table">
            <thead><tr><th>Employer</th><th>Job Title</th><th>Department</th><th>Start Date</th><th>End Date</th><th>Status</th></tr></thead>
            <tbody>
              {(member.employment || []).map((e, i) => (
                <tr key={i}>
                  <td>{e.employer}</td><td>{e.title}</td><td>{e.department}</td>
                  <td>{e.start}</td><td>{e.end}</td><td><StatusBadge value={e.status} /></td>
                </tr>
              ))}
              {(member.employment || []).length === 0 && <tr><td colSpan={6} style={{ color: '#94A3B8', textAlign: 'center', padding: 24 }}>No employment records.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'Earnings & Hours' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div className="section-title">Monthly Gross Earnings</div>
            <select value={earningsRange} onChange={e => setEarningsRange(e.target.value)}
              style={{ padding: '6px 10px', border: '1px solid #E2E8F0', borderRadius: 6, fontSize: 13 }}>
              {RANGES.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div className="card">
            <table className="data-table">
              <thead><tr><th>Pay Period</th><th>Code</th><th>Normalized Category</th><th>Gross Earnings</th><th>Hours</th><th>Leave Hours</th></tr></thead>
              <tbody>
                {displayEarnings.map((e, i) => {
                  const info = earningsCodeMap[e.rawCode];
                  const isLegacy = info?.legacy;
                  return (
                    <tr key={i} className={isLegacy ? 'amber-row' : ''}>
                      <td>{e.period}</td>
                      <td>
                        {isLegacy
                          ? <span className="legacy-code" title={info?.notes}>{e.rawCode} ⚠</span>
                          : <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{e.rawCode}</span>}
                      </td>
                      <td>{info?.normalized || '—'}</td>
                      <td>${e.gross.toLocaleString()}</td>
                      <td>{e.hours}</td>
                      <td>{e.leaveHours || '—'}</td>
                    </tr>
                  );
                })}
                {displayEarnings.length === 0 && <tr><td colSpan={6} style={{ color: '#94A3B8', textAlign: 'center', padding: 24 }}>No earnings data.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'Contributions' && (
        <div>
          <div className="card">
            <table className="data-table">
              <thead><tr><th>Pay Period</th><th>Member Contribution</th><th>Employer Contribution</th><th>Total</th></tr></thead>
              <tbody>
                {(member.contributions || []).map((c, i) => (
                  <tr key={i}>
                    <td>{c.period}</td>
                    <td>${c.member.toLocaleString()}</td>
                    <td>${c.employer.toLocaleString()}</td>
                    <td style={{ fontWeight: 600 }}>${c.total.toLocaleString()}</td>
                  </tr>
                ))}
                {(member.contributions || []).length === 0 && <tr><td colSpan={5} style={{ color: '#94A3B8', textAlign: 'center', padding: 24 }}>No contribution data.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'Pension Transactions' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div className="section-title">Pension Transactions</div>
            <select value={txFilter} onChange={e => setTxFilter(e.target.value)}
              style={{ padding: '6px 10px', border: '1px solid #E2E8F0', borderRadius: 6, fontSize: 13 }}>
              <option value="">All types</option>
              {['Interest Posting', 'COLA Adjustment', 'Service Purchase', 'Benefit Payment', 'Refund'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <table className="data-table">
            <thead><tr><th>Date</th><th>Transaction Type</th><th>Amount</th><th>Balance After</th><th>Notes</th></tr></thead>
            <tbody>
              {txFiltered.map((t, i) => (
                <tr key={i}>
                  <td>{t.date}</td><td>{t.type}</td>
                  <td style={{ fontFamily: 'monospace', fontWeight: 500 }}>{t.amount}</td>
                  <td style={{ fontFamily: 'monospace' }}>{t.balance}</td>
                  <td style={{ fontSize: 12, color: '#64748B' }}>{t.notes}</td>
                </tr>
              ))}
              {txFiltered.length === 0 && <tr><td colSpan={5} style={{ color: '#94A3B8', textAlign: 'center', padding: 24 }}>No transactions.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'Health & Benefits' && (
        <div className="card">
          <div className="section-title" style={{ marginBottom: 8 }}>Health & Benefits</div>
          <KV label="Health Plan" value={member.health?.plan || '—'} />
          <KV label="Enrollment Date" value={member.health?.coverageStart || '—'} />
          <KV label="Premium Deduction" value={member.health?.premiumDeduction || '—'} />
          <KV label="Open Enrollment" value={member.health?.openEnrollment || '—'} />
          <KV label="Beneficiary" value={member.beneficiary || '—'} />
        </div>
      )}

    </div>
  );
}
