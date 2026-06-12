import { useState, useEffect } from 'react';
import { Briefcase, Users, Star, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosClient';

export default function Dashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, jobsRes] = await Promise.all([
          api.get('/applications/my'),
          api.get('/jobseeker/ai-recommendations'),
        ]);

        const apps = appsRes.data.payload || [];
        const jobs = jobsRes.data.payload || [];

        setApplications(apps);

        // Recommend jobs matching user skills that they haven't applied to yet
        const appliedJobIds = apps.map(a => a.jobId?._id || a.jobId);
        const notApplied = jobs.filter(j => !appliedJobIds.includes(j._id));
        setRecommendedJobs(notApplied.slice(0, 3)); // top 3 matching jobs
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Stats real data se
  const totalApplied = applications.length;

  const thisWeekApplied = applications.filter(app => {
    const appliedDate = new Date(app.createdAt);
    const now = new Date();
    const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    return appliedDate >= weekAgo;
  }).length;

  const interviewCount = applications.filter(app =>
    app.status?.toLowerCase() === 'interview'
  ).length;

  const upcomingInterviews = applications.filter(app =>
    app.status?.toLowerCase() === 'interview'
  ).length;

  const checks = [
    { label: 'Name', done: !!(user?.name || user?.fullName) },
    { label: 'Phone', done: !!user?.phone },
    { label: 'Location', done: !!user?.location },
    { label: 'Skills', done: !!(user?.skills && user?.skills.length > 0) },
    { label: 'Resume', done: !!user?.resume?.url },
  ];
  const doneCount = checks.filter(c => c.done).length;
  const completionPercent = Math.round((doneCount / checks.length) * 100);

  const stats = [
    {
      label: 'Jobs Applied',
      value: totalApplied,
      icon: <Briefcase size={24} color="#3b82f6" />,
      change: `+${thisWeekApplied} this week`,
    },
    {
      label: 'Profile Views',
      value: user?.profileViews?.length || 0,
      icon: <Users size={24} color="#8b5cf6" />,
      change: 'Based on your profile',
    },
    {
      label: 'Interviews',
      value: interviewCount,
      icon: <Star size={24} color="#f59e0b" />,
      change: `${upcomingInterviews} coming up`,
    },
  ];

  const handleApply = async (id) => {
    try {
      await api.post(`/applications/${id}`);
      alert('Successfully applied! The employer has been notified.');
      // recommended list se remove karo
      setRecommendedJobs(prev => prev.filter(j => j._id !== id));
      // applications count update karo
      const res = await api.get('/applications/my');
      setApplications(res.data.payload || []);
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to apply.');
    }
  };

  if (isLoading) return <div style={{ padding: '24px' }}>Loading dashboard...</div>;

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Dashboard</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Welcome back, {user?.name || user?.fullName || 'User'}! Here's your job search overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        {stats.map((stat, i) => (
          <div key={i} className={`glass-panel animate-slide-up delay-${(i + 1) * 100}`} style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.7)', borderRadius: '12px' }}>
                {stat.icon}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 700, marginBottom: '4px' }}>{stat.value}</div>
              <div style={{ color: 'var(--text-dark)', fontWeight: 500, fontSize: '14px' }}>{stat.label}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '8px' }}>{stat.change}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Recommended Jobs */}
        <div className="glass-panel animate-slide-up delay-400" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '18px' }}>Recommended For You</h3>
            <Link to="/jobseeker/jobs" style={{ fontSize: '14px', color: 'var(--primary-main)', textDecoration: 'none', fontWeight: 500 }}>View All</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {recommendedJobs.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                You've applied to all available jobs! <Link to="/jobseeker/jobs" style={{ color: 'var(--primary-main)' }}>Check back later</Link>
              </div>
            ) : (
              recommendedJobs.map((job) => (
                <div
                  key={job._id}
                  style={{
                    padding: '20px', borderRadius: '12px', background: 'rgba(255,255,255,0.4)',
                    border: '1px solid rgba(255,255,255,0.6)', display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', transition: 'all 0.3s'
                  }}
                  className="job-card-hover"
                >
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>{job.title}</h4>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      {job.employerId?.companyName || 'Company'} • {job.location || 'Remote'}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {job.salary && (
                        <span className="badge badge-info">${job.salary.toLocaleString()}</span>
                      )}
                      {job.jobType && (
                        <span className="badge" style={{ background: 'var(--bg-color-dark)', color: 'var(--text-dark)', textTransform: 'capitalize' }}>
                          {job.jobType}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    className="btn-secondary"
                    style={{ padding: '8px 16px', display: 'inline-flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
                    onClick={() => handleApply(job._id)}
                  >
                    Apply <ArrowUpRight size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Profile Completion */}
        <div className="glass-panel animate-slide-up delay-400" style={{ padding: '24px', background: 'linear-gradient(135deg, var(--primary-main), var(--primary-dark))', color: 'white' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: 'white' }}>Profile Setup</h3>
          <div style={{ position: 'relative', height: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '4px', marginBottom: '16px' }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, height: '100%',
              width: `${completionPercent}%`, background: 'white', borderRadius: '4px',
              boxShadow: '0 0 10px rgba(255,255,255,0.5)',
              transition: 'width 0.5s ease',
            }} />
          </div>
          <div style={{ fontSize: '14px', marginBottom: '24px', color: 'rgba(255,255,255,0.8)' }}>
            {completionPercent === 100 
              ? '🎉 Profile is 100% complete!' 
              : `${completionPercent}% Complete - Add your resume to unlock 2x more profile views!`}
          </div>
          <Link
            to="/jobseeker/profile"
            className="btn-secondary"
            style={{ width: '100%', border: 'none', background: 'rgba(255,255,255,0.95)', textDecoration: 'none', display: 'block', textAlign: 'center' }}
          >
            Complete Profile
          </Link>
        </div>
      </div>
    </div>
  );
}