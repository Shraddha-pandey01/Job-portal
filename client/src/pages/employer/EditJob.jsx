import { useState, useEffect } from 'react';
import { Briefcase, MapPin, DollarSign, ListChecks } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axiosClient';

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    jobType: '',
    salary: '',
    description: ''
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        const jobData = res.data.payload;
        
        setFormData({
          title: jobData.title || '',
          location: jobData.location || '',
          jobType: jobData.jobType || '',
          salary: jobData.salary || '',
          description: jobData.description || ''
        });
      } catch (e) {
        console.error(e);
        alert("Failed to load job details.");
        navigate('/employer/manage-jobs');
      } finally {
        setIsLoading(false);
      }
    };
    fetchJob();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        location: formData.location,
        jobType: formData.jobType,
        salary: formData.salary ? Number(formData.salary) : null,
        description: formData.description
      };
      await api.put(`/jobs/${id}`, payload);
      alert('Job updated successfully!');
      navigate('/employer/manage-jobs');
    } catch (e) {
      console.error(e);
      alert('Failed to update job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div style={{ padding: '24px' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Edit Job</h1>
        <p style={{ color: 'var(--text-muted)' }}>Update the details below to push corrections to your live job listing.</p>
      </div>

      <div className="glass-panel animate-slide-up" style={{ padding: '32px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Briefcase size={16} color="var(--primary-main)" /> Job Title
            </label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="input-glass" placeholder="e.g. Senior Frontend Developer" required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} color="var(--primary-main)" /> Location
              </label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} className="input-glass" placeholder="e.g. Remote, or New York, NY" required />
            </div>
            
            <div className="form-group">
              <label className="form-label">Job Type</label>
              <select name="jobType" value={formData.jobType} onChange={handleChange} className="input-glass" required style={{ appearance: 'none' }}>
                <option value="">Select type...</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="internship">Internship</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <DollarSign size={16} color="var(--primary-main)" /> Salary (Per Year)
            </label>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <input type="number" name="salary" value={formData.salary} onChange={handleChange} className="input-glass" placeholder="e.g. 100000" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ListChecks size={16} color="var(--primary-main)" /> Job Description
            </label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input-glass" 
              rows="6" 
              placeholder="Describe the responsibilities, requirements, and benefits..."
              style={{ resize: 'vertical' }}
              required
            ></textarea>
          </div>

          <hr style={{ borderTop: '1px solid var(--glass-border)', borderBottom: 'none', margin: '8px 0' }} />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
