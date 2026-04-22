import { useState, useRef, useLayoutEffect, cloneElement } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { downloadIcon } from '@progress/kendo-svg-icons';
import { Button } from '@progress/kendo-react-buttons';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Grid, GridColumn, GridColumnMenuSort, GridColumnMenuFilter } from '@progress/kendo-react-grid';
import { orderBy, filterBy } from '@progress/kendo-data-query';
import { useMode } from '../context/ModeContext';
import { memberDetails, members, earningsCodeMap } from '../data/sampleData';
import StatusBadge from '../components/StatusBadge';
import MemberAvatar from '../components/MemberAvatar';

const TABS = ['Overview', 'Employment History', 'Earnings & Hours', 'Contributions', 'Pension Transactions', 'Health & Benefits'];
const RANGES = ['Last 12 months', 'Last 3 years', 'Full career'];

// Shared column menu (sort + filter) used by all Grids
const ColMenu = (props) => (
  <div>
    <GridColumnMenuSort {...props} />
    <GridColumnMenuFilter {...props} />
  </div>
);

// Earnings Grid — custom cells (tdProps must be spread so Kendo can apply column index attrs)
const CodeCell = ({ dataItem, tdProps }) => {
  const info = earningsCodeMap[dataItem.rawCode];
  return (
    <td {...tdProps}>
      {info?.legacy
        ? <span className="legacy-code" title={info.notes}>{dataItem.rawCode} ⚠</span>
        : <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{dataItem.rawCode}</span>}
    </td>
  );
};

const PayRateCell = ({ dataItem, tdProps }) => (
  <td {...tdProps} style={{ ...tdProps?.style, fontFamily: 'monospace', fontSize: 12 }}>
    {dataItem.payRate != null ? `$${dataItem.payRate.toFixed(2)}` : '—'}
  </td>
);

const EligServiceCell = ({ dataItem, tdProps }) => (
  <td {...tdProps} style={{ ...tdProps?.style, fontFamily: 'monospace', fontSize: 12 }}>
    {dataItem.eligService != null ? dataItem.eligService.toFixed(5) : '—'}
  </td>
);

const GrossCell = ({ dataItem, tdProps }) => (
  <td {...tdProps}>${dataItem.gross.toLocaleString()}</td>
);

const PensionableCell = ({ dataItem, tdProps }) => {
  const mismatch = dataItem.pensionableComp !== undefined && dataItem.pensionableComp !== dataItem.gross;
  return (
    <td {...tdProps}>
      {dataItem.pensionableComp != null ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontWeight: mismatch ? 600 : 400, color: mismatch ? '#A32D2D' : 'inherit' }}>
            ${dataItem.pensionableComp.toLocaleString()}
          </span>
          {mismatch && (
            <span title={`Gross $${dataItem.gross.toLocaleString()} — only $${dataItem.pensionableComp.toLocaleString()} is pensionable`}
              style={{ cursor: 'help', color: '#A32D2D', fontSize: 13 }}>⚠</span>
          )}
        </span>
      ) : '—'}
    </td>
  );
};

const earningsRowRender = (row, { dataItem }) => {
  const info = earningsCodeMap[dataItem.rawCode];
  const isLegacy = info?.legacy;
  const mismatch = dataItem.pensionableComp !== undefined && dataItem.pensionableComp !== dataItem.gross;
  const bg = isLegacy ? '#FFFBEB' : mismatch ? '#FFF1F0' : undefined;
  if (!bg) return row;
  return cloneElement(row, { style: { ...row.props.style, background: bg } });
};

function KV({ label, value }) {
  return (
    <div style={{ display: 'flex', gap: 8, padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
      <div style={{ width: 180, fontSize: 13, color: '#64748B', flexShrink: 0 }}>{label}</div>
      <div style={{ fontSize: 13, color: '#0F172A', fontWeight: 500 }}>{value}</div>
    </div>
  );
}

function EarningsTab({ displayEarnings, earningsRange, setEarningsRange, earningsSort, setEarningsSort, earningsFilter, setEarningsFilter }) {
  const containerRef = useRef(null);
  const toolbarRef   = useRef(null);
  const [gridHeight, setGridHeight] = useState(400);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const toolbar   = toolbarRef.current;
    if (!container || !toolbar) return;

    const measure = () => {
      const available = container.getBoundingClientRect().height;
      const used      = toolbar.getBoundingClientRect().height;
      setGridHeight(Math.max(available - used, 100));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  const processedData = orderBy(
    earningsFilter ? filterBy(displayEarnings, earningsFilter) : displayEarnings,
    earningsSort
  );

  return (
    <div ref={containerRef} style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <div ref={toolbarRef} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexShrink: 0 }}>
        <div className="section-title">Earnings & Hours</div>
        <DropDownList data={RANGES} value={earningsRange} onChange={e => setEarningsRange(e.value)} style={{ width: 180 }} />
      </div>
      <Grid
        data={processedData}
        style={{ height: gridHeight }}
        rowRender={earningsRowRender}
        resizable
        sortable
        sort={earningsSort}
        onSortChange={e => setEarningsSort(e.sort)}
        filterable={false}
        filter={earningsFilter}
        onFilterChange={e => setEarningsFilter(e.filter)}
      >
        <GridColumn field="period"          title="Pay Period"                  columnMenu={ColMenu} />
        <GridColumn field="rawCode"         title="Code"         width={65}  columnMenu={ColMenu} cells={{ data: CodeCell }} />
        <GridColumn field="payType"         title="Pay Type"                    columnMenu={ColMenu} />
        <GridColumn field="payRate"         title="Rate"         width={85}  columnMenu={ColMenu} cells={{ data: PayRateCell }} />
        <GridColumn field="hours"           title="Hrs"          width={60}  columnMenu={ColMenu} />
        <GridColumn field="leaveHours"      title="Leave Hrs"    width={78}  columnMenu={ColMenu} />
        <GridColumn field="eligService"     title="Elig. Svc"    width={90}  columnMenu={ColMenu} cells={{ data: EligServiceCell }} />
        <GridColumn field="gross"           title="Gross"        width={90}  columnMenu={ColMenu} cells={{ data: GrossCell }} />
        <GridColumn field="pensionableComp" title="Pensionable"              columnMenu={ColMenu} cells={{ data: PensionableCell }} />
      </Grid>
    </div>
  );
}

// ── Employment History Grid ──────────────────────────────────────────────────
const EmpStatusCell = ({ dataItem, tdProps }) => (
  <td {...tdProps}><StatusBadge value={dataItem.status} /></td>
);

function EmploymentTab({ data }) {
  const containerRef = useRef(null);
  const [gridHeight, setGridHeight] = useState(400);
  const [sort, setSort] = useState([]);
  const [filter, setFilter] = useState(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const measure = () => setGridHeight(Math.max(container.getBoundingClientRect().height, 100));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  const processed = orderBy(filter ? filterBy(data, filter) : data, sort);

  return (
    <div ref={containerRef} style={{ flex: 1, minHeight: 0 }}>
      <Grid
        data={processed}
        style={{ height: gridHeight }}
        resizable
        sortable
        sort={sort}
        onSortChange={e => setSort(e.sort)}
        filter={filter}
        onFilterChange={e => setFilter(e.filter)}
      >
        <GridColumn field="employer"   title="Employer"    columnMenu={ColMenu} />
        <GridColumn field="title"      title="Job Title"   columnMenu={ColMenu} />
        <GridColumn field="department" title="Department"  columnMenu={ColMenu} />
        <GridColumn field="start"      title="Start Date"  width={110} columnMenu={ColMenu} />
        <GridColumn field="end"        title="End Date"    width={110} columnMenu={ColMenu} />
        <GridColumn field="status"     title="Status"      width={100} columnMenu={ColMenu} cells={{ data: EmpStatusCell }} />
      </Grid>
    </div>
  );
}

// ── Contributions Grid ───────────────────────────────────────────────────────
const ContribRateCell    = ({ dataItem, tdProps }) => <td {...tdProps} style={{ ...tdProps?.style, fontFamily: 'monospace', fontSize: 12 }}>{dataItem.rate}</td>;
const ContribMemberCell  = ({ dataItem, tdProps }) => <td {...tdProps}>${dataItem.memberContrib?.toLocaleString() ?? '—'}</td>;
const ContribEmployerCell= ({ dataItem, tdProps }) => <td {...tdProps}>${dataItem.employerPickUp?.toLocaleString() ?? '—'}</td>;
const ContribOwedCell    = ({ dataItem, tdProps }) => (
  <td {...tdProps} style={{ ...tdProps?.style, color: dataItem.amtOwed > 0 ? '#A32D2D' : '#64748B', fontWeight: dataItem.amtOwed > 0 ? 600 : 400 }}>
    {dataItem.amtOwed > 0 ? `$${dataItem.amtOwed.toLocaleString()}` : '—'}
  </td>
);
const ContribColaRateCell  = ({ dataItem, tdProps }) => <td {...tdProps} style={{ ...tdProps?.style, fontFamily: 'monospace', fontSize: 12 }}>{dataItem.colaRate}</td>;
const ContribColaContribCell = ({ dataItem, tdProps }) => <td {...tdProps}>${dataItem.colaContrib?.toLocaleString() ?? '—'}</td>;
const ContribInterestCell  = ({ dataItem, tdProps }) => (
  <td {...tdProps} style={{ ...tdProps?.style, color: dataItem.interest > 0 ? '#A32D2D' : '#64748B' }}>
    {dataItem.interest > 0 ? `$${dataItem.interest.toFixed(2)}` : '—'}
  </td>
);

const contribRowRender = (row, { dataItem }) => {
  if (!dataItem.amtOwed || dataItem.amtOwed <= 0) return row;
  return cloneElement(row, { style: { ...row.props.style, background: '#FFFBEB' } });
};

function ContributionsTab({ data }) {
  const containerRef = useRef(null);
  const [gridHeight, setGridHeight] = useState(400);
  const [sort, setSort] = useState([]);
  const [filter, setFilter] = useState(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const measure = () => setGridHeight(Math.max(container.getBoundingClientRect().height, 100));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  const processed = orderBy(filter ? filterBy(data, filter) : data, sort);

  return (
    <div ref={containerRef} style={{ flex: 1, minHeight: 0 }}>
      <Grid
        data={processed}
        style={{ height: gridHeight }}
        rowRender={contribRowRender}
        resizable
        sortable
        sort={sort}
        onSortChange={e => setSort(e.sort)}
        filter={filter}
        onFilterChange={e => setFilter(e.filter)}
      >
        <GridColumn field="period"        title="Pay Period"       columnMenu={ColMenu} />
        <GridColumn field="rate"          title="Rate"     width={75}  columnMenu={ColMenu} cells={{ data: ContribRateCell }} />
        <GridColumn field="memberContrib" title="Member"   width={100} columnMenu={ColMenu} cells={{ data: ContribMemberCell }} />
        <GridColumn field="employerPickUp"title="Employer" width={100} columnMenu={ColMenu} cells={{ data: ContribEmployerCell }} />
        <GridColumn field="amtOwed"       title="Amt Owed" width={95}  columnMenu={ColMenu} cells={{ data: ContribOwedCell }} />
        <GridColumn field="colaRate"      title="COLA Rate"width={90}  columnMenu={ColMenu} cells={{ data: ContribColaRateCell }} />
        <GridColumn field="colaContrib"   title="COLA"     width={85}  columnMenu={ColMenu} cells={{ data: ContribColaContribCell }} />
        <GridColumn field="interest"      title="Interest" width={90}  columnMenu={ColMenu} cells={{ data: ContribInterestCell }} />
      </Grid>
    </div>
  );
}

// ── Pension Transactions Grid ────────────────────────────────────────────────
const TxAmountCell  = ({ dataItem, tdProps }) => <td {...tdProps} style={{ ...tdProps?.style, fontFamily: 'monospace', fontWeight: 500 }}>{dataItem.amount}</td>;
const TxBalanceCell = ({ dataItem, tdProps }) => <td {...tdProps} style={{ ...tdProps?.style, fontFamily: 'monospace' }}>{dataItem.balance}</td>;
const TxNotesCell   = ({ dataItem, tdProps }) => <td {...tdProps} style={{ ...tdProps?.style, fontSize: 12, color: '#64748B' }}>{dataItem.notes}</td>;

function PensionTransactionsTab({ data, txFilter, setTxFilter }) {
  const containerRef = useRef(null);
  const toolbarRef   = useRef(null);
  const [gridHeight, setGridHeight] = useState(400);
  const [sort, setSort] = useState([]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const toolbar   = toolbarRef.current;
    if (!container || !toolbar) return;
    const measure = () => {
      const available = container.getBoundingClientRect().height;
      const used      = toolbar.getBoundingClientRect().height;
      setGridHeight(Math.max(available - used, 100));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  const filtered  = data.filter(t => !txFilter || t.type === txFilter);
  const processed = orderBy(filtered, sort);

  return (
    <div ref={containerRef} style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <div ref={toolbarRef} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexShrink: 0 }}>
        <div className="section-title">Pension Transactions</div>
        <DropDownList
          data={['All types', 'Interest Posting', 'COLA Adjustment', 'Service Purchase', 'Benefit Payment', 'Refund']}
          value={txFilter || 'All types'}
          onChange={e => setTxFilter(e.value === 'All types' ? '' : e.value)}
          style={{ width: 200 }}
        />
      </div>
      <Grid
        data={processed}
        style={{ height: gridHeight }}
        resizable
        sortable
        sort={sort}
        onSortChange={e => setSort(e.sort)}
      >
        <GridColumn field="date"    title="Date"              width={105} columnMenu={ColMenu} />
        <GridColumn field="type"    title="Transaction Type"              columnMenu={ColMenu} />
        <GridColumn field="amount"  title="Amount"            width={105} columnMenu={ColMenu} cells={{ data: TxAmountCell }} />
        <GridColumn field="balance" title="Balance After"     width={115} columnMenu={ColMenu} cells={{ data: TxBalanceCell }} />
        <GridColumn field="notes"   title="Notes"                         columnMenu={ColMenu} cells={{ data: TxNotesCell }} />
      </Grid>
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
  const [earningsSort, setEarningsSort] = useState([]);
  const [earningsFilter, setEarningsFilter] = useState(null);

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
            <thead>
              <tr>
                <th>Pay Period</th><th>Code</th><th>Pay Type</th><th>Pay Rate</th>
                <th>Hours</th><th>Elig. Service</th><th>Gross</th><th>Pensionable Comp</th>
              </tr>
            </thead>
            <tbody>
              {displayEarnings.map((e, i) => {
                const info = earningsCodeMap[e.rawCode];
                const isLegacy = info?.legacy;
                const pensionMismatch = e.pensionableComp !== undefined && e.pensionableComp !== e.gross;
                return (
                  <tr key={i} style={{ background: isLegacy ? '#FFFBEB' : pensionMismatch ? '#FFF1F0' : undefined }}>
                    <td>{e.period}</td>
                    <td>
                      {isLegacy
                        ? <span className="legacy-code" title={info?.notes}>{e.rawCode} ⚠</span>
                        : <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{e.rawCode}</span>}
                    </td>
                    <td style={{ fontSize: 12, color: '#605E5C' }}>{e.payType || '—'}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{e.payRate != null ? `$${e.payRate.toFixed(2)}` : '—'}</td>
                    <td>{e.hours}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{e.eligService != null ? e.eligService.toFixed(5) : '—'}</td>
                    <td>${e.gross.toLocaleString()}</td>
                    <td>
                      <span style={{ color: pensionMismatch ? '#A32D2D' : 'inherit', fontWeight: pensionMismatch ? 600 : 400 }}>
                        ${(e.pensionableComp ?? e.gross).toLocaleString()}
                        {pensionMismatch && <span title={`Only $${e.pensionableComp.toLocaleString()} of $${e.gross.toLocaleString()} gross is pensionable`} style={{ marginLeft: 4, cursor: 'help' }}>⚠</span>}
                      </span>
                    </td>
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

  // Custom App mode — full-height flex column so only the table scrolls, not the page
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>

      {/* Header — static at top of flex column, no sticky needed */}
      <div style={{ flexShrink: 0, background: 'var(--content-bg, #F1F5F9)', padding: '20px 0 0', borderBottom: '1px solid #E2E8F0', boxShadow: '0 2px 6px rgba(0,0,0,0.06)', marginBottom: 0 }}>
        <Button fillMode="flat" onClick={() => navigate('/search')}
          style={{ color: '#185FA5', fontSize: 13, marginBottom: 12, padding: 0 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <ArrowLeft size={14} /> Back
          </span>
        </Button>

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
          <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {[
              ['PEPRA Earnings Export', 'pepra_earnings_export.xlsx', 'Pay period detail with pensionable comp, pay type, eligibility service — feeds PEPRA Review worksheet'],
              ['Contribution Detail', 'contribution_detail.xlsx', 'Member contributions with rate, employer pick-up, amounts owed, COLA, and interest — feeds service purchase & LOA worksheets'],
              ['Service Credit Summary', 'service_credit_summary.xlsx', 'Cumulative eligibility service credit by year with FTE / leave breakdown'],
              ['FAS Worksheet', 'fas_worksheet.xlsx', 'Final Average Salary calculation window — 12 or 36 highest-earning months, pensionable comp only'],
            ].map(([label, file, tip]) => (
              <Button key={file} themeColor="primary" fillMode="solid" size="small"
                svgIcon={downloadIcon}
                onClick={() => alert(`Downloading ${file}\n\n${tip}\n\nAudit log entry created.`)}
                title={tip}
                style={{ whiteSpace: 'nowrap' }}>
                {label}
              </Button>
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

      {/* Tab content — fills remaining height, overflow hidden so page never scrolls */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', padding: '20px 0 20px', display: 'flex', flexDirection: 'column' }}>

        {activeTab === 'Overview' && (
          <div style={{ flex: 1, overflowY: 'auto', maxWidth: 960 }}>
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
          <EmploymentTab data={member.employment || []} />
        )}

        {activeTab === 'Earnings & Hours' && (
          <EarningsTab
            displayEarnings={displayEarnings}
            earningsRange={earningsRange}
            setEarningsRange={setEarningsRange}
            earningsSort={earningsSort}
            setEarningsSort={setEarningsSort}
            earningsFilter={earningsFilter}
            setEarningsFilter={setEarningsFilter}
          />
        )}

        {activeTab === 'Contributions' && (
          <ContributionsTab data={member.contributions || []} />
        )}

        {activeTab === 'Pension Transactions' && (
          <PensionTransactionsTab
            data={member.transactions || []}
            txFilter={txFilter}
            setTxFilter={setTxFilter}
          />
        )}

        {activeTab === 'Health & Benefits' && (
          <div style={{ flex: 1, overflowY: 'auto', maxWidth: 960 }}>
            <div className="card">
              <div className="section-title" style={{ marginBottom: 8 }}>Health & Benefits</div>
              <KV label="Health Plan" value={member.health?.plan || '—'} />
              <KV label="Enrollment Date" value={member.health?.coverageStart || '—'} />
              <KV label="Premium Deduction" value={member.health?.premiumDeduction || '—'} />
              <KV label="Open Enrollment" value={member.health?.openEnrollment || '—'} />
              <KV label="Beneficiary" value={member.beneficiary || '—'} />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
