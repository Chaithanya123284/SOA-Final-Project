/**
 * Reusable API error handler.
 * Maps backend HTTP errors / network failures to user-friendly messages.
 * Never surfaces raw Java stack traces.
 */

const DEFAULT_MESSAGE =
  'Unable to connect to CareerLink services. Please make sure the backend is running.';

const STATUS_MESSAGES = {
  400: 'The request could not be processed. Please check the information you entered and try again.',
  401: 'Your session has expired or your credentials are invalid. Please sign in again.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested resource was not found. It may have been removed.',
  409: 'This action conflicts with existing data. It may already exist.',
  422: 'The information you provided could not be processed. Please review and try again.',
  500: 'Something went wrong on our servers. Please try again in a moment.',
  502: 'The service is temporarily unavailable. Please try again shortly.',
  503: 'CareerLink services are temporarily unavailable. Please try again shortly.',
};

/**
 * Extract a human-friendly error message from an Axios error.
 * @param {*} error - Axios error object
 * @param {string} fallback - Optional fallback message
 * @returns {string}
 */
export const getErrorMessage = (error, fallback = DEFAULT_MESSAGE) => {
  if (!error) return fallback;

  // Network-level failure (backend down, CORS, DNS, timeout)
  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      return 'The request timed out. Please check your connection and try again.';
    }
    return DEFAULT_MESSAGE;
  }

  const status = error.response.status;
  const data = error.response.data;

  // Prefer a backend-provided message (e.g. { error: "..." } or { message: "..." })
  if (data) {
    const backendMessage = data.message || data.error;
    if (typeof backendMessage === 'string' && backendMessage.trim()) {
      // Sanitize: strip anything that looks like a stack trace / class name
      if (!backendMessage.includes('\n') && !backendMessage.includes(' at com.')) {
        return backendMessage;
      }
    }
  }

  return STATUS_MESSAGES[status] || fallback;
};

/**
 * Extract a validation error summary from a 400 response body.
 * Spring returns { error: "..." } for most cases; this handles both.
 */
export const getValidationErrors = (error) => {
  const data = error?.response?.data;
  if (!data) return {};
  if (data.fieldErrors && typeof data.fieldErrors === 'object') {
    return data.fieldErrors;
  }
  return {};
};

export default getErrorMessage;