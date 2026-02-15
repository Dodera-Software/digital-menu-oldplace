import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Edit2, X, Check, AlertCircle, Upload, Loader } from 'lucide-react';
import { CafeLoader } from '../loader/CafeLoader'
import supabase from '../../utils/supabase'

const BUCKET_NAME = 'images'; // Update with your bucket name

const CafeAdmin = () => {
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Cafe Details State
  const [cafeDetails, setCafeDetails] = useState({
    id: null,
    name: '',
    logoUrl: '',
    address: '',
    openingTime: '',
    closingTime: '',
    slogan: ''
  });

  // Categories State
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');

  // Menu Items State
  const [menuItems, setMenuItems] = useState([]);

  const [formState, setFormState] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    image: ''
  });

  const [editingId, setEditingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  // Load all data on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      // Load cafe details
      const { data: cafeData, error: cafeError } = await supabase
        .from('cafeDetails')
        .select('*')
        .limit(1)
        .single();

      if (cafeError && cafeError.code !== 'PGRST116') {
        throw cafeError;
      }

      if (cafeData) {
        setCafeDetails(cafeData);
      }

      // Load categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (categoriesError) throw categoriesError;
      setCategories(categoriesData || []);

      // Set default category for form if available
      if (categoriesData?.length > 0 && !formState.category) {
        setFormState(prev => ({ ...prev, category: categoriesData[0].id }));
      }

      // Load menu items
      const { data: itemsData, error: itemsError } = await supabase
        .from('menuItems')
        .select('*')

      if (itemsError) throw itemsError;
      setMenuItems(itemsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      setErrorMessage('Failed to load data. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper: Show temporary success message
  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Cafe Details Handlers
  const handleCafeDetailsChange = (field, value) => {
    setCafeDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveCafeDetails = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setErrorMessage('');

      let result;
      if (cafeDetails.id) {
        // Update existing
        result = await supabase
          .from('cafeDetails')
          .update(cafeDetails)
          .eq('id', cafeDetails.id);
      } else {
        // Insert new
        result = await supabase
          .from('cafeDetails')
          .insert([cafeDetails])
          .select()
          .single();

        if (result.data) {
          setCafeDetails(result.data);
        }
      }

      if (result.error) throw result.error;
      showSuccess('Cafe details saved successfully!');
    } catch (error) {
      console.error('Error saving cafe details:', error);
      setErrorMessage(error.message || 'Failed to save cafe details');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle image upload
  const handleImageUpload = async (e, isLogo = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);
      setErrorMessage('');

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to bucket
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(uploadData.path);

      const imageUrl = urlData.publicUrl;

      if (isLogo) {
        handleCafeDetailsChange('logoUrl', imageUrl);
      } else {
        setFormState(prev => ({ ...prev, image: imageUrl }));
      }

      showSuccess('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      setErrorMessage(error.message || 'Failed to upload image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Categories Handlers
  const handleAddCategory = async () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;

    try {
      setIsSaving(true);
      setErrorMessage('');

      // Check for duplicates
      const duplicate = categories.some(cat =>
        cat.name.toLowerCase() === trimmed.toLowerCase()
      );
      if (duplicate) {
        showSuccess('Category already exists!');
        return;
      }

      // Insert new category
      const { data, error } = await supabase
        .from('categories')
        .insert([{ name: trimmed }])
        .select()
        .single();

      if (error) throw error;

      setCategories([...categories, data]);
      setNewCategory('');
      showSuccess('Category added!');
    } catch (error) {
      console.error('Error adding category:', error);
      setErrorMessage(error.message || 'Failed to add category');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateCategory = async (id) => {
    const trimmed = editingCategoryName.trim();
    if (!trimmed) return;

    try {
      setIsSaving(true);
      setErrorMessage('');

      const { error } = await supabase
        .from('categories')
        .update({ name: trimmed })
        .eq('id', id);

      if (error) throw error;

      setCategories(categories.map(cat =>
        cat.id === id ? { ...cat, name: trimmed } : cat
      ));
      setEditingCategoryId(null);
      setEditingCategoryName('');
      showSuccess('Category updated!');
    } catch (error) {
      console.error('Error updating category:', error);
      setErrorMessage(error.message || 'Failed to update category');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure? This action cannot be undone.')) return;

    try {
      setIsSaving(true);
      setErrorMessage('');

      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCategories(categories.filter(cat => cat.id !== id));
      showSuccess('Category deleted!');
    } catch (error) {
      console.error('Error deleting category:', error);
      setErrorMessage(error.message || 'Failed to delete category');
    } finally {
      setIsSaving(false);
    }
  };

  // Menu Items Handlers
  const handleFormChange = (field, value) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
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
    if (!formState.category) newErrors.category = 'Category is required';
    if (!formState.price.trim()) newErrors.price = 'Price is required';
    if (!formState.description.trim()) newErrors.description = 'Description is required';
    return newErrors;
  };

  const handleSubmitItem = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage('');

      const itemData = {
        name: formState.name,
        category_id: formState.category,
        price: formState.price,
        description: formState.description,
        image: formState.image || null
      };

      if (editingId) {
        // Update existing item
        const { error } = await supabase
          .from('menuItems')
          .update(itemData)
          .eq('id', editingId);

        if (error) throw error;

        setMenuItems(menuItems.map(item =>
          item.id === editingId
            ? { ...item, ...itemData }
            : item
        ));
        showSuccess('Item updated successfully!');
      } else {
        // Add new item
        const { data, error } = await supabase
          .from('menuItems')
          .insert([itemData])
          .select()
          .single();

        if (error) throw error;

        setMenuItems([data, ...menuItems]);
        showSuccess('Menu item added!');
      }

      setFormState({
        name: '',
        category: categories[0]?.id || '',
        price: '',
        description: '',
        image: ''
      });
      setEditingId(null);
      setErrors({});
    } catch (error) {
      console.error('Error saving item:', error);
      setErrorMessage(error.message || 'Failed to save item');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditItem = (item) => {
    setFormState({
      name: item.name,
      category: item.category_id,
      price: item.price,
      description: item.description,
      image: item.image || ''
    });
    setEditingId(item.id);
    window.scrollTo({ top: 1200, behavior: 'smooth' });
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      setIsSaving(true);
      setErrorMessage('');

      const { error } = await supabase
        .from('menuItems')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMenuItems(menuItems.filter(item => item.id !== id));
      showSuccess('Item deleted!');
    } catch (error) {
      console.error('Error deleting item:', error);
      setErrorMessage(error.message || 'Failed to delete item');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setFormState({
      name: '',
      category: categories[0]?.id || '',
      price: '',
      description: '',
      image: ''
    });
    setEditingId(null);
    setErrors({});
  };

  // Get category name by id
  const getCategoryName = (categoryId) => {
    return categories.find(cat => cat.id === categoryId)?.name || 'Unknown';
  };

  if (isLoading) {
    return <CafeLoader fullScreen={true} message="Loading admin dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-md border-b border-amber-100/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl md:text-4xl font-serif text-amber-900">
            Ava Admin Dashboard
          </h1>
          <p className="text-amber-700 text-sm mt-1">Manage your cafe and menu</p>
        </div>
      </header>

      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-500/90 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 z-40 animate-in fade-in slide-in-from-top-4">
          <Check className="w-5 h-5" />
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="fixed top-4 right-4 bg-red-500/90 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 z-40 animate-in fade-in slide-in-from-top-4">
          <AlertCircle className="w-5 h-5" />
          {errorMessage}
        </div>
      )}

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
                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-2">
                    Slogan
                  </label>
                  <input
                    type="text"
                    value={cafeDetails.slogan}
                    onChange={(e) => handleCafeDetailsChange('slogan', e.target.value)}
                    className="w-full px-4 py-3 border border-amber-200/60 rounded-lg bg-amber-50/30 text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent transition-all"
                    placeholder="Slogan..."
                  />
                </div>

                {/* Logo URL with Upload */}
                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-2">
                    Logo
                  </label>
                  <div className="space-y-3">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, true)}
                        disabled={isUploadingImage}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        aria-label="Upload logo"
                      />
                      <div className="px-4 py-3 border-2 border-dashed border-amber-300/60 rounded-lg bg-amber-50/50 flex items-center justify-center gap-2 hover:bg-amber-100/30 transition-colors">
                        {isUploadingImage ? (
                          <Loader className="w-5 h-5 text-amber-600 animate-spin" />
                        ) : (
                          <>
                            <Upload className="w-5 h-5 text-amber-600" />
                            <span className="text-sm text-amber-900">Click to upload logo</span>
                          </>
                        )}
                      </div>
                    </div>
                    {cafeDetails.logoUrl && (
                      <img
                        src={cafeDetails.logoUrl}
                        alt="Logo preview"
                        className="h-16 w-16 object-cover rounded-lg border border-amber-200/60"
                        onError={() => handleCafeDetailsChange('logoUrl', '')}
                      />
                    )}
                  </div>
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
                  disabled={isSaving}
                  className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSaving && <Loader className="w-4 h-4 animate-spin" />}
                  Save Details
                </button>
              </form>
            </div>

            {/* Categories Card */}
            <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 border border-amber-100/40">
              <h2 className="text-2xl font-serif text-amber-900 mb-6">Categories</h2>

              {/* Category List */}
              <div className="space-y-2 mb-6">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center gap-2 p-3 bg-amber-100/40 rounded-lg border border-amber-200/60 hover:shadow-md transition-all group"
                  >
                    {editingCategoryId === category.id ? (
                      <>
                        <input
                          type="text"
                          value={editingCategoryName}
                          onChange={(e) => setEditingCategoryName(e.target.value)}
                          className="flex-1 px-3 py-2 border border-amber-200/60 rounded bg-white text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                          autoFocus
                        />
                        <button
                          onClick={() => handleUpdateCategory(category.id)}
                          disabled={isSaving}
                          className="p-2 hover:bg-green-100 rounded transition-colors disabled:opacity-50"
                        >
                          <Check className="w-4 h-4 text-green-600" />
                        </button>
                        <button
                          onClick={() => setEditingCategoryId(null)}
                          disabled={isSaving}
                          className="p-2 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
                        >
                          <X className="w-4 h-4 text-gray-600" />
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1 text-sm font-medium text-amber-900">{category.name}</span>
                        <button
                          onClick={() => {
                            setEditingCategoryId(category.id);
                            setEditingCategoryName(category.name);
                          }}
                          disabled={isSaving}
                          className="p-2  hover:bg-blue-100 rounded transition-colors  group-hover:opacity-100 disabled:opacity-50"
                        >
                          <Edit2 className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          disabled={isSaving}
                          className="p-2 hover:bg-red-100 rounded transition-colors  group-hover:opacity-100 disabled:opacity-50"
                        >
                          <X className="w-4 h-4 text-red-600" />
                        </button>
                      </>
                    )}
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
                  disabled={isSaving}
                  className="flex-1 px-4 py-3 border border-amber-200/60 rounded-lg bg-amber-50/30 text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent transition-all text-sm disabled:opacity-50"
                  placeholder="Add new category"
                />
                <button
                  onClick={handleAddCategory}
                  disabled={isSaving}
                  className="px-4 py-3 bg-amber-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Menu Items */}
          <div className="lg:col-span-2 space-y-8">
            {/* Menu Item Form Card */}
            <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 border border-amber-100/40">
              <h2 className="text-2xl font-serif text-amber-900 mb-6">
                {editingId ? 'Edit Menu Item' : 'Add Menu Item'}
              </h2>

              <form onSubmit={handleSubmitItem} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-2">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    value={formState.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    disabled={isSaving}
                    className={`w-full px-4 py-3 border rounded-lg bg-amber-50/30 text-amber-950 focus:outline-none focus:ring-2 focus:border-transparent transition-all disabled:opacity-50 ${
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

                <div className="grid grid-cols-2 gap-4">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-amber-900 mb-2">
                      Category *
                    </label>
                    <select
                      value={formState.category}
                      onChange={(e) => handleFormChange('category', e.target.value)}
                      disabled={isSaving || categories.length === 0}
                      className={`w-full px-4 py-3 border rounded-lg bg-amber-50/30 text-amber-950 focus:outline-none focus:ring-2 focus:border-transparent transition-all disabled:opacity-50 ${
                        errors.category
                          ? 'border-red-400/60 focus:ring-red-400/50'
                          : 'border-amber-200/60 focus:ring-amber-400/50'
                      }`}
                    >
                      <option value="">Select a category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
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
                      disabled={isSaving}
                      className={`w-full px-4 py-3 border rounded-lg bg-amber-50/30 text-amber-950 focus:outline-none focus:ring-2 focus:border-transparent transition-all disabled:opacity-50 ${
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
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formState.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                    disabled={isSaving}
                    className={`w-full px-4 py-3 border rounded-lg bg-amber-50/30 text-amber-950 focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none disabled:opacity-50 ${
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
                  <div className="space-y-3">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, false)}
                        disabled={isUploadingImage}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        aria-label="Upload item image"
                      />
                      <div className="px-4 py-3 border-2 border-dashed border-amber-300/60 rounded-lg bg-amber-50/50 flex items-center justify-center gap-2 hover:bg-amber-100/30 transition-colors">
                        {isUploadingImage ? (
                          <Loader className="w-5 h-5 text-amber-600 animate-spin" />
                        ) : (
                          <>
                            <Upload className="w-5 h-5 text-amber-600" />
                            <span className="text-sm text-amber-900">Click to upload image</span>
                          </>
                        )}
                      </div>
                    </div>
                    {formState.image && (
                      <img
                        src={formState.image}
                        alt="Item preview"
                        className="h-24 w-24 object-cover rounded-lg border border-amber-200/60"
                        onError={() => handleFormChange('image', '')}
                      />
                    )}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSaving && <Loader className="w-5 h-5 animate-spin" />}
                    <Plus className="w-5 h-5" />
                    {editingId ? 'Update Item' : 'Add Item'}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400/50 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Menu Items List Card */}
            <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 border border-amber-100/40">
              <h2 className="text-2xl font-serif text-amber-900 mb-6">Menu Items ({menuItems.length})</h2>

              {menuItems.length > 0 ? (
                <div className="space-y-4">
                  {menuItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col md:flex-row md:items-center gap-4 p-5 bg-amber-50/30 rounded-xl border border-amber-100/60 hover:shadow-md transition-all"
                    >
                      {/* Image */}
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-20 w-20 object-cover rounded-lg border border-amber-200/60 flex-shrink-0"
                          onError={() => {}}
                        />
                      )}

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-serif text-amber-900">{item.name}</h3>
                        <p className="text-sm text-amber-700">{getCategoryName(item.category_id)}</p>
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
                          disabled={isSaving}
                          className="p-3 bg-blue-100/60 text-blue-700 rounded-lg hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-400/50 disabled:opacity-50"
                          aria-label="Edit item"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          disabled={isSaving}
                          className="p-3 bg-red-100/60 text-red-700 rounded-lg hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-red-400/50 disabled:opacity-50"
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
    </div>
  );
};

export default CafeAdmin;
