import { useState } from 'react';
import { useMode } from '../context/ModeContext';
import { exceptions } from '../data/sampleData';
import StatusBadge from '../components/StatusBadge';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ExceptionReports() {
  const { mode } = useMode();
  const [expandedId, setExpandedId] = useState(null);
  const isPBI = mode === 'powerbi';

  const open = exceptions.filter(e => e.status !== 'Resolved').length;
  const resolved = exceptions.filter(e => e.status === 'Resolved').length;
  const critical = exceptions.filter(e => e.severity === 'Critical').length;

  const byType = Object.entries(
    exceptions.reduce((acc, e) => { acc[e.type] = (acc[e.type] || 0) + 1; return acc; }, {})
  ).map(([type, count]) => ({ type: type.split(' ').slice(0,2).join(' '), count }));

  const bySource = [
    { name: 'PayPlus', value: exceptions.filter(e => e.source === 'PayPlus').length },
    { name: 'Pension Gold', value: exceptions.filter(e => e.source === 'Pension Gold').length },
  ];

  const COLORS = ['#0065A3', '#ED7D31'];

  const ExceptionTable = ({ onRowClick }) => (
    <>
      <table className="data-table">
        <thead>
          <tr>
            <th>Exception ID</th><th>Member</th><th>Source</th><th>Type</th>
            <th>Severity</th><th>Date Flagged</th><th>Status</th><th>Assigned To</th>
          </tr>
        </thead>
        <tbody>
          {exceptions.map(e => (
            <>
              <tr key={e.id} style={{ cursor: onRowClick ? 'pointer' : 'default' }} onClick={() => onRowClick && onRowClick(e.id)}>
                <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{e.id}</td>
                <td style={{ fontWeight: 500 }}>{e.memberName}</td>
                <td>{e.source}</td>
                <td>{e.type}</td>
                <td><StatusBadge value={e.severity} /></td>
                <td>{e.dateFlagged}</td>
                <td><StatusBadge value={e.status} /></td>
                <td>{e.assignedTo}</td>
              </tr>
              {onRowClick && expandedId === e.id && (
                <tr key={`exp-${e.id}`}>
                  <td colSpan={8} style={{ padding: 0 }}>
                    <div className="expand-panel">
                      {e.detail.payPlusValue && (
                        <>
                          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 10, color: '#0F172A' }}>Field comparison</div>
                          <table className="data-table" style={{ marginBottom: 12 }}>
                            <thead>
                              <tr>
                                <th>PayPlus Raw Value</th>
                                <th>Pension Gold Expected</th>
                                {e.detail.normalized && <th>Normalized Category</th>}
                                {e.detail.era && <th>Era</th>}
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td style={{ fontFamily: 'monospace', background: '#FCEBEB', color: '#A32D2D', fontWeight: 600 }}>{e.detail.payPlusValue}</td>
                                <td style={{ fontFamily: 'monospace', background: '#EAF3DE', color: '#3B6D11', fontWeight: 600 }}>{e.detail.pgExpected}</td>
                                {e.detail.normalized && <td style={{ fontFamily: 'monospace' }}>{e.detail.normalized}</td>}
                                {e.detail.era && <td style={{ fontSize: 12, color: '#64748B' }}>{e.detail.era}</td>}
                              </tr>
                            </tbody>
                          </table>
                        </>
                      )}
                      <div style={{ fontSize: 13, color: '#334155', lineHeight: 1.6, marginBottom: 12, background: '#fff', padding: '10px 12px', borderRadius: 6, border: '1px solid #E2E8F0' }}>
                        {e.detail.explanation}
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => alert(`Exception ${e.id} marked as resolved — audit log entry created.`)}
                          style={{ padding: '6px 14px', background: '#185FA5', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>
                          Resolve
                        </button>
                        <button onClick={() => alert(`Exception ${e.id} assigned — audit log entry created.`)}
                          style={{ padding: '6px 14px', border: '1px solid #E2E8F0', background: '#fff', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>
                          Assign
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </>
  );

  if (isPBI) {
    return (
      <div style={{ padding: 16 }}>
        <div className="kpi-row cols-3" style={{ marginBottom: 16 }}>
          {[
            { label: 'Open Exceptions', value: open },
            { label: 'Resolved This Week', value: resolved },
            { label: 'Critical', value: critical },
          ].map(k => (
            <div key={k.label} className="kpi-card">
              <div className="kpi-label">{k.label}</div>
              <div className="kpi-value" style={k.label === 'Critical' ? { color: '#A32D2D' } : {}}>{k.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div className="pbi-visual">
            <div className="pbi-visual-title">Exceptions by type</div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={byType} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="type" type="category" tick={{ fontSize: 10 }} width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#0065A3" radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="pbi-visual">
            <div className="pbi-visual-title">Exceptions by source system</div>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={bySource} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={55} label={({ name }) => name}>
                  {bySource.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="pbi-visual">
          <div className="pbi-visual-title">Exception records</div>
          <ExceptionTable />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: '#0F172A' }}>Exception Reports</h1>
      </div>

      <div className="kpi-row cols-3" style={{ marginBottom: 20 }}>
        {[
          { label: 'Open Exceptions', value: open },
          { label: 'Resolved This Week', value: resolved },
          { label: 'Critical', value: critical },
        ].map(k => (
          <div key={k.label} className="metric-card">
            <div style={{ fontSize: 11, color: '#64748B', marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: k.label === 'Critical' ? '#A32D2D' : '#0F172A' }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div style={{ fontSize: 12, color: '#64748B', marginBottom: 8 }}>Click a row to expand exception details</div>
        <ExceptionTable onRowClick={id => setExpandedId(expandedId === id ? null : id)} />
      </div>
    </div>
  );
}
