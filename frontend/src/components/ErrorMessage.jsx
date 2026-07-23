function ErrorMessage({ message }) {
  return (
    <p className="status-message status-message--error" role="alert">
      {message}
    </p>
  );
}

export default ErrorMessage;
