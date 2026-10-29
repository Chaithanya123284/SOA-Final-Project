import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { getJobById, updateJob } from '../../api/jobApi';
import { getErrorMessage } from '../../utils/errorHandler';
import JobForm from '../../components/JobForm';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Pencil } from 'lucide-react';

/**
 * Edit Job — loads an existing posting into the shared JobForm and updates it.
 */
const EditJob = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await getJobById(id);
        if (!mounted) return;
        // Only the owner recruiter may edit
        if (data.recruiterId && data.recruiterId !== user.id) {
          setError('You do not have permission to edit this job posting.');
          return;
        }
        setJob(data);
      } catch (err) {
        if (mounted) setError(getErrorMessage(err, 'Job not found.'));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [id, user.id]);

  const handleSubmit = async (payload) => {
    try {
      await updateJob(id, {
        ...payload,
        recruiterId: user.id,
        recruiterEmail: user.email,
      });
      toast.success('Job updated successfully.');
      navigate('/recruiter/jobs');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to update the job.'));
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="container py-4">
        <LoadingSpinner label="Loading job details..." />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">{error || 'Job not found.'}</div>
        <button className="btn btn-outline-primary" onClick={() => navigate('/recruiter/jobs')}>
          Back to My Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center gap-2 mb-4">
        <span className="cl-page-icon"><Pencil size={20} /></span>
        <div>
          <h4 className="fw-bold mb-0">Edit Job</h4>
          <p className="text-muted small mb-0">Update the details of "{job.title}".</p>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4 p-md-5">
          <JobForm
            initialValues={job}
            submitLabel="Update Job"
            onSubmit={handleSubmit}
            onCancel={() => navigate('/recruiter/jobs')}
          />
        </div>
      </div>
    </div>
  );
};

export default EditJob;