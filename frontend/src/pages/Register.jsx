import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const data = await apiFetch('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });
      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="max-w-md mx-auto px-6 py-16">
      <h1 className="font-display text-3xl font-semibold mb-8 text-center">Create an account</h1>
      {error && <div className="mb-6 px-4 py-3 rounded-sm bg-rust/10 border border-rust/30 text-rust text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-card border border-hairline rounded-sm p-8 space-y-5">
        <div>
          <label className="block text-sm font-semibold mb-1.5">Name</label>
          <input required value={name} onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-sm border border-hairline bg-paper outline-none focus:border-saffron-dark" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">Email</label>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-sm border border-hairline bg-paper outline-none focus:border-saffron-dark" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">Password</label>
          <input required type="password" minLength={4} value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-sm border border-hairline bg-paper outline-none focus:border-saffron-dark" />
        </div>
        <button type="submit" className="w-full py-3 rounded-full bg-ink text-paper font-semibold hover:bg-saffron-dark transition-colors">
          Sign up
        </button>
      </form>
      <p className="text-center text-sm text-ink-soft mt-5">
        Already have an account? <Link to="/login" className="text-saffron-dark font-semibold">Login</Link>
      </p>
    </section>
  );
}
