import { Link } from 'react-router-dom';

export default function RecipeCard({ recipe }) {
  return (
    <Link
      to={`/recipes/${recipe.id}`}
      className="group block bg-card border border-hairline rounded-sm overflow-hidden
                 shadow-[0_1px_3px_rgba(34,31,28,0.08)]
                 transition-all duration-200
                 hover:-rotate-1 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(34,31,28,0.14)]"
    >
      <div className="relative overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-44 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 bg-paper/95 text-xs font-semibold px-2.5 py-1 rounded-full text-sage-dark border border-sage/30">
          {recipe.category}
        </span>
      </div>
      <div className="p-4 flex flex-col gap-2">
        <h3 className="font-display text-lg font-semibold leading-snug">{recipe.title}</h3>
        <p className="text-sm text-ink-soft line-clamp-2">{recipe.description}</p>
        <div className="flex items-center justify-between text-xs text-ink-soft pt-2 border-t border-hairline mt-1">
          <span>{recipe.difficulty} · {recipe.cookingTime} min</span>
          <span className="text-saffron-dark font-semibold">★ {recipe.rating}</span>
        </div>
      </div>
    </Link>
  );
}
