import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../api';
import { useAuth } from '../context/AuthContext';

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch(`/recipes/${id}`)
      .then(setRecipe)
      .catch(() => setError('This recipe could not be found.'));
  }, [id]);

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this recipe?')) return;
    try {
      await apiFetch(`/recipes/${id}`, { method: 'DELETE' });
      navigate('/recipes');
    } catch (err) {
      alert(err.message || 'Failed to delete recipe');
    }
  }

  if (error) return <p className="text-center py-20 text-ink-soft">{error}</p>;
  if (!recipe) return <p className="text-center py-20 text-ink-soft">Loading recipe...</p>;

  const totalIngredients = recipe.ingredients.length;
  const totalSteps = recipe.instructions.length;

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] items-stretch mb-12">
        <div className="relative overflow-hidden rounded-[28px] border border-hairline bg-card shadow-[0_18px_40px_rgba(34,31,28,0.12)]">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="h-full min-h-[320px] w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/5 to-transparent" />
          <div className="absolute left-5 right-5 bottom-5 flex items-center justify-between gap-4 text-paper">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-paper/80 mb-1">Recipe spotlight</p>
              <h1 className="font-display text-3xl sm:text-4xl font-semibold leading-tight">{recipe.title}</h1>
            </div>
            <div className="hidden sm:flex items-center gap-2 rounded-full bg-paper/15 px-4 py-2 backdrop-blur-sm border border-paper/20">
              <span className="text-sm font-semibold">★ {recipe.rating}</span>
              <span className="text-xs uppercase tracking-[0.2em] text-paper/75">Rating</span>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-hairline bg-card p-7 sm:p-8 shadow-[0_18px_40px_rgba(34,31,28,0.08)] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-3">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-saffron-dark">{recipe.category}</p>
              {user && (
                <button
                  onClick={handleDelete}
                  className="text-xs font-semibold px-3 py-1 rounded-full bg-rust/10 text-rust border border-rust/20 hover:bg-rust hover:text-paper transition-colors"
                >
                  Delete Recipe
                </button>
              )}
            </div>
            <p className="text-ink-soft mb-6 leading-relaxed text-base">{recipe.description}</p>
            <div className="flex gap-2 flex-wrap mb-6">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-sage/15 text-sage-dark border border-sage/30">{recipe.difficulty}</span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-paper-dim text-ink-soft border border-hairline">{recipe.cookingTime} min</span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-rust/10 text-rust border border-rust/20">{totalIngredients} ingredients</span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-saffron/15 text-saffron-dark border border-saffron/25">{totalSteps} steps</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-hairline bg-paper/60 p-4 text-center">
              <div className="font-display text-2xl font-semibold">{totalIngredients}</div>
              <div className="text-xs uppercase tracking-[0.16em] text-ink-soft mt-1">Ingredients</div>
            </div>
            <div className="rounded-2xl border border-hairline bg-paper/60 p-4 text-center">
              <div className="font-display text-2xl font-semibold">{totalSteps}</div>
              <div className="text-xs uppercase tracking-[0.16em] text-ink-soft mt-1">Steps</div>
            </div>
            <div className="rounded-2xl border border-hairline bg-paper/60 p-4 text-center">
              <div className="font-display text-2xl font-semibold">{recipe.rating}</div>
              <div className="text-xs uppercase tracking-[0.16em] text-ink-soft mt-1">Rating</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8">
        <div className="rounded-[28px] border border-hairline bg-card p-7 sm:p-8 shadow-[0_12px_30px_rgba(34,31,28,0.06)]">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-saffron-dark mb-2">Ingredients</p>
              <h2 className="font-display text-2xl font-semibold">What you need</h2>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-paper-dim text-ink-soft border border-hairline whitespace-nowrap">{totalIngredients} items</span>
          </div>
          <ul className="space-y-3">
            {recipe.ingredients.map((ing, i) => (
              <li key={i} className="flex items-start gap-3 rounded-2xl border border-hairline bg-paper/60 px-4 py-3 text-sm">
                <span className="mt-2 flex-shrink-0 w-3 h-3 rounded-full bg-saffron-dark shadow-[0_0_0_4px_rgba(216,154,26,0.16)]" />
                <span className="leading-relaxed">{ing}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[28px] border border-hairline bg-card p-7 sm:p-8 shadow-[0_12px_30px_rgba(34,31,28,0.06)]">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-saffron-dark mb-2">Instructions</p>
              <h2 className="font-display text-2xl font-semibold">How to make it</h2>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-paper-dim text-ink-soft border border-hairline whitespace-nowrap">Step by step</span>
          </div>
          <ul className="space-y-3">
            {recipe.instructions.map((step, i) => (
              <li key={i} className="flex items-start gap-3 rounded-2xl border border-hairline bg-paper/60 px-4 py-3 text-sm">
                <span className="mt-2 flex-shrink-0 w-3 h-3 rounded-full bg-saffron-dark shadow-[0_0_0_4px_rgba(216,154,26,0.16)]" />
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
