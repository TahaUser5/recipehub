import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <section className="max-w-md mx-auto px-6 py-16 text-center">
      <h1 className="font-display text-3xl font-semibold mb-8">User Profile</h1>
      {!user ? (
        <div className="bg-card border border-hairline rounded-sm p-8">
          <p className="mb-5 text-ink-soft">You're not logged in.</p>
          <Link to="/login" className="px-6 py-3 rounded-full bg-ink text-paper font-semibold hover:bg-saffron-dark transition-colors inline-block">
            Login
          </Link>
        </div>
      ) : (
        <div className="bg-card border border-hairline rounded-sm p-8">
          <div className="w-16 h-16 rounded-full bg-saffron-dark text-paper font-display text-2xl font-semibold flex items-center justify-center mx-auto mb-4">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="font-display text-xl font-semibold">{user.name}</h2>
          <p className="text-ink-soft mb-6">{user.email}</p>
          <button onClick={logout} className="px-6 py-3 rounded-full bg-rust text-paper font-semibold hover:bg-rust/90 transition-colors">
            Logout
          </button>
        </div>
      )}
    </section>
  );
}
