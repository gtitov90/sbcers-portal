import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useMode } from '../context/ModeContext';
import { members } from '../data/sampleData';
import StatusBadge from '../components/StatusBadge';
import MemberAvatar from '../components/MemberAvatar';
import { Input } from '@progress/kendo-react-inputs';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Button } from '@progress/kendo-react-buttons';

const STATUSES  = ['Active', 'Retired', 'Deferred', 'Survivor'];
const AGENCIES  = ['County of Santa Barbara', 'Carpinteria-Summerland Fire', 'Goleta Cemetery District'];
const GENDERS   = ['Male', 'Female'];
const MARITAL   = ['Single', 'Married', 'Widowed'];
const AGE_BANDS = [
  { label: 'Under 40',  test: a => a < 40 },
  { label: '40 – 54',   test: a => a >= 40 && a <= 54 },
  { label: '55 – 64',   test: a => a >= 55 && a <= 64 },
  { label: '65+',       test: a => a >= 65 },
];

function getAge(dob) {
  if (!dob) return null;
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  if (today < new Date(today.getFullYear(), birth.getMonth(), birth.getDate())) age--;
  return age;
}

export default function MemberSearch() {
  const { mode } = useMode();
  const navigate = useNavigate();

  // Custom App filter state
  const [query,          setQuery]          = useState('');
  const [statusSelect,   setStatusSelect]   = useState('');
  const [agencySelect,   setAgencySelect]   = useState('');
  const [genderSelect,   setGenderSelect]   = useState('');
  const [maritalSelect,  setMaritalSelect]  = useState('');
  const [ageSelect,      setAgeSelect]      = useState('');

  // Power BI checkbox filter state
  const [statusFilter, setStatusFilter] = useState([]);
  const [agencyFilter, setAgencyFilter] = useState([]);
  const [genderFilter, setGenderFilter] = useState([]);
  const [maritalFilter,setMaritalFilter] = useState([]);
  const [ageFilter,    setAgeFilter]    = useState([]);

  const toggleFilter = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);

  const hasActiveFilters = statusSelect || agencySelect || genderSelect || maritalSelect || ageSelect;
  const clearFilters = () => { setStatusSelect(''); setAgencySelect(''); setGenderSelect(''); setMaritalSelect(''); setAgeSelect(''); };

  const filtered = members.filter(m => {
    const age = getAge(m.dob);
    const q = query.toLowerCase();
    const matchQ       = !q || m.name.toLowerCase().includes(q) || m.id.toLowerCase().includes(q);
    const matchStatus  = mode === 'powerbi'
      ? (statusFilter.length === 0 || statusFilter.includes(m.status))
      : (!statusSelect || m.status === statusSelect);
    const matchAgency  = mode === 'powerbi'
      ? (agencyFilter.length === 0 || agencyFilter.includes(m.agency))
      : (!agencySelect || m.agency === agencySelect);
    const matchGender  = mode === 'powerbi'
      ? (genderFilter.length === 0 || genderFilter.includes(m.gender))
      : (!genderSelect || m.gender === genderSelect);
    const matchMarital = mode === 'powerbi'
      ? (maritalFilter.length === 0 || maritalFilter.includes(m.maritalStatus))
      : (!maritalSelect || m.maritalStatus === maritalSelect);
    const matchAge     = mode === 'powerbi'
      ? (ageFilter.length === 0 || AGE_BANDS.filter(b => ageFilter.includes(b.label)).some(b => b.test(age)))
      : (!ageSelect || AGE_BANDS.find(b => b.label === ageSelect)?.test(age));
    return matchQ && matchStatus && matchAgency && matchGender && matchMarital && matchAge;
  });

  const goToMember = (id) => {
    if (mode === 'powerbi') alert(`Drilling through to: Member Profile — ${id}`);
    navigate(`/member/${id}`);
  };

  // PBI slicer: search within member name list only
  const [slicerQuery, setSlicerQuery] = useState('');
  const slicerNames = members.map(m => m.name);
  const visibleSlicerNames = slicerNames.filter(n => n.toLowerCase().includes(slicerQuery.toLowerCase()));
  const [nameFilter, setNameFilter] = useState([]);
  const toggleName = (name) => setNameFilter(prev => prev.includes(name) ? prev.filter(x => x !== name) : [...prev, name]);

  const pbiFiltered = members.filter(m => {
    const matchName    = nameFilter.length === 0 || nameFilter.includes(m.name);
    const matchStatus  = statusFilter.length === 0  || statusFilter.includes(m.status);
    const matchAgency  = agencyFilter.length === 0  || agencyFilter.includes(m.agency);
    const matchGender  = genderFilter.length === 0  || genderFilter.includes(m.gender);
    const matchMarital = maritalFilter.length === 0 || maritalFilter.includes(m.maritalStatus);
    const age = getAge(m.dob);
    const matchAge     = ageFilter.length === 0     || AGE_BANDS.filter(b => ageFilter.includes(b.label)).some(b => b.test(age));
    return matchName && matchStatus && matchAgency && matchGender && matchMarital && matchAge;
  });

  if (mode === 'powerbi') {
    return (
      <div style={{ display: 'flex', gap: 0, height: '100%' }}>
        <div style={{ flex: 1, padding: '16px' }}>
          <div className="pbi-visual">
            <div className="pbi-visual-title">Member list</div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th><th>Member ID</th><th>Status</th>
                  <th>Agency</th><th>Plan Tier</th><th>Yrs Service</th>
                </tr>
              </thead>
              <tbody>
                {pbiFiltered.map(m => (
                  <tr key={m.id} style={{ cursor: 'pointer' }} onClick={() => goToMember(m.id)}>
                    <td style={{ color: '#0065A3', fontWeight: 500 }}>{m.name}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{m.id}</td>
                    <td><StatusBadge value={m.status} /></td>
                    <td>{m.agency}</td>
                    <td>{m.tier}</td>
                    <td>{m.yearsService ?? '—'}</td>
                  </tr>
                ))}
                {pbiFiltered.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: 'center', color: '#94A3B8', padding: 32 }}>No members found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PBI Filter pane */}
        <div className="filter-pane">
          <h4>Filters</h4>

          {/* Member Name slicer — simulates PBI's search-within-slicer */}
          <div className="filter-section">
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Member Name</div>
            <div style={{ fontSize: 11, color: '#A19F9D', marginBottom: 6, fontStyle: 'italic' }}>
              Searches slicer values only — not ID or SSN
            </div>
            <div style={{ marginBottom: 6 }}>
              <Input
                value={slicerQuery}
                onChange={e => setSlicerQuery(e.value)}
                placeholder="Search names…"
                prefix={() => <Search size={11} style={{ color: '#A19F9D', marginLeft: 6 }} />}
                style={{ width: '100%', fontSize: 12 }}
              />
            </div>
            <div style={{ maxHeight: 130, overflowY: 'auto' }}>
              {visibleSlicerNames.length === 0 && (
                <div style={{ fontSize: 11, color: '#A19F9D', padding: '4px 0' }}>No matching names</div>
              )}
              {visibleSlicerNames.map(name => (
                <label key={name} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, cursor: 'pointer', fontSize: 12 }}>
                  <input type="checkbox" checked={nameFilter.includes(name)} onChange={() => toggleName(name)} />
                  {name}
                </label>
              ))}
            </div>
            {slicerQuery && (
              <div style={{ fontSize: 11, color: '#C8503A', marginTop: 4, fontStyle: 'italic' }}>
                ⚠ Can't search by member ID or SSN here
              </div>
            )}
          </div>

          {/* Remaining attribute slicers */}
          {[
            { label: 'Member Status',  items: STATUSES,                    arr: statusFilter,  setArr: setStatusFilter  },
            { label: 'Agency',         items: AGENCIES,                    arr: agencyFilter,  setArr: setAgencyFilter  },
            { label: 'Gender',         items: GENDERS,                     arr: genderFilter,  setArr: setGenderFilter  },
            { label: 'Marital Status', items: MARITAL,                     arr: maritalFilter, setArr: setMaritalFilter },
            { label: 'Age Range',      items: AGE_BANDS.map(b => b.label), arr: ageFilter,     setArr: setAgeFilter     },
          ].map(({ label, items, arr, setArr }) => (
            <div key={label} className="filter-section">
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>{label}</div>
              {items.map(item => (
                <label key={item} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, cursor: 'pointer', fontSize: 12 }}>
                  <input type="checkbox" checked={arr.includes(item)} onChange={() => toggleFilter(arr, setArr, item)} />
                  {item}
                </label>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Custom App mode
  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', margin: 0 }}>Member Portal</h1>
          {hasActiveFilters && (
            <Button fillMode="flat" onClick={clearFilters} icon="x">Clear filters</Button>
          )}
        </div>

        {/* Search bar */}
        <div style={{ marginBottom: 10 }}>
          <Input
            value={query}
            onChange={e => setQuery(e.value)}
            placeholder="Search by name, member ID, or last 4 of SSN…"
            prefix={() => <Search size={16} style={{ color: '#94A3B8', marginLeft: 8 }} />}
            style={{ width: '100%' }}
          />
        </div>

        {/* Filter row */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <DropDownList
            data={STATUSES}
            value={statusSelect || null}
            defaultItem="All statuses"
            onChange={e => setStatusSelect(e.value === 'All statuses' ? '' : e.value)}
            style={{ width: 160 }}
          />
          <DropDownList
            data={AGENCIES}
            value={agencySelect || null}
            defaultItem="All agencies"
            onChange={e => setAgencySelect(e.value === 'All agencies' ? '' : e.value)}
            style={{ width: 220 }}
          />
          <DropDownList
            data={GENDERS}
            value={genderSelect || null}
            defaultItem="All genders"
            onChange={e => setGenderSelect(e.value === 'All genders' ? '' : e.value)}
            style={{ width: 140 }}
          />
          <DropDownList
            data={MARITAL}
            value={maritalSelect || null}
            defaultItem="All marital statuses"
            onChange={e => setMaritalSelect(e.value === 'All marital statuses' ? '' : e.value)}
            style={{ width: 180 }}
          />
          <DropDownList
            data={AGE_BANDS.map(b => b.label)}
            value={ageSelect || null}
            defaultItem="All ages"
            onChange={e => setAgeSelect(e.value === 'All ages' ? '' : e.value)}
            style={{ width: 140 }}
          />
        </div>
      </div>

      <div style={{ maxWidth: 900 }}>
        {/* Count */}
        <div style={{ fontSize: 13, color: '#64748B', marginBottom: 12 }}>
          Showing {filtered.length} of {members.length} members
          {hasActiveFilters && <span style={{ marginLeft: 6, color: '#185FA5', fontWeight: 500 }}>· filtered</span>}
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#94A3B8' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>No members found</div>
            <div style={{ fontSize: 13 }}>Try adjusting your search or filters.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map(m => (
              <div key={m.id} onClick={() => goToMember(m.id)}
                style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 8, padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, transition: 'box-shadow 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              >
                <MemberAvatar name={m.name} status={m.status} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 15, color: '#0F172A' }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                    {m.agency} · {m.tier}
                    {m.yearsService != null && <span> · {m.yearsService} yrs service</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 12, color: '#64748B', fontFamily: 'monospace' }}>{m.id}</span>
                  <StatusBadge value={m.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
