const SectionWrapper = ({ id, className = '', children }) => {
  return (
    <section
      id={id}
      className={`min-h-screen font-sans flex flex-col items-center justify-start px-4 sm:px-8 pt-32 pb-32 ${className}`}
      style={{ fontFamily: "'Work Sans', sans-serif" }}
    >
      {children}
    </section>
  );
};

export default SectionWrapper;
