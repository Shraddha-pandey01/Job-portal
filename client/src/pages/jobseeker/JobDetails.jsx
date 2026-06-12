import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Briefcase, DollarSign, Calendar, Building, CheckCircle } from 'lucide-react';
import api from '../../api/axiosClient';

export default function JobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplied, setIsApplied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const [jobRes, appsRes] = await Promise.all([
          api.get(`/jobs/${jobId}`),
          api.get('/applications/my')
        ]);
        
        const jobData = jobRes.data.payload || jobRes.data;
        const apps = appsRes.data.payload || [];
        
        setJob(jobData);
        setIsApplied(apps.some(a => (a.jobId?._id || a.jobId) === jobId));
        
        // Trigger profile view increment for the employer
        const employerUserId = jobData.employerId?._id || jobData.employerId;
        if (employerUserId) {
          api.post(`/employer/${employerUserId}/view`).catch(err => {
            console.error("Failed to increment employer profile view:", err);
          });
        }
      } catch (err) {
        console.error("Failed to load job details:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  const handleApply = async () => {
    setIsApplying(true);
    try {
      await api.post(`/applications/${jobId}`);
      alert('Successfully applied! The employer has been notified.');
      setIsApplied(true);
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to apply.');
    } finally {
      setIsApplying(false);
    }
  };

  if (isLoading) return <div style={{ padding: '24px' }}>Loading job details...</div>;
  if (!job) return (
    <div style={{ padding: '24px' }}>
      <Link to="/jobseeker/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'var(--primary-main)', marginBottom: '24px' }}>
        <ArrowLeft size={16} /> Back to Browse Jobs
      </Link>
      <div className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}>Job not found.</div>
    </div>
  );

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/jobseeker/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'var(--primary-main)', marginBottom: '24px', fontWeight: 500 }}>
        <ArrowLeft size={16} /> Back to Browse Jobs
      </Link>

      <div className="glass-panel animate-slide-up" style={{ padding: '32px' }}>
        {/* Header Block */}
        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', marginBottom: '32px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '16px', background: 'var(--bg-color-dark)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Briefcase size={36} color="var(--primary-main)" />
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '24px', margin: '0 0 8px 0', fontWeight: 700 }}>{job.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-dark)', fontWeight: 600, fontSize: '15px', marginBottom: '12px' }}>
              <Building size={16} /> {job.employerId?.companyName || 'Confidential Employer'}
            </div>
            
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <span className="badge badge-info" style={{ textTransform: 'uppercase' }}>{job.jobType}</span>
              {job.salary && <span className="badge badge-success">${job.salary.toLocaleString()} / year</span>}
            </div>
          </div>
        </div>

        {/* Job Details Meta */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', background: 'var(--bg-color-light)', padding: '20px', borderRadius: '12px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MapPin size={18} color="var(--text-muted)" />
            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block' }}>Location</span>
              <strong style={{ fontSize: '14px' }}>{job.location || 'Remote'}</strong>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <DollarSign size={18} color="var(--text-muted)" />
            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block' }}>Salary Offer</span>
              <strong style={{ fontSize: '14px' }}>{job.salary ? `$${job.salary.toLocaleString()}` : 'Not Specified'}</strong>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calendar size={18} color="var(--text-muted)" />
            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block' }}>Date Posted</span>
              <strong style={{ fontSize: '14px' }}>{new Date(job.createdAt).toLocaleDateString()}</strong>
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '12px', fontWeight: 600 }}>Description</h3>
          <p style={{ fontSize: '15px', color: 'var(--text-dark)', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
            {job.description}
          </p>
        </div>

        {/* Qualifications */}
        {job.qualifications && (
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '12px', fontWeight: 600 }}>Qualifications</h3>
            <p style={{ fontSize: '15px', color: 'var(--text-dark)', lineHeight: '1.7' }}>
              {job.qualifications}
            </p>
          </div>
        )}

        {/* Required Skills */}
        {job.skillsRequired && job.skillsRequired.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '12px', fontWeight: 600 }}>Required Skills</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {job.skillsRequired.map((skill, index) => (
                <span key={index} className="badge" style={{ background: 'var(--primary-glow)', color: 'var(--primary-dark)', border: '1px solid var(--primary-main)' }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            onClick={handleApply}
            disabled={isApplied || isApplying}
            className="btn-primary"
            style={{ 
              padding: '12px 32px', 
              fontSize: '15px',
              ...(isApplied ? { opacity: 0.6, cursor: 'not-allowed', background: 'var(--text-muted)' } : {})
            }}
          >
            {isApplied ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={18} /> Applied</span>
            ) : isApplying ? (
              'Applying...'
            ) : (
              'Apply Now'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
