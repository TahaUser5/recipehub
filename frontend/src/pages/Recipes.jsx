import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiFetch } from '../api';
import RecipeCard from '../components/RecipeCard';

const categoryOptions = ['All', 'Breakfast', 'Vegan', 'Desserts', 'Lunch', 'Dinner'];
const timeOptions = [
  { label: 'Any time', value: '' },
  { label: 'Under 15 min', value: '15' },
  { label: 'Under 30 min', value: '30' },
  { label: 'Under 60 min', value: '60' },
];

export default function Recipes() {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get('search') || '');
  const [category, setCategory] = useState(params.get('category') || 'All');
  const [time, setTime] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function load() {
    setLoading(true);
    setError('');
    const query = new URLSearchParams();
    if (category !== 'All') query.set('category', category);
    if (time) query.set('maxTime', time);
    if (search.trim()) query.set('search', search.trim());

    apiFetch(`/recipes?${query.toString()}`)
      .then(setRecipes)
      .catch(() => setError('Could not load recipes. Is the backend running?'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function applyFilters(e) {
    e.preventDefault();
    load();
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl font-semibold mb-8 text-center">Browse Recipes</h1>

      <form onSubmit={applyFilters} className="flex flex-wrap gap-3 mb-10 items-center justify-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Search by title or ingredient..."
          className="px-4 py-2.5 rounded-sm border border-hairline bg-card outline-none focus:border-saffron-dark min-w-[220px]"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2.5 rounded-sm border border-hairline bg-card outline-none"
        >
          {categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="px-4 py-2.5 rounded-sm border border-hairline bg-card outline-none"
        >
          {timeOptions.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <button type="submit" className="px-5 py-2.5 rounded-full bg-ink text-paper font-semibold hover:bg-saffron-dark transition-colors">
          Apply filters
        </button>
      </form>

      {loading && <p className="text-center text-ink-soft">Loading recipes...</p>}
      {error && <p className="text-center text-rust">{error}</p>}
      {!loading && !error && recipes.length === 0 && (
        <p className="text-center text-ink-soft">No recipes match your filters yet — try widening the search.</p>
      )}

      {!loading && !error && recipes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((r) => <RecipeCard key={r.id} recipe={r} />)}
        </div>
      )}
    </section>
  );
}
