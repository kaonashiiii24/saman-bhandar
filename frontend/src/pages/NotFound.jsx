import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function NotFound() {
  const navigate = useNavigate();
  const [count, setCount] = useState(10);

  useEffect(() => {
    const t = setInterval(() => {
      setCount((c) => {
        if (c <= 1) { clearInterval(t); navigate("/"); }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-chalk flex flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md w-full">
        <p className="text-8xl font-bold text-brick leading-none select-none">404</p>
        <h1 className="mt-4 text-2xl font-semibold text-ink font-display">Page not found</h1>
        <p className="mt-3 text-muted leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <p className="mt-1 text-sm text-muted">
          Redirecting to home in <span className="font-medium text-brick">{count}s</span>
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-brick text-white rounded-lg font-medium hover:bg-brick-dark transition-colors"
          >
            Go home
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 border border-border text-ink rounded-lg font-medium hover:bg-chalk-dark transition-colors"
          >
            Go back
          </button>
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-4 text-sm text-muted">
          <Link to="/browse" className="hover:text-brick transition-colors">Browse listings</Link>
          <Link to="/services" className="hover:text-brick transition-colors">Services</Link>
          <Link to="/contact" className="hover:text-brick transition-colors">Contact</Link>
          <Link to="/login" className="hover:text-brick transition-colors">Login</Link>
        </div>
      </div>
    </div>
  );
}