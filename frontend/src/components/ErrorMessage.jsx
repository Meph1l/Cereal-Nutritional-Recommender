function ErrorMessage({ message }) {
  if (!message) {
    return null;
  }

  return (
    <div
      className="error-message"
      role="alert"
      aria-live="assertive"
    >
      <strong>Recommendations are not available yet.</strong>

      <p>{message}</p>
    </div>
  );
}

export default ErrorMessage;