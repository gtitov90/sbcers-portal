import { useState } from 'react';
import { useMode } from '../context/ModeContext';
import { contributionAgencies, monthlyContribTrend } from '../data/sampleData';
import StatusBadge from '../components/StatusBadge';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Contributions() {
  const { mode } = useMode();
  const [expanded, setExpanded] = useState(null);
  const isPBI = mode === 'powerbi';

  const ContribTable = ({ onRowClick }) => (
    <table className="data-table">
      <thead>
        <tr>
          <th>Agency</th><th>Frequency</th><th>Last Submission</th>
          <th>Member Contributions</th><th>Employer Contributions</th><th>Total</th><th>Status</th>
        </tr>
      </thead>
      <tbody>
        {contributionAgencies.map((a, i) => (
          <>
            <tr key={i} style={{ cursor: onRowClick ? 'pointer' : 'default' }} onClick={() => onRowClick && onRowClick(i)}>
              <td style={{ fontWeight: 500, color: isPBI ? '#0065A3' : '#185FA5' }}>{a.agency}</td>
              <td>{a.frequency}</td>
              <td>{a.lastSubmission}</td>
              <td>${(a.memberContrib).toLocaleString()}</td>
              <td>${(a.employerContrib).toLocaleString()}</td>
              <td style={{ fontWeight: 600 }}>${(a.memberContrib + a.employerContrib).toLocaleString()}</td>
              <td><StatusBadge value={a.status} /></td>
            </tr>
            {expanded === i && onRowClick && (
              <tr key={`exp-${i}`}>
                <td colSpan={7} style={{ padding: 0 }}>
                  <div className="expand-panel">
                    <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Last 3 pay period submissions</div>
                    <table className="data-table">
                      <thead><tr><th>Period</th><th>Member</th><th>Employer</th><th>Status</th></tr></thead>
                      <tbody>
                        {a.detail.map((d, j) => (
                          <tr key={j}>
                            <td>{d.period}</td>
                            <td>${d.member.toLocaleString()}</td>
                            <td>${d.employer.toLocaleString()}</td>
                            <td><StatusBadge value={d.status} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            )}
          </>
        ))}
      </tbody>
    </table>
  );

  if (isPBI) {
    const chartData = contributionAgencies.map(a => ({
      agency: a.agency.split(' ').slice(0, 2).join(' '),
      Member: a.memberContrib,
      Employer: a.employerContrib,
    }));

    return (
      <div style={{ padding: 16 }}>
        <div className="kpi-row cols-4" style={{ marginBottom: 16 }}>
          {[
            { label: 'YTD Member Contributions', value: '$61.2M' },
            { label: 'YTD Employer Contributions', value: '$72.8M' },
            { label: 'YTD Total', value: '$134M' },
            { label: 'Participating Agencies', value: '12' },
          ].map(k => (
            <div key={k.label} className="kpi-card">
              <div className="kpi-label">{k.label}</div>
              <div className="kpi-value">{k.value}</div>
            </div>
          ))}
        </div>

        <div className="pbi-visual">
          <div className="pbi-visual-title">Contributions by agency</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <XAxis dataKey="agency" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Member" fill="#0065A3" radius={[2, 2, 0, 0]} />
              <Bar dataKey="Employer" fill="#ED7D31" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="pbi-visual">
          <div className="pbi-visual-title">Monthly trend — member vs employer</div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={monthlyContribTrend}>
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="member" stroke="#0065A3" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="employer" stroke="#ED7D31" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="pbi-visual">
          <div className="pbi-visual-title">Contributions by agency</div>
          <ContribTable />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 2px', color: '#0F172A' }}>Contributions</h1>
        <div style={{ fontSize: 13, color: '#64748B' }}>Year to date — April 2026.</div>
      </div>

      <div className="kpi-row cols-4" style={{ marginBottom: 20 }}>
        {[
          { label: 'YTD Member Contributions', value: '$61.2M' },
          { label: 'YTD Employer Contributions', value: '$72.8M' },
          { label: 'YTD Total', value: '$134M' },
          { label: 'Participating Agencies', value: '12' },
        ].map(k => (
          <div key={k.label} className="metric-card">
            <div style={{ fontSize: 11, color: '#64748B', marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#0F172A' }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="section-title" style={{ marginBottom: 8 }}>Monthly Trend — Member vs Employer</div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={monthlyContribTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="member" stroke="#185FA5" strokeWidth={2} dot={false} name="Member" />
            <Line type="monotone" dataKey="employer" stroke="#F59E0B" strokeWidth={2} dot={false} name="Employer" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <div style={{ fontSize: 12, color: '#64748B', marginBottom: 8 }}>Click a row to expand submission details</div>
        <ContribTable onRowClick={i => setExpanded(expanded === i ? null : i)} />
      </div>
    </div>
  );
}
