import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { createJob } from '../../api/jobApi';
import { getErrorMessage } from '../../utils/errorHandler';
import JobForm from '../../components/JobForm';
import { Briefcase } from 'lucide-react';

/**
 * Create Job — recruiter posts a new opening.
 */
const CreateJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    try {
      await createJob({
        ...payload,
        recruiterId: user.id,
        recruiterEmail: user.email,
      });
      toast.success('Job created successfully.');
      navigate('/recruiter/jobs');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to publish the job.'));
      throw err;
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center gap-2 mb-4">
        <span className="cl-page-icon"><Briefcase size={20} /></span>
        <div>
          <h4 className="fw-bold mb-0">Post New Job</h4>
          <p className="text-muted small mb-0">Create a job posting to attract the right talent.</p>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4 p-md-5">
          <JobForm
            submitLabel="Publish Job"
            onSubmit={handleSubmit}
            onCancel={() => navigate('/recruiter/jobs')}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateJob;