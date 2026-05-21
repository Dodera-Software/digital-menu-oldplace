import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Plus, Edit2, X, Check, AlertCircle, Upload, Loader, ChevronDown, ChevronRight, ChevronUp, LogOut } from 'lucide-react';
import { CafeLoader } from '../loader/CafeLoader'
import { useNavigate } from 'react-router';
import supabase from '../../utils/supabase'

const BUCKET_NAME = 'images';

const DEFAULT_HOURS = [
  { day: 'Mon – Fri', time: '7:30 am – 12 am' },
  { day: 'Saturday', time: '10 am – 1 am' },
  { day: 'Sunday', time: '10 am – 12 am' },
];

const CafeAdmin = () => {
  const navigate = useNavigate();
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
    slogan: '',
    hours: DEFAULT_HOURS
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
  const [collapsedCategories, setCollapsedCategories] = useState(new Set());
  const [showItemForm, setShowItemForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllItems, setShowAllItems] = useState(false);

  const editingCategoryRef = useRef(null);

  // Close category edit when clicking outside
  useEffect(() => {
    if (!editingCategoryId) return;
    const handleClickOutside = (e) => {
      if (editingCategoryRef.current && !editingCategoryRef.current.contains(e.target)) {
        setEditingCategoryId(null);
        setEditingCategoryName('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [editingCategoryId]);

  const toggleCategory = (catId) => {
    setCollapsedCategories(prev => {
      const next = new Set(prev);
      next.has(catId) ? next.delete(catId) : next.add(catId);
      return next;
    });
  };

  const handleOpenAddForm = () => {
    setFormState({ name: '', category: categories[0]?.id || '', price: '', description: '', image: '' });
    setEditingId(null);
    setErrors({});
    setShowItemForm(true);
  };

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
        const hours = Array.isArray(cafeData.hours) && cafeData.hours.length > 0
          ? cafeData.hours
          : DEFAULT_HOURS;
        setCafeDetails({ ...cafeData, hours });
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
        .select('*, categories(id, name)')

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
      const hoursForDB = (cafeDetails.hours || []).filter(h => h.day.trim() && h.time.trim());
      const dataToSave = { ...cafeDetails, hours: hoursForDB };
      if (cafeDetails.id) {
        // Update existing
        result = await supabase
          .from('cafeDetails')
          .update(dataToSave)
          .eq('id', cafeDetails.id);
      } else {
        // Insert new
        result = await supabase
          .from('cafeDetails')
          .insert([dataToSave])
          .select()
          .single();

        if (result.data) {
          setCafeDetails(prev => ({ ...prev, id: result.data.id }));
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
      setShowItemForm(false);
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
      category: String(item.category_id),
      price: item.price,
      description: item.description || '',
      image: item.image || ''
    });
    setEditingId(item.id);
    setErrors({});
    setShowItemForm(true);
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
    setShowItemForm(false);
  };

  // Get category name by id
  const getCategoryName = (categoryId) => {
    return categories.find(cat => cat.id === categoryId)?.name || 'Unknown';
  };

  if (isLoading) {
    return <CafeLoader fullScreen={true} message="Loading admin dashboard..." />;
  }


  const inputStyle = {
    borderColor: 'rgba(139,94,60,0.25)',
    background: 'rgba(139,94,60,0.03)',
    color: '#3d2010',
  };

  return (
    <div className="min-h-screen" style={{ background: '#FFF2D7' }}>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm" style={{ borderBottom: '1px solid rgba(139,94,60,0.12)' }}>
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-serif" style={{ color: '#8B5E3C' }}>Admin Dashboard</h1>
          <button
            onClick={() => { sessionStorage.removeItem('admin_authenticated'); navigate('/login'); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all hover:shadow-sm active:scale-95 cursor-pointer"
            style={{ background: 'rgba(139,94,60,0.08)', color: '#8B5E3C' }}
          >
            <LogOut className="w-4 h-4" />
            <span>Log out</span>
          </button>
        </div>
      </header>

      {/* Toasts */}
      {successMessage && (
        <div className="fixed top-4 right-4 left-4 sm:left-auto sm:w-auto z-50 bg-green-500 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span className="text-sm">{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="fixed top-4 right-4 left-4 sm:left-auto sm:w-auto z-50 bg-red-500 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="text-sm">{errorMessage}</span>
        </div>
      )}

      <main className="max-w-2xl mx-auto px-4 py-6 pb-16 space-y-3">

        {/* Cafe Details */}
        <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6" style={{ border: '1px solid rgba(139,94,60,0.12)' }}>
          <h2 className="text-lg font-serif font-semibold mb-4" style={{ color: '#3d2010' }}>Cafe Details</h2>
          <div>
            <form onSubmit={handleSaveCafeDetails} className="space-y-4">
              {[
                { label: 'Name', field: 'name', placeholder: 'Cafe name' },
                { label: 'Slogan', field: 'slogan', placeholder: 'Your slogan' },
                { label: 'Address', field: 'address', placeholder: 'Street address' },
              ].map(({ label, field, placeholder }) => (
                <div key={field}>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#8B5E3C' }}>{label}</label>
                  <input
                    type="text"
                    value={cafeDetails[field] || ''}
                    onChange={(e) => handleCafeDetailsChange(field, e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm border outline-none transition-all"
                    style={inputStyle}
                    placeholder={placeholder}
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: '#8B5E3C' }}>Opening Hours</label>
                <div className="space-y-2">
                  {(cafeDetails.hours || []).map((h, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={h.day}
                        onChange={(e) => setCafeDetails(prev => { const hrs = [...prev.hours]; hrs[i] = { ...hrs[i], day: e.target.value }; return { ...prev, hours: hrs }; })}
                        disabled={isSaving}
                        placeholder="e.g. Mon – Fri"
                        className="w-28 shrink-0 px-3 py-2.5 rounded-xl text-sm border outline-none transition-all"
                        style={inputStyle}
                      />
                      <input
                        type="text"
                        value={h.time}
                        onChange={(e) => setCafeDetails(prev => { const hrs = [...prev.hours]; hrs[i] = { ...hrs[i], time: e.target.value }; return { ...prev, hours: hrs }; })}
                        disabled={isSaving}
                        placeholder="e.g. 8 am – 12 am"
                        className="flex-1 px-3 py-2.5 rounded-xl text-sm border outline-none transition-all"
                        style={inputStyle}
                      />
                    </div>
                  ))}

                </div>
              </div>
              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-3 rounded-xl text-white text-sm font-medium transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                style={{ backgroundColor: '#8B5E3C' }}
              >
                {isSaving && <Loader className="w-4 h-4 animate-spin" />}
                Save Details
              </button>
            </form>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6" style={{ border: '1px solid rgba(139,94,60,0.12)' }}>
          <div className="flex items-center justify-between gap-2 mb-4">
            <h2 className="text-lg font-serif font-semibold min-w-0" style={{ color: '#3d2010' }}>
              Categories
              <span className="ml-1.5 text-sm font-sans font-normal" style={{ color: 'rgba(139,94,60,0.5)' }}>({categories.length})</span>
            </h2>
            <button
              onClick={() => { setShowCategoryForm(v => !v); setNewCategory(''); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-white text-sm font-medium shadow-sm hover:shadow-md transition-all active:scale-95 shrink-0 cursor-pointer"
              style={{ backgroundColor: '#8B5E3C' }}
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <input
              type="text"
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
              placeholder="Search categories..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border outline-none transition-all"
              style={{ borderColor: 'rgba(139,94,60,0.2)', background: 'rgba(139,94,60,0.02)', color: '#3d2010' }}
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color: 'rgba(139,94,60,0.4)' }}>
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            {categorySearch && (
              <button onClick={() => setCategorySearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" style={{ color: 'rgba(139,94,60,0.4)' }}>
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {showCategoryForm && (
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { handleAddCategory(); setShowCategoryForm(false); } if (e.key === 'Escape') setShowCategoryForm(false); }}
                disabled={isSaving}
                autoFocus
                className="flex-1 px-4 py-2.5 rounded-xl text-sm border outline-none transition-all disabled:opacity-50"
                style={inputStyle}
                placeholder="New category name"
              />
              <button
                onClick={() => { handleAddCategory(); setShowCategoryForm(false); }}
                disabled={isSaving}
                className="px-4 py-2.5 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:shadow-md transition-all"
                style={{ backgroundColor: '#8B5E3C' }}
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowCategoryForm(false)}
                disabled={isSaving}
                className="px-3 py-2.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
                style={{ background: 'rgba(139,94,60,0.08)', color: '#8B5E3C' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="space-y-2 mb-4">
            {(() => {
              const filtered = categories.filter(c => c.name.toLowerCase().includes(categorySearch.toLowerCase()));
              const LIMIT = 4;
              const visible = (showAllCategories || categorySearch) ? filtered : filtered.slice(0, LIMIT);
              const hidden = filtered.length - LIMIT;
              return (
                <>
                  {visible.map((category) => (
                    <div key={category.id} ref={editingCategoryId === category.id ? editingCategoryRef : null} className="flex items-center gap-2 px-3 py-2.5 rounded-xl border" style={{ borderColor: 'rgba(139,94,60,0.15)', background: 'rgba(139,94,60,0.02)' }}>
                      {editingCategoryId === category.id ? (
                        <>
                          <input
                            type="text"
                            value={editingCategoryName}
                            onChange={(e) => setEditingCategoryName(e.target.value)}
                            className="flex-1 px-2 py-1 text-sm rounded-lg border outline-none"
                            style={{ borderColor: 'rgba(139,94,60,0.3)', color: '#3d2010' }}
                            autoFocus
                          />
                          <button onClick={() => handleUpdateCategory(category.id)} disabled={isSaving} className="p-1.5 rounded-lg hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                            <Check className="w-4 h-4 text-green-600" />
                          </button>
                          <button onClick={() => setEditingCategoryId(null)} disabled={isSaving} className="p-1.5 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                            <X className="w-4 h-4 text-gray-400" />
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="flex-1 text-sm font-medium truncate" style={{ color: '#3d2010' }}>{category.name}</span>
                          <button onClick={() => { setEditingCategoryId(category.id); setEditingCategoryName(category.name); }} disabled={isSaving} className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors shrink-0" style={{ background: 'rgba(139,94,60,0.1)', color: '#8B5E3C' }}>
                            <Edit2 className="w-3 h-3" />
                            Edit
                          </button>
                          <button onClick={() => handleDeleteCategory(category.id)} disabled={isSaving} className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium bg-red-50 text-red-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors shrink-0">
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                  {!categorySearch && filtered.length > LIMIT && (
                    <button
                      onClick={() => setShowAllCategories(v => !v)}
                      className="w-full pt-2 pb-1 text-xs font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      style={{ color: 'rgba(139,94,60,0.55)' }}
                    >
                      {showAllCategories ? (
                        <><ChevronUp className="w-3.5 h-3.5" /> Show less</>
                      ) : (
                        <><ChevronDown className="w-3.5 h-3.5" /> {hidden} more {hidden === 1 ? 'category' : 'categories'}</>
                      )}
                    </button>
                  )}
                </>
              );
            })()}
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6" style={{ border: '1px solid rgba(139,94,60,0.12)' }}>
          <div className="flex items-center justify-between gap-2 mb-4">
            <h2 className="text-lg font-serif font-semibold min-w-0" style={{ color: '#3d2010' }}>
              Menu Items
              <span className="ml-1.5 text-sm font-sans font-normal" style={{ color: 'rgba(139,94,60,0.5)' }}>({menuItems.length})</span>
            </h2>
            <button
              onClick={handleOpenAddForm}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-white text-sm font-medium shadow-sm hover:shadow-md transition-all active:scale-95 shrink-0 cursor-pointer"
              style={{ backgroundColor: '#8B5E3C' }}
            >
              <Plus className="w-4 h-4" />
              <span>Add Item</span>
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border outline-none transition-all"
              style={{ borderColor: 'rgba(139,94,60,0.2)', background: 'rgba(139,94,60,0.02)', color: '#3d2010' }}
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color: 'rgba(139,94,60,0.4)' }}>
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" style={{ color: 'rgba(139,94,60,0.4)' }}>
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {menuItems.length > 0 ? (
            <>
              {(() => {
                const LIMIT = 5;
                const filtered = searchQuery.trim()
                  ? menuItems.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  : menuItems;
                if (filtered.length === 0) return (
                  <div className="text-center py-10">
                    <p className="text-sm" style={{ color: 'rgba(139,94,60,0.45)' }}>No items match "{searchQuery}"</p>
                  </div>
                );
                const visible = (showAllItems || searchQuery) ? filtered : filtered.slice(0, LIMIT);
                const hidden = filtered.length - LIMIT;
                return (
                  <>
                    <div className="space-y-2">
                      {visible.map((item) => (
                        <div key={item.id} className="flex items-center gap-2 px-3 py-2.5 rounded-xl border" style={{ borderColor: 'rgba(139,94,60,0.15)', background: 'rgba(139,94,60,0.02)' }}>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium truncate block" style={{ color: '#3d2010' }}>{item.name}</span>
                            <span className="text-xs" style={{ color: '#8B5E3C' }}>{item.categories?.name} · {item.price} lei</span>
                          </div>
                          <button
                            onClick={() => handleEditItem(item)}
                            disabled={isSaving}
                            className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors shrink-0"
                            style={{ background: 'rgba(139,94,60,0.1)', color: '#8B5E3C' }}
                          >
                            <Edit2 className="w-3 h-3" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            disabled={isSaving}
                            className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium bg-red-50 text-red-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors shrink-0"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                    {!searchQuery && filtered.length > LIMIT && (
                      <button
                        onClick={() => setShowAllItems(v => !v)}
                        className="w-full pt-3 pb-1 text-xs font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        style={{ color: 'rgba(139,94,60,0.55)' }}
                      >
                        {showAllItems ? (
                          <><ChevronUp className="w-3.5 h-3.5" /> Show less</>
                        ) : (
                          <><ChevronDown className="w-3.5 h-3.5" /> {hidden} more items</>
                        )}
                      </button>
                    )}
                  </>
                );
              })()}
            </>
          ) : (
            <div className="text-center py-10">
              <p className="text-sm" style={{ color: 'rgba(139,94,60,0.45)' }}>No items yet. Tap "Add Item" to get started.</p>
            </div>
          )}
        </div>

      </main>

      {/* Add / Edit Modal */}
      {showItemForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
            onClick={() => { if (!isSaving) handleCancelEdit(); }}
          />
          <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 max-h-[92vh] overflow-y-auto" style={{ zIndex: 1 }}>
            <div className="sm:hidden w-10 h-1 rounded-full bg-gray-200 mx-auto mb-5" />
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-serif" style={{ color: '#8B5E3C' }}>
                {editingId ? 'Edit Item' : 'New Item'}
              </h3>
              <button onClick={() => { if (!isSaving) handleCancelEdit(); }} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSubmitItem} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#8B5E3C' }}>Name *</label>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  disabled={isSaving}
                  className="w-full px-4 py-3 rounded-xl text-sm border outline-none transition-all disabled:opacity-50"
                  style={{ ...inputStyle, borderColor: errors.name ? '#f87171' : 'rgba(139,94,60,0.25)' }}
                  placeholder="e.g., Cappuccino"
                  autoFocus
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#8B5E3C' }}>Category *</label>
                  <select
                    value={formState.category}
                    onChange={(e) => handleFormChange('category', e.target.value)}
                    disabled={isSaving || categories.length === 0}
                    className="w-full px-4 py-3 rounded-xl text-sm border outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    style={{ ...inputStyle, borderColor: errors.category ? '#f87171' : 'rgba(139,94,60,0.25)' }}
                  >
                    <option value="">Category</option>
                    {categories.map(cat => <option key={cat.id} value={String(cat.id)}>{cat.name}</option>)}
                  </select>
                  {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#8B5E3C' }}>Price *</label>
                  <input
                    type="text"
                    value={formState.price}
                    onChange={(e) => handleFormChange('price', e.target.value)}
                    disabled={isSaving}
                    className="w-full px-4 py-3 rounded-xl text-sm border outline-none transition-all disabled:opacity-50"
                    style={{ ...inputStyle, borderColor: errors.price ? '#f87171' : 'rgba(139,94,60,0.25)' }}
                    placeholder="e.g., 12"
                  />
                  {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#8B5E3C' }}>Description</label>
                <textarea
                  value={formState.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  disabled={isSaving}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl text-sm border outline-none transition-all resize-none disabled:opacity-50"
                  style={inputStyle}
                  placeholder="Short description"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-3 rounded-xl text-white text-sm font-medium transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#8B5E3C' }}
                >
                  {isSaving ? <Loader className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  {editingId ? 'Save Changes' : 'Add Item'}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="px-5 py-3 rounded-xl text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CafeAdmin;
