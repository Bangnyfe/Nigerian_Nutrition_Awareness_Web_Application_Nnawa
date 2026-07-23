function LoadingSpinner({ message = 'Loading…' }) {
  return (
    <p role="status">
      <span className="loading-spinner" aria-hidden="true" />
      {message}
    </p>
  );
}

export default LoadingSpinner;
