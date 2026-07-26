function LoadingMessage() {
  return (
    <div
      className="status-container"
      role="status"
      aria-live="polite"
    >
      <div className="loading-spinner"></div>

      <p>
        Finding cereals that match your nutritional goals...
      </p>
    </div>
  );
}

export default LoadingMessage;