import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Catalog', to: '/catalog' },
  { label: 'Contact', to: '/contact' },
];

export default function SiteLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-brand-light/60 flex flex-col">
      <header className="bg-white border-b border-slate-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue text-white font-semibold">
              K3
            </div>
            <div>
              <p className="text-lg font-semibold text-brand-navy">K3D Prints</p>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Dream it. Print it.
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-600 md:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `transition-colors hover:text-brand-blue ${isActive ? 'text-brand-blue' : ''}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {user && user.role !== 'guest' && (
              <>
                <NavLink
                  to="/orders"
                  className={({ isActive }) =>
                    `transition-colors hover:text-brand-blue ${isActive ? 'text-brand-blue' : ''}`
                  }
                >
                  Orders
                </NavLink>
                {user.role === 'admin' && (
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      `transition-colors hover:text-brand-blue ${isActive ? 'text-brand-blue' : ''}`
                    }
                  >
                    Producer
                  </NavLink>
                )}
              </>
            )}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <>
                <span className="text-sm text-slate-500">
                  Hi, <span className="font-semibold text-brand-navy">{user.name}</span>
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-brand-navy hover:border-brand-blue hover:text-brand-blue"
                >
                  Log out
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/account')}
                className="rounded-full bg-brand-blue px-5 py-2 text-sm font-semibold text-white shadow-md shadow-brand-blue/30 hover:bg-brand-navy"
              >
                Sign in
              </button>
            )}
          </div>

          <button
            type="button"
            className="md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            <span className="sr-only">Toggle navigation</span>
            <svg
              className="h-6 w-6 text-brand-navy"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.7}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-600">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `transition-colors hover:text-brand-blue ${isActive ? 'text-brand-blue' : ''}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              {user && user.role !== 'guest' && (
                <>
                  <NavLink
                    to="/orders"
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `transition-colors hover:text-brand-blue ${isActive ? 'text-brand-blue' : ''}`
                    }
                  >
                    Orders
                  </NavLink>
                  {user.role === 'admin' && (
                    <NavLink
                      to="/admin"
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `transition-colors hover:text-brand-blue ${isActive ? 'text-brand-blue' : ''}`
                      }
                    >
                      Producer
                    </NavLink>
                  )}
                </>
              )}
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  user ? handleLogout() : navigate('/account');
                }}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-brand-navy"
              >
                {user ? 'Log out' : 'Sign in'}
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-brand-black text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>&copy; {new Date().getFullYear()} K3D Prints. Crafted in California.</p>
          <div className="flex gap-4 text-white/80">
            <a href="mailto:hello@k3dprints.com" className="hover:text-white">
              hello@k3dprints.com
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="hover:text-white">
              Instagram
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

