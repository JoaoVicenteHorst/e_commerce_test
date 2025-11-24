'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  image: string;
  category: string;
  stock: number;
}

export default function HomePage() {
  const router = useRouter();
  const { addToCart, getCartCount, loadUserCart } = useCart();
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('All');
  const [addedToCart, setAddedToCart] = useState<string | null>(null);

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      // Load user's specific cart
      loadUserCart(parsedUser.id);
    }

    // Fetch products
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  const filteredProducts = filterCategory === 'All' 
    ? products 
    : products.filter(p => p.category === filterCategory);

  const discountedProducts = products.filter(p => p.discount > 0);

  const handleAddToCart = (product: Product) => {
    if (!user) {
      router.push('/login');
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      discount: product.discount,
      image: product.image,
    });
    setAddedToCart(product.id);
    setTimeout(() => setAddedToCart(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">E-Commerce Store</h1>
              {user && (
                <p className="text-sm text-gray-600">
                  Welcome, {user.name} ({user.role})
                </p>
              )}
            </div>
            
            <div className="flex gap-4 items-center">
              {user && (
                <Link
                  href="/cart"
                  className="relative px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition flex items-center gap-2"
                >
                  <span>🛒</span>
                  Cart
                  {getCartCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                      {getCartCount()}
                    </span>
                  )}
                </Link>
              )}
              {user ? (
                <>
                  {(user.role === 'ADMIN' || user.role === 'MANAGER') && (
                    <Link
                      href="/dashboard"
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                    >
                      Dashboard
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Special Offers Banner */}
        {discountedProducts.length > 0 && (
          <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-lg p-6 mb-8 text-white">
            <h2 className="text-3xl font-bold mb-2">Special Offers! 🎉</h2>
            <p className="text-lg">{discountedProducts.length} products with 15% OFF</p>
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setFilterCategory(category)}
              className={`px-4 py-2 rounded-lg transition ${
                filterCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => {
              const finalPrice = product.price * (1 - product.discount / 100);
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
                >
                  {product.discount > 0 && (
                    <div className="absolute mt-2 ml-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      -{product.discount}%
                    </div>
                  )}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        {product.discount > 0 ? (
                          <div>
                            <span className="text-xl font-bold text-green-600">
                              ${finalPrice.toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-500 line-through ml-2">
                              ${product.price.toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xl font-bold text-gray-800">
                            ${product.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        Stock: {product.stock}
                      </span>
                    </div>
                    {user ? (
                      <button
                        onClick={() => handleAddToCart(product)}
                        className={`mt-4 w-full py-2 rounded-lg transition font-medium ${
                          addedToCart === product.id
                            ? 'bg-green-600 text-white'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {addedToCart === product.id ? '✓ Added!' : 'Add to Cart'}
                      </button>
                    ) : (
                      <button
                        onClick={() => router.push('/login')}
                        className="mt-4 w-full py-2 rounded-lg transition font-medium bg-gray-600 text-white hover:bg-gray-700"
                      >
                        Login to Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No products found in this category.</p>
          </div>
        )}
      </main>
    </div>
  );
}

