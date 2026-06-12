import { useState, useEffect } from 'react';
import { Download, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { useParams, useSearchParams } from 'react-router-dom';
import api from '../../api/axiosClient';

export default function Applicants() {
  const { jobId } = useParams();
  const [searchParams] = useSearchParams();
  const highlight = searchParams.get('highlight');

  const [applicants, setApplicants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCandidate, setExpandedCandidate] = useState(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await api.get(`/applications/job/${jobId}`);
        const data = res.data.payload || [];
        setApplicants(data);
        if (highlight) {
          setExpandedCandidate(highlight);
        }
      } catch (e) {
        console.error("Failed to fetch applicants:", e);
      } finally {
        setIsLoading(false);
      }
    };
    if (jobId) fetchApplicants();
  }, [jobId]);

  const handleViewCandidate = async (jobseekerUserId) => {
    try {
      await api.post(`/jobseeker/${jobseekerUserId}/view`);
    } catch (err) {
      console.error("Failed to register jobseeker view:", err);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/applications/${id}/status`, { status: newStatus.toLowerCase() });
      setApplicants(applicants.map(a => a._id === id ? { ...a, status: newStatus.toLowerCase() } : a));
    } catch (e) {
       alert("Failed to update status");
    }
  };

  if (isLoading) return <div style={{ padding: '24px' }}>Loading applicants...</div>;

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Candidate Applications</h1>
        <p style={{ color: 'var(--text-muted)' }}>Review resumes, accept or reject candidates.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {applicants.map((app, index) => {
          const name = app.jobseekerId?.fullName || "Unknown";
          const statusDisplay = app.status ? app.status.charAt(0).toUpperCase() + app.status.slice(1) : 'Pending';
          const rawResume = app.jobseekerProfile?.resume?.url;
          const resumeUrl = rawResume ? `http://localhost:3000/${rawResume.replace(/\\/g, '/')}` : null;
          const phone = app.jobseekerProfile?.phone || "Not provided";
          const location = app.jobseekerProfile?.location || "Not provided";
          const skills = app.jobseekerProfile?.skills || [];
          const isExpanded = expandedCandidate === app._id;

          return (
            <div key={app._id} className={`glass-panel animate-slide-up delay-${(index+1)*100}`} style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-light), var(--primary-dark))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold' }}>
                    {name.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>{name}</h3>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Applied {new Date(app.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
                <span className={`badge ${
                  statusDisplay === 'Accepted' ? 'badge-success' : 
                  statusDisplay === 'Rejected' ? 'badge-danger' : 
                  statusDisplay === 'Interview' ? 'badge-info' : 'badge-warning'
                }`}>
                  {statusDisplay}
                </span>
              </div>

              <div style={{ background: 'var(--bg-color-dark)', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>Email Contact</div>
                <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-dark)' }}>{app.jobseekerId?.email || 'No email provided'}</div>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => {
                    setExpandedCandidate(isExpanded ? null : app._id);
                    handleViewCandidate(app.jobseekerId?._id || app.jobseekerId);
                  }}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '8px', fontSize: '13px' }}
                >
                  {isExpanded ? 'Hide Details' : 'View Details'}
                </button>
                <a 
                  href={resumeUrl || '#'} 
                  target={resumeUrl ? "_blank" : "_self"} 
                  rel="noreferrer"
                  onClick={() => handleViewCandidate(app.jobseekerId?._id || app.jobseekerId)}
                  className="btn-secondary" 
                  style={{ textDecoration: 'none', flex: 1, padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13px', opacity: resumeUrl ? 1 : 0.5, pointerEvents: resumeUrl ? 'auto' : 'none' }}>
                  <Download size={16} /> {resumeUrl ? 'Download Resume' : 'No Resume'}
                </a>
              </div>

              {isExpanded && (
                <div className="animate-fade-in" style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Phone: </span>
                    <strong style={{ color: 'var(--text-dark)' }}>{phone}</strong>
                  </div>
                  <div style={{ fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Location: </span>
                    <strong style={{ color: 'var(--text-dark)' }}>{location}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Skills:</span>
                    {skills.length === 0 ? (
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No skills listed</span>
                    ) : (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {skills.map((skill, sIdx) => (
                          <span key={sIdx} className="badge" style={{ background: 'var(--primary-glow)', color: 'var(--primary-dark)', border: '1px solid var(--primary-main)', fontSize: '11px', padding: '2px 8px' }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {statusDisplay === 'Pending' && (
                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <button 
                    onClick={() => updateStatus(app._id, 'Interview')}
                    style={{ flex: 1, padding: '8px', background: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: 600, transition: 'all 0.2s' }}
                  >
                    <Calendar size={16} /> Invite
                  </button>
                  <button 
                    onClick={() => updateStatus(app._id, 'Accepted')}
                    style={{ flex: 1, padding: '8px', background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: 600, transition: 'all 0.2s' }}
                  >
                    <CheckCircle size={16} /> Accept
                  </button>
                  <button 
                    onClick={() => updateStatus(app._id, 'Rejected')}
                    style={{ flex: 1, padding: '8px', background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: 600, transition: 'all 0.2s' }}
                  >
                    <XCircle size={16} /> Reject
                  </button>
                </div>
              )}
            </div>
          );
        })}
        {applicants?.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1 / -1' }}>No candidates have applied to this job yet.</div>
        ) : null}
      </div>
    </div>
  );
}
