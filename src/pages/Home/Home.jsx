import './Home.css'

function Home() {
/*   const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory)

  const featuredProducts = products.slice(0, 4) */

  return (
    
    <div className="home">
      <h1> Esto es la página HOME </h1>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>🎮 Bienvenido a NebriGame</h1>
          <p>Tu tienda de confianza para videojuegos, consolas y merchandising</p>
          <div className="hero-stats">
            <div className="stat">
              {/* <span className="stat-number">{products.length}+</span> */}
              <span className="stat-label">Productos</span>
            </div>
            <div className="stat">
              <span className="stat-number">100%</span>
              <span className="stat-label">Originales</span>
            </div>
            <div className="stat">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Soporte</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <h2>⭐ Productos Destacados</h2>
{/*         <div className="products-grid">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div> */}
      </section>

      {/* Categories Filter */}
      <section className="categories-section">
        <h2>📦 Explorar por Categoría</h2>
        <div className="categories-filter">
{/*           {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="category-icon">{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))} */}
        </div>
      </section>

      {/* All Products */}
{/*       <section className="products-section">
        <h2>
          {selectedCategory === 'all' 
            ? '🎯 Todos los Productos' 
            : `${categories.find(c => c.id === selectedCategory)?.icon} ${categories.find(c => c.id === selectedCategory)?.name}`
          }
        </h2>
        <div className="products-grid">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section> */}
    </div>
  )
}


export default Home
