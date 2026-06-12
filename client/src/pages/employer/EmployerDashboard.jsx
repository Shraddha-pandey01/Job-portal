import { useState, useEffect } from 'react';
import { BarChart3, Users, Briefcase, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosClient';

export default function EmployerDashboard() {
  const [statsData, setStatsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await api.get('/employer/dashboard-stats');
        setStatsData(res.data.payload || res.data);
      } catch (err) {
        console.error("Failed to load employer dashboard stats:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  if (isLoading) return <div style={{ padding: '24px' }}>Loading dashboard...</div>;

  const stats = [
    { label: 'Active Jobs', value: statsData?.activeJobs !== undefined ? statsData.activeJobs.toString() : '0', icon: <Briefcase size={20} color="#3b82f6" /> },
    { label: 'Total Applicants', value: statsData?.totalApplicants !== undefined ? statsData.totalApplicants.toString() : '0', icon: <Users size={20} color="#8b5cf6" /> },
    { label: 'Interviews Scheduled', value: statsData?.interviewsScheduled !== undefined ? statsData.interviewsScheduled.toString() : '0', icon: <FileText size={20} color="#f59e0b" /> },
    { label: 'Profile Views', value: statsData?.profileViews !== undefined ? statsData.profileViews.toString() : '0', icon: <BarChart3 size={20} color="#10b981" /> },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Employer Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your job postings and applicants efficiently.</p>
        </div>
        <Link to="/employer/post-job" className="btn-primary">Post a New Job</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        {stats.map((stat, i) => (
          <div key={i} className={`glass-panel animate-slide-up delay-${(i+1)*100}`} style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ padding: '16px', background: 'rgba(255,255,255,0.7)', borderRadius: '16px' }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>{stat.value}</div>
              <div style={{ color: 'var(--text-dark)', fontWeight: 500, fontSize: '14px' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div className="glass-panel animate-slide-up delay-400" style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: '18px' }}>Recent Applicants</h3>
          {statsData?.recentApplicants?.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>No candidates have applied to your jobs yet.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ color: 'var(--text-muted)', fontSize: '14px', borderBottom: '1px solid var(--glass-border)' }}>
                  <th style={{ paddingBottom: '12px', fontWeight: 500 }}>Candidate</th>
                  <th style={{ paddingBottom: '12px', fontWeight: 500 }}>Applied Role</th>
                  <th style={{ paddingBottom: '12px', fontWeight: 500 }}>Date</th>
                  <th style={{ paddingBottom: '12px', fontWeight: 500 }}>Status</th>
                  <th style={{ paddingBottom: '12px', fontWeight: 500 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {statsData?.recentApplicants?.map((app, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '16px 0', fontWeight: 500 }}>{app.name}</td>
                    <td style={{ padding: '16px 0', color: 'var(--text-muted)', fontSize: '14px' }}>{app.role}</td>
                    <td style={{ padding: '16px 0', color: 'var(--text-muted)', fontSize: '14px' }}>{app.date}</td>
                    <td style={{ padding: '16px 0' }}><span className={`badge ${app.badge}`}>{app.status}</span></td>
                    <td style={{ padding: '16px 0' }}>
                      <Link to={app.jobId ? `/employer/jobs/${app.jobId}/applicants?highlight=${app._id}` : "/employer/manage-jobs"} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px', textDecoration: 'none' }}>
                        View Detail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Link to="/employer/manage-jobs" style={{ fontSize: '14px', color: 'var(--primary-main)', textDecoration: 'none', fontWeight: 500 }}>Manage applications →</Link>
          </div>
        </div>

        <div className="glass-panel animate-slide-up delay-400" style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: '18px' }}>Analytics Graph</h3>
          <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '8px', paddingBottom: '16px', borderBottom: '1px solid var(--glass-border)' }}>
            <div style={{ flex: 1, background: 'linear-gradient(to top, var(--primary-light), var(--primary-main))', height: '40%', borderRadius: '4px 4px 0 0' }}></div>
            <div style={{ flex: 1, background: 'linear-gradient(to top, var(--primary-light), var(--primary-main))', height: '60%', borderRadius: '4px 4px 0 0' }}></div>
            <div style={{ flex: 1, background: 'linear-gradient(to top, var(--primary-light), var(--primary-main))', height: '30%', borderRadius: '4px 4px 0 0' }}></div>
            <div style={{ flex: 1, background: 'linear-gradient(to top, var(--primary-light), var(--primary-main))', height: '80%', borderRadius: '4px 4px 0 0' }}></div>
            <div style={{ flex: 1, background: 'linear-gradient(to top, var(--primary-light), var(--primary-main))', height: '50%', borderRadius: '4px 4px 0 0' }}></div>
            <div style={{ flex: 1, background: 'linear-gradient(to top, var(--primary-light), var(--primary-main))', height: '90%', borderRadius: '4px 4px 0 0' }}></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', color: 'var(--text-muted)', fontSize: '12px' }}>
            <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
          </div>
        </div>
      </div>
    </div>
  );
}
