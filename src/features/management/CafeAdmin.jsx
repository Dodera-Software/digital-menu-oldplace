import React, { useState, useRef } from 'react';
import { Trash2, Plus, Edit2, X, AlertCircle, Upload } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CafeAdmin = () => {
  const [cafeDetails, setCafeDetails] = useState({
    name: 'Ava',
    logoFile: null,
    logoPreview: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=200&h=200&fit=crop',
    address: '123 Main Street',
    location: 'Downtown',
    openingTime: '08:00',
    closingTime: '22:00'
  });

  // Categories State
  const [categories, setCategories] = useState([
    'Hot Drinks',
    'Cold Drinks',
    'Pastries',
    'Snacks'
  ]);
  const [newCategory, setNewCategory] = useState('');

  // Menu Items State
  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      name: 'Espresso',
      category: 'Hot Drinks',
      price: '$3.50',
      description: 'Rich and bold single shot of pure coffee',
      imageFile: null,
      imagePreview: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      name: 'Cappuccino',
      category: 'Hot Drinks',
      price: '$4.50',
      description: 'Creamy blend of espresso and steamed milk',
      imageFile: null,
      imagePreview: 'https://images.unsplash.com/photo-1515432891733-10e5e5f35e90?w=400&h=300&fit=crop'
    }
  ]);

  const [formState, setFormState] = useState({
    name: '',
    category: categories[0] || '',
    price: '',
    description: '',
    imageFile: null,
    imagePreview: null
  });

  // Modal States
  const [showItemModal, setShowItemModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});

  // Refs for file inputs
  const logoInputRef = useRef(null);
  const itemImageInputRef = useRef(null);

  // Helper: Show toast notification
  const showToast = (message, type = 'success') => {
    toast[type](message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
  };

  // Handle logo file upload
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCafeDetails(prev => ({
          ...prev,
          logoFile: file,
          logoPreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle item image upload
  const handleItemImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormState(prev => ({
          ...prev,
          imageFile: file,
          imagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Cafe Details Handlers
  const handleCafeDetailsChange = (field, value) => {
    setCafeDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveCafeDetails = (e) => {
    e.preventDefault();
    showToast('Cafe details saved successfully!');
  };

  // Categories Handlers
  const handleAddCategory = () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;

    if (categories.some(cat => cat.toLowerCase() === trimmed.toLowerCase())) {
      showToast('Category already exists!', 'warning');
      return;
    }

    setCategories([...categories, trimmed]);
    setNewCategory('');
    showToast('Category added!');
  };

  const handleDeleteCategory = (categoryToDelete) => {
    setCategories(categories.filter(cat => cat !== categoryToDelete));
    showToast('Category deleted!');
  };

  // Menu Items Handlers
  const handleFormChange = (field, value) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formState.name.trim()) newErrors.name = 'Name is required';
    if (!formState.category.trim()) newErrors.category = 'Category is required';
    if (!formState.price.trim()) newErrors.price = 'Price is required';
    if (!formState.description.trim()) newErrors.description = 'Description is required';
    return newErrors;
  };

  const handleSubmitItem = (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (editingId) {
      // Update existing item
      setMenuItems(menuItems.map(item =>
        item.id === editingId
          ? { ...item, ...formState }
          : item
      ));
      showToast('Item updated successfully!');
      setEditingId(null);
    } else {
      // Add new item
      const newItem = {
        id: Date.now(),
        ...formState
      };
      setMenuItems([...menuItems, newItem]);
      showToast('Menu item added!');
    }

    setFormState({
      name: '',
      category: categories[0] || '',
      price: '',
      description: '',
      imageFile: null,
      imagePreview: null
    });
    setErrors({});
    setShowItemModal(false);
  };

  const handleEditItem = (item) => {
    setFormState(item);
    setEditingId(item.id);
    setShowItemModal(true);
  };

  const handleDeleteItem = (id) => {
    setDeleteConfirmId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      setMenuItems(menuItems.filter(item => item.id !== deleteConfirmId));
      showToast('Item deleted!');
      setShowDeleteConfirm(false);
      setDeleteConfirmId(null);
    }
  };

  const handleCancelEdit = () => {
    setFormState({
      name: '',
      category: categories[0] || '',
      price: '',
      description: '',
      imageFile: null,
      imagePreview: null
    });
    setEditingId(null);
    setErrors({});
    setShowItemModal(false);
  };

  const openAddItemModal = () => {
    setFormState({
      name: '',
      category: categories[0] || '',
      price: '',
      description: '',
      imageFile: null,
      imagePreview: null
    });
    setEditingId(null);
    setErrors({});
    setShowItemModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      <ToastContainer
        position="bottom-center"
        theme='dark'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Header */}
      <header className="bg-white/70 backdrop-blur-md border-b border-amber-100/50 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl md:text-4xl font-serif text-amber-900">
            Ava Admin Dashboard
          </h1>
          <p className="text-amber-700 text-sm mt-1">Manage your cafe and menu</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Cafe Details + Categories */}
          <div className="lg:col-span-1 space-y-8">
            {/* Cafe Details Card */}
            <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 border border-amber-100/40">
              <h2 className="text-2xl font-serif text-amber-900 mb-6">Cafe Details</h2>

              <form onSubmit={handleSaveCafeDetails} className="space-y-5">
                {/* Cafe Name */}
                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-2">
                    Cafe Name
                  </label>
                  <input
                    type="text"
                    value={cafeDetails.name}
                    onChange={(e) => handleCafeDetailsChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-amber-200/60 rounded-lg bg-amber-50/30 text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent transition-all"
                    placeholder="Cafe name"
                  />
                </div>

                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-2">
                    Logo Image
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="px-4 py-3 bg-amber-100/60 border border-amber-200/60 rounded-lg text-amber-900 font-medium hover:shadow-md transition-all flex items-center gap-2"
                    >
                      <Upload className="w-5 h-5" />
                      Browse
                    </button>
                    {cafeDetails.logoPreview && (
                      <img
                        src={cafeDetails.logoPreview}
                        alt="Logo preview"
                        className="h-12 w-12 object-cover rounded-lg border border-amber-200/60"
                      />
                    )}
                  </div>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={cafeDetails.address}
                    onChange={(e) => handleCafeDetailsChange('address', e.target.value)}
                    className="w-full px-4 py-3 border border-amber-200/60 rounded-lg bg-amber-50/30 text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent transition-all"
                    placeholder="Street address"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-2">
                    Location / City
                  </label>
                  <input
                    type="text"
                    value={cafeDetails.location}
                    onChange={(e) => handleCafeDetailsChange('location', e.target.value)}
                    className="w-full px-4 py-3 border border-amber-200/60 rounded-lg bg-amber-50/30 text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent transition-all"
                    placeholder="e.g., Downtown"
                  />
                </div>

                {/* Hours */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-amber-900 mb-2">
                      Opening Time
                    </label>
                    <input
                      type="time"
                      value={cafeDetails.openingTime}
                      onChange={(e) => handleCafeDetailsChange('openingTime', e.target.value)}
                      className="w-full px-4 py-3 border border-amber-200/60 rounded-lg bg-amber-50/30 text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-900 mb-2">
                      Closing Time
                    </label>
                    <input
                      type="time"
                      value={cafeDetails.closingTime}
                      onChange={(e) => handleCafeDetailsChange('closingTime', e.target.value)}
                      className="w-full px-4 py-3 border border-amber-200/60 rounded-lg bg-amber-50/30 text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                >
                  Save Details
                </button>
              </form>
            </div>

            {/* Categories Card */}
            <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 border border-amber-100/40">
              <h2 className="text-2xl font-serif text-amber-900 mb-6">Categories</h2>

              {/* Category List */}
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((category) => (
                  <div
                    key={category}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-100/40 rounded-full border border-amber-200/60 hover:shadow-md transition-all"
                  >
                    <span className="text-sm font-medium text-amber-900">{category}</span>
                    <button
                      onClick={() => handleDeleteCategory(category)}
                      className="p-1 hover:bg-amber-200/50 rounded-full transition-colors"
                      aria-label="Delete category"
                    >
                      <X className="w-4 h-4 text-amber-700" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Category */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                  className="flex-1 px-4 py-3 border border-amber-200/60 rounded-lg bg-amber-50/30 text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent transition-all text-sm"
                  placeholder="Add new category"
                />
                <button
                  onClick={handleAddCategory}
                  className="px-4 py-3 bg-amber-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Menu Items */}
          <div className="lg:col-span-2">
            {/* Menu Items Card */}
            <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 border border-amber-100/40">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-serif text-amber-900">Menu Items ({menuItems.length})</h2>
                <button
                  onClick={openAddItemModal}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Item
                </button>
              </div>

              {menuItems.length > 0 ? (
                <div className="space-y-4">
                  {menuItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col md:flex-row md:items-center gap-4 p-5 bg-amber-50/30 rounded-xl border border-amber-100/60 hover:shadow-md transition-all"
                    >
                      {/* Image */}
                      {item.imagePreview && (
                        <img
                          src={item.imagePreview}
                          alt={item.name}
                          className="h-20 w-20 object-cover rounded-lg border border-amber-200/60 flex-shrink-0"
                        />
                      )}

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-serif text-amber-900">{item.name}</h3>
                        <p className="text-sm text-amber-700">{item.category}</p>
                        <p className="text-sm text-amber-700/70 mt-1 line-clamp-2">{item.description}</p>
                      </div>

                      {/* Price */}
                      <div className="text-lg font-serif text-amber-900 font-semibold md:text-right">
                        {item.price}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleEditItem(item)}
                          className="p-3 bg-blue-100/60 text-blue-700 rounded-lg hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                          aria-label="Edit item"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-3 bg-red-100/60 text-red-700 rounded-lg hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-red-400/50"
                          aria-label="Delete item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-amber-700/60 text-lg">No menu items yet. Add one to get started!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modal Overlay */}
      {showItemModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center md:justify-center p-4">
          {/* Modal */}
          <div className="bg-white rounded-t-3xl md:rounded-3xl w-full md:max-w-lg max-h-[90vh] overflow-y-auto shadow-xl animate-in slide-in-from-bottom-5 md:zoom-in-95">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-amber-100/40 px-6 py-4 flex items-center justify-between rounded-t-3xl md:rounded-t-3xl">
              <h3 className="text-xl font-serif text-amber-900">
                {editingId ? 'Edit Menu Item' : 'Add Menu Item'}
              </h3>
              <button
                onClick={handleCancelEdit}
                className="p-2 hover:bg-amber-100/60 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-amber-700" />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSubmitItem} className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2">
                  Item Name *
                </label>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  autoFocus
                  className={`w-full px-4 py-3 border rounded-lg bg-amber-50/30 text-amber-950 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                    errors.name
                      ? 'border-red-400/60 focus:ring-red-400/50'
                      : 'border-amber-200/60 focus:ring-amber-400/50'
                  }`}
                  placeholder="e.g., Cappuccino"
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.name}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2">
                  Category *
                </label>
                <select
                  value={formState.category}
                  onChange={(e) => handleFormChange('category', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg bg-amber-50/30 text-amber-950 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                    errors.category
                      ? 'border-red-400/60 focus:ring-red-400/50'
                      : 'border-amber-200/60 focus:ring-amber-400/50'
                  }`}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.category}
                  </p>
                )}
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2">
                  Price *
                </label>
                <input
                  type="text"
                  value={formState.price}
                  onChange={(e) => handleFormChange('price', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg bg-amber-50/30 text-amber-950 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                    errors.price
                      ? 'border-red-400/60 focus:ring-red-400/50'
                      : 'border-amber-200/60 focus:ring-amber-400/50'
                  }`}
                  placeholder="e.g., $4.50"
                />
                {errors.price && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.price}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2">
                  Description *
                </label>
                <textarea
                  value={formState.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg bg-amber-50/30 text-amber-950 focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none ${
                    errors.description
                      ? 'border-red-400/60 focus:ring-red-400/50'
                      : 'border-amber-200/60 focus:ring-amber-400/50'
                  }`}
                  rows="3"
                  placeholder="Describe the item..."
                />
                {errors.description && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.description}
                  </p>
                )}
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2">
                  Item Image (optional)
                </label>
                <div className="flex gap-3 items-center">
                  <button
                    type="button"
                    onClick={() => itemImageInputRef.current?.click()}
                    className="px-4 py-3 bg-amber-100/60 border border-amber-200/60 rounded-lg text-amber-900 font-medium hover:shadow-md transition-all flex items-center gap-2"
                  >
                    <Upload className="w-5 h-5" />
                    Browse
                  </button>
                  {formState.imagePreview && (
                    <img
                      src={formState.imagePreview}
                      alt="Item preview"
                      className="h-16 w-16 object-cover rounded-lg border border-amber-200/60"
                    />
                  )}
                </div>
                <input
                  ref={itemImageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleItemImageUpload}
                  className="hidden"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-amber-100/40">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400/50 flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  {editingId ? 'Update Item' : 'Add Item'}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400/50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl max-w-sm p-8 animate-in zoom-in-95">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-100/60 rounded-full">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-serif text-amber-900">Delete Item?</h3>
            </div>

            <p className="text-amber-700/70 mb-8">
              Are you sure you want to delete this menu item? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:shadow-md transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:shadow-lg hover:bg-red-700 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CafeAdmin;
