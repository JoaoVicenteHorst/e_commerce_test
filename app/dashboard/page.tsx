'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
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

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'users'>('products');
  const [loading, setLoading] = useState(true);
  
  // Product form states
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    discount: '',
    image: '',
    category: '',
    stock: '',
  });

  // User form states
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER',
  });
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userFilterRole, setUserFilterRole] = useState<string>('ALL');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== 'ADMIN' && parsedUser.role !== 'MANAGER') {
      router.push('/');
      return;
    }

    setUser(parsedUser);
    fetchData();
  }, [router]);

  const fetchData = async () => {
    await Promise.all([fetchProducts(), fetchUsers()]);
    setLoading(false);
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const url = editingProduct
        ? `/api/products/${editingProduct.id}`
        : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productForm),
      });

      if (response.ok) {
        await fetchProducts();
        setShowProductForm(false);
        setEditingProduct(null);
        setProductForm({
          name: '',
          description: '',
          price: '',
          discount: '',
          image: '',
          category: '',
          stock: '',
        });
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchProducts();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      discount: product.discount.toString(),
      image: product.image,
      category: product.category,
      stock: product.stock.toString(),
    });
    setShowProductForm(true);
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users';
      const method = editingUser ? 'PUT' : 'POST';

      const body: any = {
        name: userForm.name,
        email: userForm.email,
        role: userForm.role,
      };

      if (userForm.password) {
        body.password = userForm.password;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        await fetchUsers();
        setShowUserForm(false);
        setEditingUser(null);
        setUserForm({ name: '', email: '', password: '', role: 'USER' });
      }
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchUsers();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEditUser = (editUser: User) => {
    setEditingUser(editUser);
    setUserForm({
      name: editUser.name,
      email: editUser.email,
      password: '',
      role: editUser.role,
    });
    setShowUserForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              {user?.role} Dashboard
            </h1>
            <div className="flex gap-4">
              <Link
                href="/"
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Back to Store
              </Link>
              <Link
                href="/profile"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Profile
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'products'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'users'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Users ({users.length})
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Manage Products</h2>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm({
                    name: '',
                    description: '',
                    price: '',
                    discount: '',
                    image: '',
                    category: '',
                    stock: '',
                  });
                  setShowProductForm(!showProductForm);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                {showProductForm ? 'Cancel' : 'Add Product'}
              </button>
            </div>

            {showProductForm && (
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-xl font-bold mb-4">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <form onSubmit={handleProductSubmit} className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Product Name"
                    value={productForm.name}
                    onChange={(e) =>
                      setProductForm({ ...productForm, name: e.target.value })
                    }
                    required
                    className="px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Category"
                    value={productForm.category}
                    onChange={(e) =>
                      setProductForm({ ...productForm, category: e.target.value })
                    }
                    required
                    className="px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm({ ...productForm, price: e.target.value })
                    }
                    required
                    className="px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="Discount %"
                    value={productForm.discount}
                    onChange={(e) =>
                      setProductForm({ ...productForm, discount: e.target.value })
                    }
                    className="px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    value={productForm.stock}
                    onChange={(e) =>
                      setProductForm({ ...productForm, stock: e.target.value })
                    }
                    required
                    className="px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={productForm.image}
                    onChange={(e) =>
                      setProductForm({ ...productForm, image: e.target.value })
                    }
                    className="px-4 py-2 border rounded-lg"
                  />
                  <textarea
                    placeholder="Description"
                    value={productForm.description}
                    onChange={(e) =>
                      setProductForm({ ...productForm, description: e.target.value })
                    }
                    required
                    className="col-span-2 px-4 py-2 border rounded-lg h-24"
                  />
                  <button
                    type="submit"
                    className="col-span-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </button>
                </form>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-left">Price</th>
                    <th className="px-4 py-3 text-left">Discount</th>
                    <th className="px-4 py-3 text-left">Stock</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3">{product.name}</td>
                      <td className="px-4 py-3">{product.category}</td>
                      <td className="px-4 py-3">${product.price.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        {product.discount > 0 ? `${product.discount}%` : '-'}
                      </td>
                      <td className="px-4 py-3">{product.stock}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            {/* User Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Total Users</h3>
                <p className="text-3xl font-bold text-gray-800">{users.length}</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg shadow-md">
                <h3 className="text-sm font-medium text-purple-600 mb-2">Admins</h3>
                <p className="text-3xl font-bold text-purple-800">
                  {users.filter(u => u.role === 'ADMIN').length}
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg shadow-md">
                <h3 className="text-sm font-medium text-blue-600 mb-2">Managers</h3>
                <p className="text-3xl font-bold text-blue-800">
                  {users.filter(u => u.role === 'MANAGER').length}
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Users</h3>
                <p className="text-3xl font-bold text-gray-800">
                  {users.filter(u => u.role === 'USER').length}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Manage User Accounts</h2>
              <button
                onClick={() => {
                  setEditingUser(null);
                  setUserForm({ name: '', email: '', password: '', role: 'USER' });
                  setShowUserForm(!showUserForm);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
              >
                <span>+</span>
                {showUserForm ? 'Cancel' : 'Add New User'}
              </button>
            </div>

            {/* Search and Filter */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={userFilterRole}
                onChange={(e) => setUserFilterRole(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="MANAGER">Manager</option>
                <option value="USER">User</option>
              </select>
            </div>

            {showUserForm && (
              <div className="bg-white p-6 rounded-lg shadow-md mb-6 border-2 border-blue-200">
                <h3 className="text-xl font-bold mb-4 text-gray-800">
                  {editingUser ? '✏️ Edit User Account' : '➕ Create New User Account'}
                </h3>
                <form onSubmit={handleUserSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={userForm.name}
                        onChange={(e) =>
                          setUserForm({ ...userForm, name: e.target.value })
                        }
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        value={userForm.email}
                        onChange={(e) =>
                          setUserForm({ ...userForm, email: e.target.value })
                        }
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {editingUser ? 'New Password (leave empty to keep current)' : 'Password *'}
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={userForm.password}
                        onChange={(e) =>
                          setUserForm({ ...userForm, password: e.target.value })
                        }
                        required={!editingUser}
                        minLength={6}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        User Role *
                      </label>
                      <select
                        value={userForm.role}
                        onChange={(e) =>
                          setUserForm({ ...userForm, role: e.target.value })
                        }
                        disabled={user?.role === 'MANAGER'}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="USER">👤 User (Basic Access)</option>
                        {user?.role === 'ADMIN' && (
                          <>
                            <option value="MANAGER">👔 Manager (Manage Users & Products)</option>
                            <option value="ADMIN">👑 Admin (Full System Access)</option>
                          </>
                        )}
                      </select>
                      {user?.role === 'MANAGER' && (
                        <p className="text-xs text-gray-500 mt-1">
                          Managers can only create USER accounts
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                      {editingUser ? '✓ Update User' : '+ Create User'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowUserForm(false);
                        setEditingUser(null);
                        setUserForm({ name: '', email: '', password: '', role: 'USER' });
                      }}
                      className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Role</th>
                    <th className="px-4 py-3 text-left">Created Date</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users
                    .filter((listUser) => {
                      // Search filter
                      const matchesSearch = userSearchTerm === '' ||
                        listUser.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                        listUser.email.toLowerCase().includes(userSearchTerm.toLowerCase());
                      
                      // Role filter
                      const matchesRole = userFilterRole === 'ALL' || listUser.role === userFilterRole;
                      
                      return matchesSearch && matchesRole;
                    })
                    .map((listUser) => (
                      <tr key={listUser.id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-gray-800">{listUser.name}</p>
                            {listUser.id === user?.id && (
                              <span className="text-xs text-green-600 font-medium">You</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{listUser.email}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              listUser.role === 'ADMIN'
                                ? 'bg-purple-100 text-purple-800'
                                : listUser.role === 'MANAGER'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {listUser.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600 text-sm">
                          {listUser.createdAt 
                            ? new Date(listUser.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })
                            : '-'
                          }
                        </td>
                        <td className="px-4 py-3 text-right">
                          {(user?.role === 'ADMIN' ||
                            (user?.role === 'MANAGER' && listUser.role === 'USER')) && (
                            <>
                              <button
                                onClick={() => handleEditUser(listUser)}
                                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2 text-sm"
                                title="Edit user"
                              >
                                ✏️ Edit
                              </button>
                              {user?.role === 'ADMIN' && listUser.id !== user.id && (
                                <button
                                  onClick={() => handleDeleteUser(listUser.id)}
                                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                                  title="Delete user"
                                >
                                  🗑️ Delete
                                </button>
                              )}
                            </>
                          )}
                          {user?.role === 'ADMIN' && listUser.id === user.id && (
                            <span className="text-sm text-gray-500 italic">Current account</span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              
              {users.filter((listUser) => {
                const matchesSearch = userSearchTerm === '' ||
                  listUser.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                  listUser.email.toLowerCase().includes(userSearchTerm.toLowerCase());
                const matchesRole = userFilterRole === 'ALL' || listUser.role === userFilterRole;
                return matchesSearch && matchesRole;
              }).length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <p className="text-lg">No users found matching your criteria</p>
                  <p className="text-sm mt-2">Try adjusting your search or filters</p>
                </div>
              )}
            </div>

            {/* Permissions Info */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">👤 User Management Permissions</h3>
              <div className="text-sm text-blue-800 space-y-1">
                {user?.role === 'ADMIN' ? (
                  <>
                    <p>✅ <strong>Admins</strong> can create, edit, and delete ALL user types</p>
                    <p>✅ Can promote users to Manager or Admin roles</p>
                    <p>✅ Can delete any user except your own account</p>
                  </>
                ) : (
                  <>
                    <p>✅ <strong>Managers</strong> can create and edit USER accounts only</p>
                    <p>❌ Cannot manage Admin or Manager accounts</p>
                    <p>❌ Cannot delete any accounts</p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

