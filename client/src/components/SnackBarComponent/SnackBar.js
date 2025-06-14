import { useEffect, useRef } from "react";

const SnackBar = ({ message }) => {
  const snackbarRef = useRef(null);
  const animationTimeoutRef = useRef(null);

  useEffect(() => {
    const snackbar = snackbarRef.current;

    if (!snackbar || !message) return;

    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    snackbar.classList.remove("animate-fade-out");
    snackbar.classList.add("animate-fade-in");

    animationTimeoutRef.current = setTimeout(() => {
      snackbar.classList.remove("animate-fade-in");
      snackbar.classList.add("animate-fade-out");

      animationTimeoutRef.current = setTimeout(() => {
        snackbar.classList.remove("animate-fade-out");
      }, 1000);
    }, 2000);

    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [message]);

  if (!message) return null;

  return (
    <div
      ref={snackbarRef}
      className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-8 py-4 rounded-lg shadow-lg text-lg font-medium max-w-md text-center z-50 animate-fade-in"
    >
      {message}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px) translateX(-50%);
          }
          to {
            opacity: 1;
            transform: translateY(0) translateX(-50%);
          }
        }
        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: translateY(0) translateX(-50%);
          }
          to {
            opacity: 0;
            transform: translateY(-20px) translateX(-50%);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-fade-out {
          animation: fadeOut 0.5s ease-in forwards;
        }
      `}</style>
    </div>
  );
};

export default SnackBar;
