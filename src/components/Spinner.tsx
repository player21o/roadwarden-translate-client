const Spinner = () => {
  return (
    <div className="spinner-loader">
      <svg viewBox="0 0 32 32" width="42" height="42" className="m-auto">
        <circle className="spinner" cx="16" cy="16" r="14" fill="none"></circle>
      </svg>
    </div>
  );
};

export default Spinner;
