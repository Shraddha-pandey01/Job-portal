import { useState, useEffect } from 'react';
import { Camera, Phone, MapPin, Building, CheckCircle, Code, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosClient';

function calcProfileCompletion(user, role, formData) {
  if (!user) return { percent: 0, missing: [] };

  const checks = [];

  if (role === 'jobseeker') {
    checks.push({ label: 'Name', done: !!(user.name || user.fullName) });
    checks.push({ label: 'Phone', done: !!(user.phone || formData.phone) });
    checks.push({ label: 'Location', done: !!(user.location || formData.location) });
    checks.push({ label: 'Skills', done: !!(user.skills?.length > 0 || formData.skills?.trim()) });
    checks.push({ label: 'Resume', done: !!user.resume?.url });
  } else {
    checks.push({ label: 'Name', done: !!(user.name || user.fullName) });
    checks.push({ label: 'Phone', done: !!(user.phone || formData.phone) });
    checks.push({ label: 'Company Name', done: !!(user.companyName || formData.companyName) });
  }

  const done = checks.filter(c => c.done).length;
  const percent = Math.round((done / checks.length) * 100);
  const missing = checks.filter(c => !c.done).map(c => c.label);

  return { percent, missing };
}

export default function Profile() {
  const { role, user, updateUserProfile, fetchProfile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [saveComplete, setSaveComplete] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    phone: '',
    location: '',
    skills: '',
    companyName: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        phone: user.phone || '',
        location: user.location || '',
        skills: Array.isArray(user.skills) ? user.skills.join(', ') : '',
        companyName: user.companyName || '',
      });
    }
  }, [user]);

  const { percent, missing } = calcProfileCompletion(user, role, formData);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMsg('');
    try {
      let payload = {};
      if (role === 'jobseeker') {
        payload = {
          phone: formData.phone,
          location: formData.location,
          skills: formData.skills
            ? formData.skills.split(',').map(s => s.trim()).filter(Boolean)
            : [],
        };
      } else if (role === 'employer') {
        payload = {
          phone: formData.phone,
          companyName: formData.companyName,
        };
      }
      await updateUserProfile(payload);
      await fetchProfile();
      setSaveComplete(true);
      setTimeout(() => setSaveComplete(false), 3000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile.');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append('resume', file);
    try {
      await api.post('/jobseeker/resume', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await fetchProfile();
      alert('Resume uploaded successfully.');
    } catch (err) {
      console.error('Resume upload failed', err);
      alert('Resume upload failed.');
    }
  };

  if (!user) return <div style={{ padding: '24px' }}>Loading profile...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Profile Settings</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your personal information and preferences.</p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          background: 'var(--glass-bg)', padding: '8px 16px',
          borderRadius: '30px', border: '1px solid var(--glass-border)'
        }}>
          <span style={{ fontSize: '14px', fontWeight: 500 }}>Active Role:</span>
          <span className={`badge ${role === 'jobseeker' ? 'badge-info' : 'badge-warning'}`}>
            {role === 'jobseeker' ? 'Job Seeker' : 'Employer'}
          </span>
        </div>
      </div>

      {errorMsg && (
        <div style={{ padding: '12px', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', marginBottom: '24px' }}>
          {errorMsg}
        </div>
      )}

      {/* Profile Completion Card */}
      <div className="glass-panel animate-slide-up" style={{
        padding: '24px', marginBottom: '24px',
        background: 'linear-gradient(135deg, var(--primary-main), var(--primary-dark))',
        color: 'white'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: 'white' }}>Profile Completion</h3>
          <span style={{ fontSize: '28px', fontWeight: 700, color: 'white' }}>{percent}%</span>
        </div>

        <div style={{
          position: 'relative', height: '10px',
          background: 'rgba(255,255,255,0.2)', borderRadius: '6px', marginBottom: '14px'
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0,
            height: '100%', width: `${percent}%`,
            background: 'white', borderRadius: '6px',
            boxShadow: '0 0 10px rgba(255,255,255,0.5)',
            transition: 'width 0.5s ease',
          }} />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {(role === 'jobseeker'
            ? ['Name', 'Phone', 'Location', 'Skills', 'Resume']
            : ['Name', 'Phone', 'Company Name']
          ).map(label => {
            const isDone = !missing.includes(label);
            return (
              <span key={label} style={{
                fontSize: '12px', padding: '4px 10px', borderRadius: '20px',
                background: isDone ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)',
                color: isDone ? 'white' : 'rgba(255,255,255,0.5)',
                border: `1px solid ${isDone ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)'}`,
                display: 'flex', alignItems: 'center', gap: '4px'
              }}>
                {isDone ? '✅' : '○'} {label}
              </span>
            );
          })}
        </div>

        <p style={{ margin: '14px 0 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>
          {percent === 100
            ? '🎉 Your profile is 100% complete! Employers can fully see your profile.'
            : `Missing: ${missing.join(', ')}`}
        </p>
      </div>

      {/* Main Form */}
      <div className="glass-panel animate-slide-up" style={{ padding: '32px', marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>General Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

          <div className="form-group">
            <label className="form-label">Phone</label>
            <div style={{ position: 'relative' }}>
              <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="tel" name="phone" className="input-glass"
                value={formData.phone} onChange={handleChange}
                style={{ paddingLeft: '40px' }} placeholder="+1 234 567 890"
              />
            </div>
          </div>

          {role === 'jobseeker' && (
            <>
              <div className="form-group">
                <label className="form-label">Location</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text" name="location" className="input-glass"
                    value={formData.location} onChange={handleChange}
                    style={{ paddingLeft: '40px' }} placeholder="New York, NY"
                  />
                </div>
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Skills (comma-separated)</label>
                <div style={{ position: 'relative' }}>
                  <Code size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text" name="skills" className="input-glass"
                    value={formData.skills} onChange={handleChange}
                    style={{ paddingLeft: '40px' }} placeholder="React, Node.js, Design"
                  />
                </div>
                {formData.skills && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                    {formData.skills.split(',').map(s => s.trim()).filter(Boolean).map((skill, i) => (
                      <span key={i} className="badge" style={{
                        background: 'var(--primary-glow)',
                        color: 'var(--primary-dark)',
                        border: '1px solid var(--primary-main)'
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {role === 'employer' && (
            <div className="form-group">
              <label className="form-label">Company Name</label>
              <div style={{ position: 'relative' }}>
                <Building size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text" name="companyName" className="input-glass"
                  value={formData.companyName} onChange={handleChange}
                  style={{ paddingLeft: '40px' }} placeholder="TechCorp"
                />
              </div>
            </div>
          )}
        </div>

        {/* Resume Section */}
        {role === 'jobseeker' && (
          <>
            <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '32px 0' }} />
            <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>Resume</h3>

            {user?.resume?.url ? (
              <div style={{
                marginBottom: '24px', padding: '24px',
                background: 'rgba(59,130,246,0.05)', borderRadius: '12px',
                border: '1px dashed var(--primary-main)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                  }}>
                    <FileText size={24} color="var(--primary-main)" />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: 'var(--text-dark)' }}>
                      {user.resume.url.split(/[/\\]/).pop()}
                    </h4>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                      Successfully uploaded resume. Visible to employers.
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <a
                    href={`http://localhost:3000/${user.resume.url.replace(/\\/g, '/')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary"
                    style={{ textDecoration: 'none', padding: '8px 16px', fontSize: '13px' }}
                  >
                    View Resume
                  </a>
                  <button
                    className="btn-primary"
                    onClick={() => document.getElementById('resume-upload').click()}
                    style={{ padding: '8px 16px', fontSize: '13px' }}
                  >
                    Replace Resume
                  </button>
                  <input
                    id="resume-upload"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                    accept=".pdf,.docx"
                  />
                </div>
              </div>
            ) : (
              <label htmlFor="resume-upload" style={{
                display: 'block', border: '2px dashed var(--primary-main)',
                background: 'var(--primary-glow)', borderRadius: '12px',
                padding: '40px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s'
              }}>
                <div style={{
                  background: 'white', width: '48px', height: '48px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}>
                  <Camera size={20} color="var(--primary-main)" />
                </div>
                <h4 style={{ margin: '0 0 8px 0', color: 'var(--primary-dark)' }}>
                  Upload Resume
                </h4>
                <p style={{ color: 'var(--text-dark)', fontSize: '13px', margin: 0 }}>
                  Click to browse files (PDF, DOCX)
                </p>
                <input
                  id="resume-upload"
                  type="file"
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                  accept=".pdf,.docx"
                />
              </label>
            )}
          </>
        )}

        {/* Save Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px' }}>
          <div>
            {saveComplete && (
              <div className="animate-fade-in" style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                color: '#166534', background: '#dcfce7',
                padding: '8px 16px', borderRadius: '8px',
                fontSize: '14px', fontWeight: 500
              }}>
                <CheckCircle size={16} /> Changes saved successfully!
              </div>
            )}
          </div>
          <button className="btn-primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}