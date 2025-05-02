
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface Breadcrumb {
  text: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  className?: string;
  imageBackground?: boolean;
  backgroundImage?: string;
}

const PageHeader = ({
  title,
  description,
  breadcrumbs,
  className,
  imageBackground = false,
  backgroundImage = "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
}: PageHeaderProps) => {
  return (
    <div 
      className={cn(
        "relative py-12 md:py-16 lg:py-24",
        imageBackground ? "bg-cover bg-center text-white" : "bg-idvl-blue-dark text-white",
        className
      )}
      style={imageBackground ? { backgroundImage: `url(${backgroundImage})` } : {}}
    >
      {/* Overlay for image background */}
      {imageBackground && (
        <div className="absolute inset-0 bg-idvl-blue-dark opacity-75" />
      )}
      
      <div className="container-custom relative z-10">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mb-6" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center text-sm">
              <li className="flex items-center">
                <Link to="/" className="text-white/80 hover:text-white transition-colors">
                  Home
                </Link>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 mx-2 text-white/60"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </li>
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="flex items-center">
                  {index < breadcrumbs.length - 1 ? (
                    <>
                      <Link to={crumb.href || '#'} className="text-white/80 hover:text-white transition-colors">
                        {crumb.text}
                      </Link>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4 mx-2 text-white/60"
                      >
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </>
                  ) : (
                    <span className="text-white" aria-current="page">
                      {crumb.text}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Page Title and Description */}
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{title}</h1>
          {description && <p className="text-lg md:text-xl text-white/90">{description}</p>}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
