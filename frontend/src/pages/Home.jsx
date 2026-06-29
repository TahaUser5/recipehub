import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../api';
import RecipeCard from '../components/RecipeCard';

const categories = [
  { name: 'Breakfast', emoji: '🥞' },
  { name: 'Vegan', emoji: '🥗' },
  { name: 'Desserts', emoji: '🍰' },
  { name: 'Lunch', emoji: '🍱' },
  { name: 'Dinner', emoji: '🍝' },
];

export default function Home() {
  const [query, setQuery] = useState('');
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    apiFetch('/recipes')
      .then((data) => setFeatured(data.slice(0, 4)))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    navigate(query.trim() ? `/recipes?search=${encodeURIComponent(query.trim())}` : '/recipes');
  }

  return (
    <>
      {/* Banner */}
      <section className="relative h-[440px] flex items-center justify-center text-center text-paper">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.stockcake.com/public/3/8/9/38955eb0-b41d-4333-bc59-fe0b34839fc7_large/colorful-mediterranean-spread-stockcake.jpg')" }}
        />
        <div className="absolute inset-0 bg-ink/55" />
        <div className="relative z-10 px-6 max-w-2xl">
          <p className="text-saffron text-sm font-semibold tracking-widest uppercase mb-3">A place for real recipes</p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold leading-tight mb-4">
            Cook something worth writing down
          </h1>
          <p className="text-paper/90 mb-7">
            Browse recipes shared by home cooks, or add the one your family keeps asking for.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/recipes" className="px-6 py-3 rounded-full bg-saffron-dark text-paper font-semibold hover:bg-saffron transition-colors">
              Browse Recipes
            </Link>
            <Link to="/submit" className="px-6 py-3 rounded-full bg-paper text-ink font-semibold hover:bg-paper-dim transition-colors">
              Submit a Recipe
            </Link>
          </div>
        </div>
      </section>

      {/* Search bar, floating over the banner edge */}
      <div className="px-6 -mt-6 relative z-10 flex justify-center">
        <form onSubmit={handleSearch} className="w-full max-w-xl flex bg-card rounded-full shadow-[0_4px_16px_rgba(34,31,28,0.15)] overflow-hidden border border-hairline">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search by title or ingredient..."
            className="flex-1 px-5 py-3.5 outline-none bg-transparent text-ink placeholder:text-ink-soft/70"
          />
          <button type="submit" className="px-6 bg-ink text-paper font-semibold hover:bg-saffron-dark transition-colors">
            Search
          </button>
        </form>
      </div>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="font-display text-2xl font-semibold mb-7 text-center">Featured categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((c) => (
            <Link
              key={c.name}
              to={`/recipes?category=${c.name}`}
              className="bg-card border border-hairline rounded-sm p-7 text-center hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(34,31,28,0.1)] transition-all"
            >
              <span className="text-3xl block mb-2">{c.emoji}</span>
              <span className="font-display font-semibold">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured recipes */}
      <section className="max-w-6xl mx-auto px-6 py-4 pb-20">
        <h2 className="font-display text-2xl font-semibold mb-7 text-center">Popular right now</h2>
        {loading ? (
          <p className="text-center text-ink-soft">Loading recipes...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((r) => <RecipeCard key={r.id} recipe={r} />)}
          </div>
        )}
      </section>
    </>
  );
}
