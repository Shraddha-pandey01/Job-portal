import { useState, useEffect, useCallback } from 'react';
import { Edit2, Trash2, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchJobs = useCallback(async () => {
    try {
      const res = await api.get('/employer/jobs');
      setJobs(res.data.payload || []);
    } catch (e) {
      console.error("Fetch error:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'open' ? 'closed' : 'open';
      await api.put(`/jobs/${id}`, { status: newStatus });
      setJobs(jobs.map(j => j._id === id ? { ...j, status: newStatus } : j));
    } catch (_err) {
      alert("Status toggle failed.");
    }
  };

  const deleteJob = async (id) => {
    if (confirm("Are you sure you want to permanently delete this job?")) {
      try {
        await api.delete(`/jobs/${id}`);
        setJobs(jobs.filter(j => j._id !== id));
      } catch (_err) {
        alert("Failed to delete job.");
      }
    }
  };

  if (isLoading) return <div style={{ padding: '24px' }}>Loading jobs...</div>;

  return (
    <div>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Manage Jobs</h1>
          <p style={{ color: 'var(--text-muted)' }}>View, edit or close your active job postings.</p>
        </div>
        <Link to="/employer/post-job" className="btn-primary" style={{ textDecoration: 'none' }}>+ Post New Job</Link>
      </div>

      <div className="glass-panel animate-slide-up" style={{ padding: '0', overflow: 'hidden' }}>
        {jobs.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
            You have not posted any jobs yet.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--glass-bg)', borderBottom: '1px solid var(--glass-border)' }}>
                <th style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Job Title</th>
                <th style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Applicants</th>
                <th style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Posted</th>
                <th style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }} className="hover-row">
                  <td style={{ padding: '20px 24px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-dark)', marginBottom: '4px' }}>{job.title}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{job.jobType} • {job.location}</div>
                  </td>
                  <td style={{ padding: '20px 24px' }}>
                    <span
                      onClick={() => toggleStatus(job._id, job.status || 'open')}
                      className={`badge ${(job.status || 'open') === 'open' ? 'badge-success' : 'badge-danger'}`}
                      style={{ cursor: 'pointer', display: 'inline-block' }}
                    >
                      {(job.status || 'open').toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '20px 24px' }}>
                    <Link to={`/employer/jobs/${job._id}/applicants`} style={{ fontSize: '13px', color: 'var(--primary-main)', fontWeight: 'bold', textDecoration: 'none' }}>
                      View Applications
                    </Link>
                  </td>
                  <td style={{ padding: '20px 24px', fontSize: '14px', color: 'var(--text-muted)' }}>
                    {new Date(job.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <Link to={`/employer/jobs/${job._id}/applicants`} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><Eye size={18} /></Link>
                      <button onClick={() => navigate(`/employer/edit-job/${job._id}`)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><Edit2 size={18} /></button>
                      <button onClick={() => deleteJob(job._id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}