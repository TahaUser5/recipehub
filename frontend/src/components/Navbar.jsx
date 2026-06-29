import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/', label: 'Home' },
  { to: '/recipes', label: 'Browse Recipes' },
  { to: '/submit', label: 'Submit Recipe' },
  { to: '/profile', label: 'User Profile' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-hairline">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3.5">
        <NavLink to="/" className="font-display text-2xl font-semibold text-ink flex items-center gap-1.5">
          <span className="text-saffron-dark">Recipe</span>Hub
        </NavLink>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-ink-soft">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `pb-1 border-b-2 transition-colors ${
                  isActive ? 'text-ink border-saffron-dark' : 'border-transparent hover:text-ink'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden sm:inline text-sm text-ink-soft">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="text-sm font-semibold px-4 py-2 rounded-full border border-rust text-rust hover:bg-rust hover:text-paper transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="text-sm font-semibold px-4 py-2 rounded-full border border-ink/20 text-ink-soft hover:border-ink/40 transition-colors"
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="text-sm font-semibold px-4 py-2 rounded-full bg-ink text-paper hover:bg-saffron-dark transition-colors"
              >
                Sign up
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
