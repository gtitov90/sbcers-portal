export const earningsCodeMap = {
  REG:      { normalized: 'Regular Pay',           legacy: false, notes: 'Consistent across all PayPlus versions' },
  OT:       { normalized: 'Overtime',               legacy: false, notes: 'Consistent across all PayPlus versions' },
  VACATION: { normalized: 'Vacation',               legacy: false, notes: 'Current code — replaced PTO20 and VAC in 2005' },
  SICK:     { normalized: 'Sick Leave',             legacy: false, notes: 'Current code' },
  'MED-LV': { normalized: 'Medical Leave',          legacy: false, notes: 'Current code — used for FMLA, SDI, disability leave' },
  PTO20:    { normalized: 'Vacation',               legacy: true,  notes: 'Legacy — retired 2005. Mapped to Vacation.' },
  'VAC-O':  { normalized: 'Vacation Payout',        legacy: true,  notes: 'Legacy — vacation payout at separation or year-end.' },
  VAC:      { normalized: 'Vacation',               legacy: true,  notes: 'Legacy — predecessor to VACATION code.' },
  MED:      { normalized: 'Medical Leave',          legacy: true,  notes: 'Legacy — predecessor to MED-LV.' },
  COMP:     { normalized: 'Compensatory Time',      legacy: false, notes: 'Comp time in lieu of overtime pay' },
  'SDI-PT': { normalized: 'State Disability (Partial)', legacy: false, notes: 'Partial SDI — member receiving partial state disability benefit' },
  HOL:      { normalized: 'Holiday Pay',            legacy: false, notes: 'Consistent across all versions' },
};

export const members = [
  { id: 'M-00847', name: 'Bush Odonaldi',    status: 'Active',   agency: 'County of Santa Barbara',         tier: 'Tier 1', yearsService: 45 },
  { id: 'M-01203', name: 'Sandra Weaver',    status: 'Retired',  agency: 'County of Santa Barbara',         tier: 'Tier 1', yearsService: 31 },
  { id: 'M-02891', name: 'Carlos Reyes',     status: 'Active',   agency: 'County of Santa Barbara',         tier: 'Tier 2', yearsService: 12 },
  { id: 'M-03405', name: 'Margaret Tran',    status: 'Retired',  agency: 'County of Santa Barbara',         tier: 'Tier 1', yearsService: 28 },
  { id: 'M-04112', name: 'James Okonkwo',    status: 'Active',   agency: 'Carpinteria-Summerland Fire',     tier: 'Safety Tier 1', yearsService: 19 },
  { id: 'M-04788', name: 'Patricia Lin',     status: 'Deferred', agency: 'County of Santa Barbara',         tier: 'Tier 2', yearsService: 7 },
  { id: 'M-05234', name: 'Robert Ashby',     status: 'Survivor', agency: 'County of Santa Barbara',         tier: 'Tier 1', yearsService: null },
  { id: 'M-05901', name: 'Diana Castillo',   status: 'Active',   agency: 'Goleta Cemetery District',        tier: 'Tier 2', yearsService: 4 },
  { id: 'M-06344', name: 'Thomas Brandt',    status: 'Retired',  agency: 'County of Santa Barbara',         tier: 'Tier 1', yearsService: 33 },
  { id: 'M-07019', name: 'Helen Nakamura',   status: 'Active',   agency: 'County of Santa Barbara',         tier: 'Tier 3', yearsService: 9 },
];

export const memberDetails = {
  'M-00847': {
    id: 'M-00847',
    name: 'Bush Odonaldi',
    status: 'Active',
    agency: 'County of Santa Barbara',
    tier: 'Safety Tier 1',
    yearsService: 45,
    dob: 'March 14, 1959',
    gender: 'Male',
    maritalStatus: 'Married',
    beneficiary: 'Maria Odonaldi (Spouse)',
    address: '412 State Street, Santa Barbara, CA 93101',
    phone: '(805) 555-0142',
    email: 'b.odonaldi@countyofsb.org',
    entityId: 'ENT-00847',
    monthlyBenefit: '$6,840',
    totalServiceCredit: '45.0 yrs',
    finalAvgSalary: '$152,000',
    totalContributions: '$298,440',
    retirementDate: 'Projected Jun 2024',
    employment: [
      { employer: 'County of Santa Barbara', title: 'Sheriff', department: 'Law Enforcement', start: 'Jun 3, 1980', end: '—', status: 'Active' },
    ],
    earnings: [
      { period: 'Apr 1–14, 2026',   rawCode: 'REG',    gross: 5840,  hours: 80, leaveHours: 0 },
      { period: 'Mar 15–31, 2026',  rawCode: 'REG',    gross: 5840,  hours: 80, leaveHours: 0 },
      { period: 'Mar 1–14, 2026',   rawCode: 'OT',     gross: 7020,  hours: 92, leaveHours: 0 },
      { period: 'Feb 15–28, 2026',  rawCode: 'REG',    gross: 5840,  hours: 80, leaveHours: 0 },
      { period: 'Feb 1–14, 2026',   rawCode: 'OT',     gross: 7020,  hours: 92, leaveHours: 0 },
      { period: 'Jan 15–31, 2026',  rawCode: 'REG',    gross: 5840,  hours: 80, leaveHours: 0 },
      { period: 'Jan 1–14, 2026',   rawCode: 'VACATION', gross: 5840, hours: 80, leaveHours: 80 },
      { period: 'Dec 15–31, 2025',  rawCode: 'REG',    gross: 5840,  hours: 80, leaveHours: 0 },
      { period: 'Dec 1–14, 2025',   rawCode: 'REG',    gross: 5840,  hours: 80, leaveHours: 0 },
      { period: 'Nov 15–30, 2025',  rawCode: 'REG',    gross: 5840,  hours: 80, leaveHours: 0 },
      { period: 'Nov 1–14, 2025',   rawCode: 'REG',    gross: 5840,  hours: 80, leaveHours: 0 },
      { period: 'Oct 15–31, 2025',  rawCode: 'REG',    gross: 5840,  hours: 80, leaveHours: 0 },
      // Historical legacy codes (visible in "Full career" view)
      { period: 'Jun 1–14, 2004',   rawCode: 'PTO20',  gross: 3200,  hours: 80, leaveHours: 80 },
      { period: 'May 15–31, 2004',  rawCode: 'REG',    gross: 3200,  hours: 80, leaveHours: 0 },
      { period: 'May 1–14, 2004',   rawCode: 'VAC-O',  gross: 1600,  hours: 40, leaveHours: 40 },
      { period: 'Aug 1–14, 2003',   rawCode: 'MED-LV', gross: 1800,  hours: 40, leaveHours: 40 },
      { period: 'Jul 15–31, 2003',  rawCode: 'MED-LV', gross: 1800,  hours: 40, leaveHours: 40 },
      { period: 'Jul 1–14, 2003',   rawCode: 'REG',    gross: 3200,  hours: 80, leaveHours: 0 },
    ],
    contributions: [
      { period: 'Apr 2026', member: 5256,  employer: 12848, total: 18104, tier: 'Safety Tier 1' },
      { period: 'Mar 2026', member: 5256,  employer: 12848, total: 18104, tier: 'Safety Tier 1' },
      { period: 'Feb 2026', member: 5256,  employer: 12848, total: 18104, tier: 'Safety Tier 1' },
      { period: 'Jan 2026', member: 5256,  employer: 12848, total: 18104, tier: 'Safety Tier 1' },
      { period: 'Dec 2025', member: 5256,  employer: 12848, total: 18104, tier: 'Safety Tier 1' },
      { period: 'Nov 2025', member: 5256,  employer: 12848, total: 18104, tier: 'Safety Tier 1' },
      { period: 'Oct 2025', member: 5256,  employer: 12848, total: 18104, tier: 'Safety Tier 1' },
      { period: 'Sep 2025', member: 5256,  employer: 12848, total: 18104, tier: 'Safety Tier 1' },
      { period: 'Aug 2025', member: 5256,  employer: 12848, total: 18104, tier: 'Safety Tier 1' },
      { period: 'Jul 2025', member: 5256,  employer: 12848, total: 18104, tier: 'Safety Tier 1' },
      { period: 'Jun 2025', member: 5050,  employer: 12344, total: 17394, tier: 'Safety Tier 1' },
      { period: 'May 2025', member: 5050,  employer: 12344, total: 17394, tier: 'Safety Tier 1' },
    ],
    transactions: [
      { date: 'Apr 1, 2026',  type: 'Interest Posting',   amount: '$1,241.80', balance: '$301,921.00', notes: 'Quarterly interest credit at 7.25% annual rate' },
      { date: 'Jan 1, 2026',  type: 'Interest Posting',   amount: '$1,198.40', balance: '$298,440.00', notes: 'Quarterly interest credit' },
      { date: 'Oct 1, 2025',  type: 'COLA Adjustment',    amount: '+2.3%',     balance: '$296,010.00', notes: 'FY2026 COLA applied per Board resolution' },
      { date: 'Jul 1, 2025',  type: 'Interest Posting',   amount: '$1,145.20', balance: '$290,200.00', notes: 'Quarterly interest credit' },
      { date: 'Apr 1, 2025',  type: 'Interest Posting',   amount: '$1,102.60', balance: '$285,400.00', notes: 'Quarterly interest credit' },
      { date: 'Mar 15, 2010', type: 'Service Purchase',   amount: '$14,200.00',balance: '$98,200.00',  notes: 'Purchase of 8 months SDI leave (Jul–Feb 2003)' },
      { date: 'Feb 1, 2020',  type: 'Benefit Payment',    amount: '-$6,840.00',balance: '$251,000.00', notes: 'Monthly benefit payment — projected' },
      { date: 'Jan 1, 2020',  type: 'Benefit Payment',    amount: '-$6,840.00',balance: '$257,840.00', notes: 'Monthly benefit payment — projected' },
    ],
    health: {
      plan: 'County PPO Plan',
      coverageStart: 'Jun 3, 1980',
      premiumDeduction: '$312/month',
      openEnrollment: 'October 2026',
      continuanceBeneficiary: 'Maria Odonaldi (Spouse)',
    },
  },
  'M-01203': {
    id: 'M-01203', name: 'Sandra Weaver', status: 'Retired', agency: 'County of Santa Barbara',
    tier: 'Tier 1', yearsService: 31, dob: 'July 22, 1951', gender: 'Female',
    maritalStatus: 'Widowed', beneficiary: 'N/A', address: '820 Chapala St, Santa Barbara, CA 93101',
    phone: '(805) 555-0198', email: 's.weaver@gmail.com', entityId: 'ENT-01203',
    monthlyBenefit: '$4,210', totalServiceCredit: '31.0 yrs', finalAvgSalary: '$71,200',
    totalContributions: '$182,440', retirementDate: 'Mar 1, 2019',
    employment: [{ employer: 'County of Santa Barbara', title: 'Senior Clerk', department: 'County Clerk', start: 'Feb 14, 1985', end: 'Mar 1, 2019', status: 'Retired' }],
    earnings: [], contributions: [], transactions: [],
    health: { plan: 'County HMO Plan', coverageStart: 'Mar 1, 2019', premiumDeduction: '$248/month', openEnrollment: 'October 2026', continuanceBeneficiary: 'N/A' },
  },
};

// Fill out remaining members with minimal detail
['M-02891','M-03405','M-04112','M-04788','M-05234','M-05901','M-06344','M-07019'].forEach(id => {
  const m = members.find(x => x.id === id);
  if (m && !memberDetails[id]) {
    memberDetails[id] = {
      ...m, dob: 'Jan 1, 1970', gender: 'N/A', maritalStatus: 'N/A', beneficiary: 'N/A',
      address: 'Santa Barbara, CA', phone: '(805) 555-0000', email: 'member@countyofsb.org',
      entityId: `ENT-${id.replace('M-','')}`,
      monthlyBenefit: '$2,400', totalServiceCredit: `${m.yearsService || 0} yrs`,
      finalAvgSalary: '$62,000', totalContributions: '$95,000', retirementDate: 'N/A',
      employment: [], earnings: [], contributions: [], transactions: [],
      health: { plan: 'County PPO Plan', coverageStart: 'N/A', premiumDeduction: '$280/month', openEnrollment: 'October 2026', continuanceBeneficiary: 'N/A' },
    };
  }
});

export const payrollRecords = [
  { memberId: 'M-00847', name: 'Bush Odonaldi',   agency: 'County of Santa Barbara',      tier: 'Safety Tier 1', gross: 6840,  healthDed: 312,  net: 6528,  method: 'Direct Deposit', status: 'Paid' },
  { memberId: 'M-01203', name: 'Sandra Weaver',   agency: 'County of Santa Barbara',      tier: 'Tier 1',        gross: 4210,  healthDed: 248,  net: 3962,  method: 'Direct Deposit', status: 'Paid' },
  { memberId: 'M-03405', name: 'Margaret Tran',   agency: 'County of Santa Barbara',      tier: 'Tier 1',        gross: 3840,  healthDed: 280,  net: 3560,  method: 'Direct Deposit', status: 'Paid' },
  { memberId: 'M-06344', name: 'Thomas Brandt',   agency: 'County of Santa Barbara',      tier: 'Tier 1',        gross: 5120,  healthDed: 312,  net: 4808,  method: 'Direct Deposit', status: 'Paid' },
  { memberId: 'M-04112', name: 'James Okonkwo',   agency: 'Carpinteria-Summerland Fire',  tier: 'Safety Tier 1', gross: 6400,  healthDed: 380,  net: 6020,  method: 'Direct Deposit', status: 'Paid' },
  { memberId: 'M-05234', name: 'Robert Ashby',    agency: 'County of Santa Barbara',      tier: 'Tier 1',        gross: 1800,  healthDed: 200,  net: 1600,  method: 'Check',          status: 'Paid' },
  { memberId: 'M-05901', name: 'Diana Castillo',  agency: 'Goleta Cemetery District',     tier: 'Tier 2',        gross: 2100,  healthDed: 220,  net: 1880,  method: 'Direct Deposit', status: 'Paid' },
  { memberId: 'M-07019', name: 'Helen Nakamura',  agency: 'County of Santa Barbara',      tier: 'Tier 3',        gross: 2840,  healthDed: 248,  net: 2592,  method: 'Direct Deposit', status: 'Paid' },
  { memberId: 'M-02891', name: 'Carlos Reyes',    agency: 'County of Santa Barbara',      tier: 'Tier 2',        gross: 3200,  healthDed: 280,  net: 2920,  method: 'Direct Deposit', status: 'Pending' },
  { memberId: 'M-04788', name: 'Patricia Lin',    agency: 'County of Santa Barbara',      tier: 'Tier 2',        gross: 1900,  healthDed: 210,  net: 1690,  method: 'Direct Deposit', status: 'On Hold' },
];

export const contributionAgencies = [
  { agency: 'County of Santa Barbara',          frequency: 'Bi-weekly', lastSubmission: 'Apr 11, 2026', memberContrib: 1840200, employerContrib: 4412800, status: 'Current',
    detail: [
      { period: 'Apr 1–11, 2026',  member: 920100,  employer: 2206400, status: 'Current' },
      { period: 'Mar 15–31, 2026', member: 920100,  employer: 2206400, status: 'Current' },
      { period: 'Mar 1–14, 2026',  member: 918200,  employer: 2204800, status: 'Current' },
    ]},
  { agency: 'Carpinteria-Summerland Fire',       frequency: 'Monthly',   lastSubmission: 'Apr 1, 2026',  memberContrib: 38400,   employerContrib: 91200,   status: 'Current',
    detail: [
      { period: 'Mar 2026', member: 38400, employer: 91200, status: 'Current' },
      { period: 'Feb 2026', member: 37800, employer: 89900, status: 'Current' },
      { period: 'Jan 2026', member: 37200, employer: 88500, status: 'Current' },
    ]},
  { agency: 'Goleta Cemetery District',          frequency: 'Monthly',   lastSubmission: 'Mar 28, 2026', memberContrib: 4100,    employerContrib: 9800,    status: 'Late',
    detail: [
      { period: 'Feb 2026', member: 4100, employer: 9800, status: 'Late' },
      { period: 'Jan 2026', member: 3900, employer: 9300, status: 'Current' },
      { period: 'Dec 2025', member: 3900, employer: 9300, status: 'Current' },
    ]},
  { agency: 'Air Pollution Control Dist.',       frequency: 'Bi-monthly',lastSubmission: 'Apr 5, 2026',  memberContrib: 12600,   employerContrib: 30100,   status: 'Current',
    detail: [
      { period: 'Mar–Apr 2026', member: 12600, employer: 30100, status: 'Current' },
      { period: 'Jan–Feb 2026', member: 12200, employer: 29100, status: 'Current' },
      { period: 'Nov–Dec 2025', member: 11800, employer: 28200, status: 'Current' },
    ]},
];

export const monthlyContribTrend = [
  { month: 'Jan 2026', member: 1820000, employer: 4380000 },
  { month: 'Feb 2026', member: 1830000, employer: 4395000 },
  { month: 'Mar 2026', member: 1840200, employer: 4412800 },
  { month: 'Apr 2026', member: 1855000, employer: 4440000 },
];

export const reports = [
  { id: 'R-001', name: 'Member Roster',                    desc: 'Full list of all active, retired, deferred, and survivor members with key demographics.', lastGenerated: 'Apr 12, 2026', schedule: 'Weekly', link: null },
  { id: 'R-002', name: 'Monthly Benefit Payroll Summary',  desc: 'Gross and net payroll by agency and plan tier for the selected month.',                   lastGenerated: 'Apr 1, 2026',  schedule: 'Monthly', link: null },
  { id: 'R-003', name: 'YTD Contributions by Agency',      desc: 'Contribution intake summary year to date.',                                               lastGenerated: 'Apr 11, 2026', schedule: 'Weekly', link: null },
  { id: 'R-004', name: 'Service Purchase Activity',        desc: 'All service purchases processed in a date range.',                                         lastGenerated: 'Apr 10, 2026', schedule: 'On demand', link: null },
  { id: 'R-005', name: 'Exception Report',                 desc: 'Members with data discrepancies flagged by the nightly pipeline.',                         lastGenerated: 'Apr 13, 2026', schedule: 'Daily', link: '/exceptions' },
  { id: 'R-006', name: 'Benefit Calculation Worksheet',    desc: 'Blank vet worksheet template for manual calculations.',                                    lastGenerated: 'Mar 1, 2026',  schedule: 'On demand', link: null },
];

export const auditLog = [
  { id: 'AL-001', ts: 'Apr 13, 2026 09:14', user: 'Sandra R.',  role: 'Member Services', member: 'Bush Odonaldi',   action: 'Viewed Record',   details: 'Viewed member profile M-00847' },
  { id: 'AL-002', ts: 'Apr 13, 2026 09:42', user: 'Sandra R.',  role: 'Member Services', member: 'Margaret Tran',   action: 'Downloaded Data', details: 'Downloaded earnings history — M-03405' },
  { id: 'AL-003', ts: 'Apr 12, 2026 14:21', user: 'Greg L.',    role: 'Admin',           member: 'Bush Odonaldi',   action: 'Viewed Record',   details: 'Reviewed exception EXC-0041' },
  { id: 'AL-004', ts: 'Apr 12, 2026 10:05', user: 'Rebecca T.', role: 'Disability',      member: 'Carlos Reyes',    action: 'Viewed Record',   details: 'Reviewed SDI leave record' },
  { id: 'AL-005', ts: 'Apr 11, 2026 16:33', user: 'Chris M.',   role: 'Finance',         member: 'N/A',             action: 'Ran Report',       details: 'Generated YTD Contributions by Agency' },
  { id: 'AL-006', ts: 'Apr 11, 2026 11:18', user: 'Sandra R.',  role: 'Member Services', member: 'Thomas Brandt',   action: 'Viewed Record',   details: 'Viewed member profile M-06344' },
  { id: 'AL-007', ts: 'Apr 10, 2026 15:47', user: 'Greg L.',    role: 'Admin',           member: 'Patricia Lin',    action: 'Downloaded Data', details: 'Downloaded contribution history — M-04788' },
  { id: 'AL-008', ts: 'Apr 9, 2026 09:02',  user: 'Chris M.',   role: 'Finance',         member: 'N/A',             action: 'Ran Report',       details: 'Generated Monthly Benefit Payroll Summary' },
  { id: 'AL-009', ts: 'Apr 8, 2026 13:55',  user: 'Rebecca T.', role: 'Disability',      member: 'James Okonkwo',   action: 'Viewed Record',   details: 'Reviewed disability claim history' },
  { id: 'AL-010', ts: 'Apr 7, 2026 10:30',  user: 'Sandra R.',  role: 'Member Services', member: 'Helen Nakamura',  action: 'Viewed Record',   details: 'Viewed member profile M-07019' },
];

export const exceptions = [
  {
    id: 'EXC-0041', memberId: 'M-00847', memberName: 'Bush Odonaldi',
    source: 'PayPlus', type: 'Earnings Code Mismatch', severity: 'Critical',
    dateFlagged: 'Apr 12, 2026', status: 'Open', assignedTo: 'Greg L.',
    detail: {
      payPlusValue: 'PTO20', pgExpected: 'VACATION', normalized: 'Vacation',
      era: '1998–2005 legacy coding convention',
      explanation: 'PayPlus submitted earnings code PTO20 for pay period ending Mar 28 2026. This code was retired in 2005 and replaced by VACATION. The warehouse normalization table maps PTO20 to Vacation but flagged this record because the code should no longer appear in post-2005 payroll data. Action required: confirm with County payroll whether this is a data entry error or a system migration artifact.',
    },
  },
  { id: 'EXC-0042', memberId: 'M-02891', memberName: 'Carlos Reyes',    source: 'PayPlus',     type: 'Missing Pay Period',            severity: 'Warning',  dateFlagged: 'Apr 10, 2026', status: 'Open',      assignedTo: 'Sandra R.', detail: { explanation: 'No PayPlus submission received for pay period Feb 1–14, 2026. Gap detected in bi-weekly payroll feed.' } },
  { id: 'EXC-0043', memberId: 'M-02891', memberName: 'Carlos Reyes',    source: 'PayPlus',     type: 'Missing Pay Period',            severity: 'Warning',  dateFlagged: 'Apr 10, 2026', status: 'In Review', assignedTo: 'Sandra R.', detail: { explanation: 'Second consecutive missing period flagged — Feb 15–28, 2026.' } },
  { id: 'EXC-0044', memberId: 'M-04112', memberName: 'James Okonkwo',   source: 'PayPlus',     type: 'Contribution Amount Discrepancy', severity: 'Warning', dateFlagged: 'Apr 8, 2026',  status: 'In Review', assignedTo: 'Chris M.',  detail: { payPlusValue: '$1,840', pgExpected: '$1,820', explanation: 'PayPlus contribution $1,840, Pension Gold posted $1,820 — $20 difference. May be rounding in employer rate calculation.' } },
  { id: 'EXC-0045', memberId: 'M-07019', memberName: 'Helen Nakamura',  source: 'PayPlus',     type: 'Contribution Amount Discrepancy', severity: 'Warning', dateFlagged: 'Apr 8, 2026',  status: 'Open',      assignedTo: 'Chris M.',  detail: { payPlusValue: '$1,215', pgExpected: '$1,200', explanation: 'PayPlus contribution $1,215, Pension Gold posted $1,200 — $15 difference.' } },
  { id: 'EXC-0046', memberId: 'M-03405', memberName: 'Margaret Tran',   source: 'Pension Gold',type: 'Date of Birth Conflict',         severity: 'Critical', dateFlagged: 'Apr 5, 2026',  status: 'Open',      assignedTo: 'Greg L.',   detail: { payPlusValue: 'Mar 3, 1961', pgExpected: 'Mar 13, 1961', explanation: 'PayPlus DOB is Mar 3, 1961; Pension Gold shows Mar 13, 1961 — day transposition, likely a data entry error at Pension Gold onboarding.' } },
  { id: 'EXC-0047', memberId: 'M-04788', memberName: 'Patricia Lin',    source: 'PayPlus',     type: 'Unmatched Member ID',           severity: 'Info',     dateFlagged: 'Apr 3, 2026',  status: 'Open',      assignedTo: 'Sandra R.', detail: { explanation: 'Member appears in PayPlus with ID 04788-B. No matching record found in Pension Gold — likely a duplicate or alias created during system migration.' } },
  { id: 'EXC-0048', memberId: 'M-01203', memberName: 'Sandra Weaver',   source: 'PayPlus',     type: 'Earnings Code Mismatch',        severity: 'Info',     dateFlagged: 'Apr 1, 2026',  status: 'Resolved',  assignedTo: 'Greg L.',   detail: { explanation: 'Legacy earnings code flagged and confirmed as valid historical record. Resolved by Greg L. Apr 10 2026.' } },
];
