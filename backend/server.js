const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'recipe_app_secret_key_change_in_prod';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));

// ---------- In-memory "database" ----------
let users = []; // { id, name, email, password (hashed) }
let userIdCounter = 1;

let recipes = [
  {
    id: 1,
    title: 'Classic Pancakes',
    description: 'Fluffy breakfast pancakes made from scratch.',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600',
    category: 'Breakfast',
    difficulty: 'Easy',
    cookingTime: 20,
    rating: 4.5,
    ingredients: ['2 cups flour', '2 eggs', '1.5 cups milk', '2 tbsp sugar', '1 tbsp baking powder', 'Pinch of salt'],
    instructions: [
      'Mix dry ingredients in a bowl.',
      'Whisk eggs and milk together, then combine with dry mix.',
      'Heat a non-stick pan and pour batter in small circles.',
      'Flip when bubbles form, cook until golden on both sides.',
      'Serve warm with syrup.'
    ]
  },
  {
    id: 2,
    title: 'Vegan Buddha Bowl',
    description: 'A colorful, nutrient-packed vegan bowl.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600',
    category: 'Vegan',
    difficulty: 'Easy',
    cookingTime: 25,
    rating: 4.7,
    ingredients: ['1 cup quinoa', '1 cup chickpeas', '1 avocado', 'Mixed greens', 'Tahini dressing'],
    instructions: [
      'Cook quinoa according to package instructions.',
      'Roast chickpeas with olive oil and spices.',
      'Arrange quinoa, chickpeas, avocado, and greens in a bowl.',
      'Drizzle with tahini dressing and serve.'
    ]
  },
  {
    id: 3,
    title: 'Chocolate Lava Cake',
    description: 'Rich, gooey molten chocolate dessert.',
    image: 'https://images.unsplash.com/photo-1605807646983-377bc5a76493?w=600',
    category: 'Desserts',
    difficulty: 'Medium',
    cookingTime: 35,
    rating: 4.9,
    ingredients: ['200g dark chocolate', '100g butter', '2 eggs', '50g sugar', '50g flour'],
    instructions: [
      'Melt chocolate and butter together.',
      'Whisk eggs and sugar, fold into chocolate mixture.',
      'Add flour and mix gently.',
      'Pour into ramekins and bake at 200°C for 12 minutes.',
      'Serve immediately while center is molten.'
    ]
  },
  {
    id: 4,
    title: 'Grilled Chicken Salad',
    description: 'Light and protein-rich salad for lunch.',
    image: 'https://images.unsplash.com/photo-1567121938596-6d9d015d348b?w=600',
    category: 'Lunch',
    difficulty: 'Easy',
    cookingTime: 30,
    rating: 4.3,
    ingredients: ['2 chicken breasts', 'Mixed lettuce', 'Cherry tomatoes', 'Cucumber', 'Olive oil', 'Lemon juice'],
    instructions: [
      'Season and grill chicken breasts until cooked through.',
      'Slice chicken and set aside.',
      'Toss lettuce, tomatoes, and cucumber in a bowl.',
      'Top with chicken and drizzle with olive oil and lemon juice.'
    ]
  },
  {
    id: 5,
    title: 'Spaghetti Bolognese',
    description: 'Classic hearty Italian pasta with rich meat sauce.',
    image: 'https://images.unsplash.com/photo-1626844131082-256783844137?w=600',
    category: 'Dinner',
    difficulty: 'Medium',
    cookingTime: 45,
    rating: 4.8,
    ingredients: ['400g spaghetti', '500g ground beef', '1 onion, diced', '2 cloves garlic, minced', '400g crushed tomatoes', '2 tbsp tomato paste', 'Parmesan cheese for garnish'],
    instructions: [
      'Boil pasta in salted water until al dente.',
      'Sauté chopped onion and garlic in olive oil until soft.',
      'Add ground beef and brown completely, draining excess fat.',
      'Stir in crushed tomatoes and tomato paste, simmer for 20 minutes.',
      'Serve sauce over pasta and top with parmesan cheese.'
    ]
  }
];
let recipeIdCounter = 6;

// ---------- Auth middleware ----------
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}

// ---------- Auth Routes ----------
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: userIdCounter++, name, email, password: hashedPassword };
    users.push(newUser);

    const token = jwt.sign({ id: newUser.id, name: newUser.name, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ message: 'User registered successfully', token, user: { id: newUser.id, name: newUser.name, email: newUser.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: 'Login successful', token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// ---------- Recipe Routes ----------
// GET all recipes (with optional category/time/search filters)
app.get('/api/recipes', (req, res) => {
  let result = [...recipes];
  const { category, maxTime, search } = req.query;

  if (category && category !== 'All') {
    result = result.filter(r => r.category.toLowerCase() === category.toLowerCase());
  }
  if (maxTime) {
    result = result.filter(r => r.cookingTime <= parseInt(maxTime));
  }
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.ingredients.some(i => i.toLowerCase().includes(q)) ||
      r.category.toLowerCase().includes(q)
    );
  }
  res.json(result);
});

// GET single recipe by id
app.get('/api/recipes/:id', (req, res) => {
  const recipe = recipes.find(r => r.id === parseInt(req.params.id));
  if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
  res.json(recipe);
});

// POST a new recipe (protected)
app.post('/api/recipes', authenticateToken, (req, res) => {
  const { title, description, image, ingredients, instructions, category, cookingTime, difficulty } = req.body;
  if (!title || !ingredients || !instructions || !category || !cookingTime) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  const newRecipe = {
    id: recipeIdCounter++,
    title,
    description: description || '',
    image: image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600',
    category,
    difficulty: difficulty || 'Easy',
    cookingTime: parseInt(cookingTime),
    rating: 0,
    ingredients: Array.isArray(ingredients) ? ingredients : ingredients.split('\n').filter(Boolean),
    instructions: Array.isArray(instructions) ? instructions : instructions.split('\n').filter(Boolean),
    submittedBy: req.user.name
  };
  recipes.push(newRecipe);
  res.status(201).json({ message: 'Recipe submitted successfully', recipe: newRecipe });
});

// DELETE a recipe (protected)
app.delete('/api/recipes/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const index = recipes.findIndex(r => r.id === id);
  if (index === -1) return res.status(404).json({ message: 'Recipe not found' });
  recipes.splice(index, 1);
  res.json({ message: 'Recipe deleted successfully' });
});

// Fallback to index.html for SPA-like routing of static pages
app.get('/{*splat}', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});