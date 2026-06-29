import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../api';
import { useAuth } from '../context/AuthContext';

const inputClass = "w-full px-4 py-2.5 rounded-sm border border-hairline bg-paper outline-none focus:border-saffron-dark";
const labelClass = "block text-sm font-semibold mb-1.5";

export default function Submit() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    title: '', description: '', image: '', category: 'Breakfast',
    difficulty: 'Easy', cookingTime: '', ingredients: '', instructions: ''
  });

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const payload = {
        ...form,
        ingredients: form.ingredients.split('\n').map((s) => s.trim()).filter(Boolean),
        instructions: form.instructions.split('\n').map((s) => s.trim()).filter(Boolean),
      };
      const data = await apiFetch('/recipes', { method: 'POST', body: JSON.stringify(payload) });
      setSuccess('Recipe submitted! Redirecting...');
      setTimeout(() => navigate(`/recipes/${data.recipe.id}`), 1100);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl font-semibold mb-8 text-center">Submit a Recipe</h1>

      {!user && (
        <div className="mb-6 px-4 py-3 rounded-sm bg-rust/10 border border-rust/30 text-rust text-sm">
          You'll need to <Link to="/login" className="underline font-semibold">log in</Link> before submitting.
        </div>
      )}
      {error && <div className="mb-6 px-4 py-3 rounded-sm bg-rust/10 border border-rust/30 text-rust text-sm">{error}</div>}
      {success && <div className="mb-6 px-4 py-3 rounded-sm bg-sage/10 border border-sage/30 text-sage-dark text-sm">{success}</div>}

      <form onSubmit={handleSubmit} className="bg-card border border-hairline rounded-sm p-8 space-y-5">
        <div>
          <label className={labelClass}>Recipe title</label>
          <input required value={form.title} onChange={(e) => update('title', e.target.value)} className={inputClass} placeholder="e.g. Classic Margherita Pizza" />
        </div>
        <div>
          <label className={labelClass}>Short description</label>
          <input value={form.description} onChange={(e) => update('description', e.target.value)} className={inputClass} placeholder="A one-line summary of your dish" />
        </div>
        <div>
          <label className={labelClass}>Image URL (optional)</label>
          <input value={form.image} onChange={(e) => update('image', e.target.value)} className={inputClass} placeholder="https://..." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Category</label>
            <select value={form.category} onChange={(e) => update('category', e.target.value)} className={inputClass}>
              {['Breakfast', 'Vegan', 'Desserts', 'Lunch', 'Dinner'].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Difficulty</label>
            <select value={form.difficulty} onChange={(e) => update('difficulty', e.target.value)} className={inputClass}>
              {['Easy', 'Medium', 'Hard'].map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className={labelClass}>Cooking time (minutes)</label>
          <input required type="number" min="1" value={form.cookingTime} onChange={(e) => update('cookingTime', e.target.value)} className={inputClass} placeholder="e.g. 30" />
        </div>
        <div>
          <label className={labelClass}>Ingredients</label>
          <textarea required value={form.ingredients} onChange={(e) => update('ingredients', e.target.value)} className={`${inputClass} min-h-[100px]`} placeholder="One ingredient per line" />
          <p className="text-xs text-ink-soft mt-1">Enter each ingredient on a new line.</p>
        </div>
        <div>
          <label className={labelClass}>Instructions</label>
          <textarea required value={form.instructions} onChange={(e) => update('instructions', e.target.value)} className={`${inputClass} min-h-[100px]`} placeholder="One step per line" />
          <p className="text-xs text-ink-soft mt-1">Enter each step on a new line.</p>
        </div>
        <button type="submit" className="w-full py-3 rounded-full bg-ink text-paper font-semibold hover:bg-saffron-dark transition-colors">
          Submit recipe
        </button>
      </form>
    </section>
  );
}
