import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchJobs } from '../../api/jobApi';
import { getErrorMessage } from '../../utils/errorHandler';
import { EMPLOYMENT_TYPES } from '../../utils/constants';
import { employmentTypeLabel } from '../../utils/formatters';
import JobCard from '../../components/JobCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { Search, MapPin, SlidersHorizontal, X } from 'lucide-react';

const PAGE_SIZE = 9;

/**
 * Job marketplace — search, filter, browse with Load More pagination.
 */
const BrowseJobs = () => {
  const [searchParams] = useSearchParams();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [employmentType, setEmploymentType] = useState('');
  const [skill, setSkill] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const loadJobs = useCallback(async (filters) => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filters.query?.trim()) params.query = filters.query.trim();
      if (filters.location?.trim()) params.location = filters.location.trim();
      if (filters.employmentType) params.employmentType = filters.employmentType;
      if (filters.skill?.trim()) params.skill = filters.skill.trim();
      const data = await searchJobs(params);
      setJobs(data || []);
      setVisibleCount(PAGE_SIZE);
    } catch (err) {
      setError(getErrorMessage(err));
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load from URL params (landing page search)
  useEffect(() => {
    loadJobs({
      query: searchParams.get('query') || '',
      location: searchParams.get('location') || '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadJobs({ query, location, employmentType, skill });
  };

  const handleReset = () => {
    setQuery('');
    setLocation('');
    setEmploymentType('');
    setSkill('');
    loadJobs({});
  };

  const visibleJobs = useMemo(() => jobs.slice(0, visibleCount), [jobs, visibleCount]);

  const locations = useMemo(
    () => [...new Set(jobs.map((j) => j.location).filter(Boolean))].slice(0, 12),
    [jobs]
  );

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h4 className="fw-bold mb-1">Find your next opportunity</h4>
        <p className="text-muted small mb-0">
          Search and filter through {jobs.length} open position{jobs.length === 1 ? '' : 's'}.
        </p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="cl-search-box p-2 mb-3">
        <div className="row g-2">
          <div className="col-md-5">
            <div className="input-group">
              <span className="input-group-text bg-transparent border-0">
                <Search size={16} className="text-muted" />
              </span>
              <input
                className="form-control border-0 shadow-none"
                placeholder="Search jobs, skills, companies..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="input-group">
              <span className="input-group-text bg-transparent border-0">
                <MapPin size={16} className="text-muted" />
              </span>
              <input
                className="form-control border-0 shadow-none"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                list="cl-locations"
              />
              <datalist id="cl-locations">
                {locations.map((loc) => (
                  <option key={loc} value={loc} />
                ))}
              </datalist>
            </div>
          </div>
          <div className="col-md-3 d-flex gap-2">
            <button type="submit" className="btn btn-primary flex-fill">
              Search
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary d-md-none"
              onClick={() => setFiltersOpen((v) => !v)}
              aria-label="Toggle filters"
            >
              <SlidersHorizontal size={16} />
            </button>
          </div>
        </div>
      </form>

      {/* Filters */}
      <div className={`row g-3 mb-4 ${filtersOpen ? '' : 'd-none d-md-flex'}`}>
        <div className="col-md-4">
          <label className="form-label small fw-semibold text-muted">Employment Type</label>
          <select
            className="form-select form-select-sm"
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value)}
          >
            <option value="">All Types</option>
            {EMPLOYMENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {employmentTypeLabel(type)}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label small fw-semibold text-muted">Skill</label>
          <input
            className="form-control form-control-sm"
            placeholder="e.g. Java, React, SQL"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
          />
        </div>
        <div className="col-md-4 d-flex align-items-end">
          <button type="button" className="btn btn-sm btn-outline-secondary w-100" onClick={handleReset}>
            <X size={14} className="me-1" />
            Clear Filters
          </button>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <LoadingSpinner label="Loading jobs..." />
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : visibleJobs.length === 0 ? (
        <EmptyState
          title="No jobs found"
          message="Try adjusting your search or clearing the filters."
          action={
            <button className="btn btn-outline-primary btn-sm" onClick={handleReset}>
              Clear Filters
            </button>
          }
        />
      ) : (
        <>
          <div className="row g-3">
            {visibleJobs.map((job) => (
              <div className="col-md-6 col-xl-4" key={job.id}>
                <JobCard job={job} />
              </div>
            ))}
          </div>

          {visibleCount < jobs.length && (
            <div className="text-center mt-4">
              <button
                className="btn btn-outline-primary px-4"
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              >
                Load More ({jobs.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BrowseJobs;