import { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, DollarSign, Filter, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosClient';

export default function BrowseJobs() {
  const [allJobs, setAllJobs] = useState([]);
  const [displayedJobs, setDisplayedJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  
  // Explicitly mapping filter state
  const [filters, setFilters] = useState({
    jobType: [], // matches schema: 'full-time', 'part-time', 'internship'
    salaryTier: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
         const [jobsRes, appsRes] = await Promise.all([
           api.get('/jobs'),
           api.get('/applications/my')
         ]);
         const fetchedJobs = jobsRes.data.payload || [];
         const fetchedApps = appsRes.data.payload || [];
         setAllJobs(fetchedJobs);
         setDisplayedJobs(fetchedJobs);
         setAppliedJobIds(fetchedApps.map(a => a.jobId?._id || a.jobId));
      } catch (err) {
         console.error('Failed to grab jobs:', err);
      } finally {
         setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleApply = async (id) => {
    try {
      await api.post(`/applications/${id}`);
      alert('Successfully applied! The employer has been notified.');
      setAppliedJobIds(prev => [...prev, id]);
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to apply.');
    }
  };

  const handleFilterToggle = (type) => {
    setFilters((prev) => {
      const types = [...prev.jobType];
      if (types.includes(type)) {
        return { ...prev, jobType: types.filter(t => t !== type) };
      } else {
        types.push(type);
        return { ...prev, jobType: types };
      }
    });
  };

  const handleApplyFilters = () => {
    let filtered = [...allJobs];

    // Filter by textual search dynamically
    if (search.trim() !== '') {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(job => 
        (job.title || '').toLowerCase().includes(lowerSearch) || 
        (job.location || '').toLowerCase().includes(lowerSearch)
      );
    }

    // Filter by selected Job Types explicitly matching Mongoose Schema natively
    if (filters.jobType.length > 0) {
      filtered = filtered.filter(job => filters.jobType.includes(job.jobType));
    }

    // Filter by salary tiers via UI scaling
    if (filters.salaryTier > 0) {
       filtered = filtered.filter(job => (job.salary || 0) >= filters.salaryTier);
    }

    setDisplayedJobs(filtered);
  };

  if (isLoading) return <div style={{ padding: '24px' }}>Loading open positions...</div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '32px', alignItems: 'start' }}>
      
      {/* Filters Sidebar */}
      <div className="glass-panel" style={{ position: 'sticky', top: '100px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <Filter size={20} color="var(--primary-main)" />
          <h3 style={{ margin: 0, fontSize: '18px' }}>Filters</h3>
        </div>

        <div className="form-group">
          <label className="form-label" style={{ fontSize: '13px' }}>Job Type</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
            {['full-time', 'part-time', 'internship'].map(type => (
              <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer', textTransform: 'capitalize' }}>
                <input 
                   type="checkbox" 
                   checked={filters.jobType.includes(type)}
                   onChange={() => handleFilterToggle(type)}
                   style={{ width: '16px', height: '16px', accentColor: 'var(--primary-main)' }} 
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group" style={{ marginTop: '24px' }}>
          <label className="form-label" style={{ fontSize: '13px' }}>Minimum Salary Range ($1K - $200K)</label>
          <input 
            type="range" 
            min="0" 
            max="200000" 
            step="10000" 
            value={filters.salaryTier}
            onChange={(e) => setFilters({ ...filters, salaryTier: parseInt(e.target.value) })}
            style={{ width: '100%', marginTop: '12px', accentColor: 'var(--primary-main)' }} 
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
            <span>${(filters.salaryTier / 1000).toFixed(0)}k selected</span>
            <span>$200k+</span>
          </div>
        </div>

        <button 
          className="btn-primary" 
          onClick={handleApplyFilters}
          style={{ width: '100%', marginTop: '32px' }}
        >
          Apply Filters
        </button>
      </div>

      {/* Main Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Explore Opportunities</h1>
            <p style={{ color: 'var(--text-muted)' }}>Found {displayedJobs.length} jobs matching your criteria.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={16} />
              <input 
                type="text" 
                placeholder="Search precise roles..." 
                className="input-glass"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                style={{ paddingLeft: '36px', width: '250px' }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '20px' }}>
          {displayedJobs.map((job) => (
            <div key={job._id} className="glass-panel hover-card" style={{ padding: '24px', display: 'flex', gap: '24px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '12px', background: 'var(--bg-color-dark)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Briefcase size={28} color="var(--primary-main)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '18px', margin: 0, fontWeight: 600 }}>{job.title}</h3>
                  <span className="badge badge-info" style={{ textTransform: 'uppercase' }}>{job.jobType}</span>
                </div>
                <div style={{ fontSize: '14px', color: 'var(--primary-dark)', fontWeight: 500, marginBottom: '16px' }}>
                  {job.employerId?.companyName || 'Confidential Employer'}
                </div>
                <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  {job.description ? job.description.substring(0, 150) + '...' : 'No description provided.'}
                </p>
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-dark)' }}>
                    <MapPin size={16} color="var(--text-muted)" /> {job.location || 'Remote'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-dark)' }}>
                    <DollarSign size={16} color="var(--text-muted)" /> {job.salary ? `$${job.salary.toLocaleString()}` : 'Not specified'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-dark)' }}>
                    <Clock size={16} color="var(--text-muted)" /> {new Date(job.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '140px' }}>
                <button 
                  className="btn-primary" 
                  onClick={() => handleApply(job._id)}
                  disabled={appliedJobIds.includes(job._id)}
                  style={appliedJobIds.includes(job._id) ? { opacity: 0.6, cursor: 'not-allowed', background: 'var(--text-muted)' } : {}}
                >
                  {appliedJobIds.includes(job._id) ? 'Applied' : 'Apply Now'}
                </button>
              </div>
            </div>
          ))}

          {displayedJobs.length === 0 && (
             <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--glass-bg)', borderRadius: '16px' }}>
               No jobs successfully match your active filter arrays. Toggle filters to uncover roles natively.
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
