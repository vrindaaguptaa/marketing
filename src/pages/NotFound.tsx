import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Footer } from "@/components/footer";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="w-full min-h-screen flex flex-col bg-white dark:bg-slate-950">
      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-md">
          <div className="text-7xl font-bold text-primary mb-4">404</div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Page Not Found
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">
            Sorry, the page you're looking for doesn't exist. Let's get you back on track.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </a>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default NotFound;
