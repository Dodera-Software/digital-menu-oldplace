import React, { useState, useEffect, useRef } from 'react';
import {
  Trash2, Plus, Edit2, X, Check, AlertCircle, Upload, Loader, ChevronDown, ChevronRight, ChevronUp, LogOut,
  Coffee, Leaf, Flame, CupSoda, Sparkles, Beer, Wine, FlaskConical, Zap, GlassWater, Cookie, Sandwich, Utensils,
  Martini, Pizza, Milk, Citrus, Croissant, CakeSlice, Soup, Salad, Beef, Drumstick, Fish, IceCream2
} from 'lucide-react';
import { CafeLoader } from '../loader/CafeLoader'
import { useNavigate } from 'react-router';
import supabase from '../../utils/supabase'
import { adminCall, adminUploadImage, clearSession } from '../../utils/adminApi'

const AVAILABLE_ICONS = [
  // Drinks
  { name: 'Coffee', component: Coffee },
  { name: 'Martini', component: Martini },
  { name: 'Beer', component: Beer },
  { name: 'Wine', component: Wine },
  { name: 'CupSoda', component: CupSoda },
  { name: 'GlassWater', component: GlassWater },
  { name: 'FlaskConical', component: FlaskConical },
  { name: 'Milk', component: Milk },
  { name: 'Citrus', component: Citrus },
  { name: 'Leaf', component: Leaf },
  { name: 'Flame', component: Flame },
  { name: 'Sparkles', component: Sparkles },
  { name: 'Zap', component: Zap },
  // Food
  { name: 'Pizza', component: Pizza },
  { name: 'Sandwich', component: Sandwich },
  { name: 'Cookie', component: Cookie },
  { name: 'Croissant', component: Croissant },
  { name: 'CakeSlice', component: CakeSlice },
  { name: 'Soup', component: Soup },
  { name: 'Salad', component: Salad },
  { name: 'Beef', component: Beef },
  { name: 'Drumstick', component: Drumstick },
  { name: 'Fish', component: Fish },
  { name: 'IceCream2', component: IceCream2 },
  { name: 'Utensils', component: Utensils },
];
const ICON_MAP_ADMIN = Object.fromEntries(AVAILABLE_ICONS.map(i => [i.name, i.component]));

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

  const [newCategoryIcon, setNewCategoryIcon] = useState('Utensils');
  const [editingCategoryIcon, setEditingCategoryIcon] = useState('Utensils');
  const [confirmDelete, setConfirmDelete] = useState(null); // { type: 'category'|'item', id, name }

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
        .order('id', { ascending: true });

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

      const hoursForDB = (cafeDetails.hours || []).filter(h => h.day.trim() && h.time.trim());
      const dataToSave = { ...cafeDetails, hours: hoursForDB };
      const saved = await adminCall('saveCafeDetails', { payload: dataToSave });
      if (saved?.id) {
        setCafeDetails(prev => ({ ...prev, id: saved.id }));
      }
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

      // Upload via the admin API (server mints a one-time signed upload URL).
      const imageUrl = await adminUploadImage(file);

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
    const trimmed = editingCategoryName.trim();
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
      const data = await adminCall('addCategory', { name: trimmed, icon: editingCategoryIcon });

      setCategories([...categories, data]);
      setEditingCategoryName('');
      setEditingCategoryIcon('Utensils');
      setShowCategoryForm(false);
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

      await adminCall('updateCategory', { id, name: trimmed, icon: editingCategoryIcon });

      setCategories(categories.map(cat =>
        cat.id === id ? { ...cat, name: trimmed, icon: editingCategoryIcon } : cat
      ));
      setEditingCategoryId(null);
      setEditingCategoryName('');
      setEditingCategoryIcon('Utensils');
      setShowCategoryForm(false);
      showSuccess('Category updated!');
    } catch (error) {
      console.error('Error updating category:', error);
      setErrorMessage(error.message || 'Failed to update category');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = (id) => {
    const cat = categories.find(c => c.id === id);
    setConfirmDelete({ type: 'category', id, name: cat?.name || 'this category' });
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
        await adminCall('updateItem', { id: editingId, item: itemData });

        setMenuItems(menuItems.map(item =>
          item.id === editingId
            ? { ...item, ...itemData }
            : item
        ));
        showSuccess('Item updated successfully!');
      } else {
        // Add new item
        const data = await adminCall('addItem', { item: itemData });

        setMenuItems([data, ...menuItems].map(item => item.id === data.id
          ? { ...item, categories: categories.find(c => String(c.id) === String(data.category_id)) || null }
          : item
        ));
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

  const handleDeleteItem = (id) => {
    const item = menuItems.find(i => i.id === id);
    setConfirmDelete({ type: 'item', id, name: item?.name || 'this item' });
  };

  const doDelete = async () => {
    if (!confirmDelete) return;
    const { type, id } = confirmDelete;
    setConfirmDelete(null);
    try {
      setIsSaving(true);
      setErrorMessage('');
      if (type === 'category') {
        await adminCall('deleteCategory', { id });
        setCategories(prev => prev.filter(c => c.id !== id));
        // Items in this category were removed too (ON DELETE CASCADE).
        setMenuItems(prev => prev.filter(i => i.category_id !== id));
        showSuccess('Category deleted!');
      } else {
        await adminCall('deleteItem', { id });
        setMenuItems(prev => prev.filter(i => i.id !== id));
        showSuccess('Item deleted!');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      setErrorMessage(error.message || 'Failed to delete');
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
            onClick={() => { clearSession(); navigate('/login'); }}
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
              onClick={() => { setEditingCategoryId(null); setEditingCategoryName(''); setEditingCategoryIcon('Utensils'); setShowCategoryForm(true); }}
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

          <div className="space-y-2 mb-4">
            {(() => {
              const filtered = categories.filter(c => c.name.toLowerCase().includes(categorySearch.toLowerCase()));
              const LIMIT = 4;
              const visible = (showAllCategories || categorySearch) ? filtered : filtered.slice(0, LIMIT);
              const hidden = filtered.length - LIMIT;
              return (
                <>
                  {visible.map((category) => (
                    <div key={category.id}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl border"
                      style={{ borderColor: 'rgba(139,94,60,0.15)', background: 'rgba(139,94,60,0.02)' }}>
                      <span className="flex-1 text-sm font-medium truncate flex items-center gap-2" style={{ color: '#3d2010' }}>
                        {(() => { const IC = ICON_MAP_ADMIN[category.icon]; return IC ? <IC className="w-3.5 h-3.5 shrink-0" style={{ color: '#8B5E3C' }} /> : null; })()}
                        {category.name}
                      </span>
                      <button onClick={() => { setEditingCategoryId(category.id); setEditingCategoryName(category.name); setEditingCategoryIcon(category.icon || 'Utensils'); setShowCategoryForm(true); }} disabled={isSaving} className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors shrink-0" style={{ background: 'rgba(139,94,60,0.1)', color: '#8B5E3C' }}>
                        <Edit2 className="w-3 h-3" />
                        Edit
                      </button>
                      <button onClick={() => handleDeleteCategory(category.id)} disabled={isSaving} className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium bg-red-50 text-red-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors shrink-0">
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
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

      {/* Add / Edit Category Modal */}
      {showCategoryForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
            onClick={() => { if (!isSaving) { setShowCategoryForm(false); setEditingCategoryId(null); } }}
          />
          <div className="relative w-full sm:max-w-sm bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-6" style={{ zIndex: 1 }}>
            <div className="sm:hidden w-10 h-1 rounded-full bg-gray-200 mx-auto mb-5" />
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-serif" style={{ color: '#8B5E3C' }}>
                {editingCategoryId ? 'Edit Category' : 'New Category'}
              </h3>
              <button
                onClick={() => { if (!isSaving) { setShowCategoryForm(false); setEditingCategoryId(null); } }}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#8B5E3C' }}>Name *</label>
                <input
                  type="text"
                  value={editingCategoryName}
                  onChange={(e) => setEditingCategoryName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Escape' && !isSaving) { setShowCategoryForm(false); setEditingCategoryId(null); } }}
                  disabled={isSaving}
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl text-sm border outline-none transition-all disabled:opacity-50"
                  style={inputStyle}
                  placeholder="e.g., Cocktails"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: '#8B5E3C' }}>Icon</label>
                <div className="grid grid-cols-5 gap-2">
                  {AVAILABLE_ICONS.map(({ name, component: Icon }) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setEditingCategoryIcon(name)}
                      title={name}
                      className="flex flex-col items-center gap-1 p-2.5 rounded-xl transition-all cursor-pointer"
                      style={{
                        background: editingCategoryIcon === name ? 'rgba(139,94,60,0.1)' : 'transparent',
                        border: `1.5px solid ${editingCategoryIcon === name ? '#8B5E3C' : 'rgba(139,94,60,0.12)'}`,
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: editingCategoryIcon === name ? '#8B5E3C' : '#bbb' }} />
                      <span className="text-[9px] truncate w-full text-center leading-tight" style={{ color: editingCategoryIcon === name ? '#8B5E3C' : '#bbb' }}>{name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => editingCategoryId ? handleUpdateCategory(editingCategoryId) : handleAddCategory()}
                  disabled={isSaving}
                  className="flex-1 py-3 rounded-xl text-white text-sm font-medium transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#8B5E3C' }}
                >
                  {isSaving ? <Loader className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  {editingCategoryId ? 'Save Changes' : 'Add Category'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowCategoryForm(false); setEditingCategoryId(null); }}
                  disabled={isSaving}
                  className="px-5 py-3 rounded-xl text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer" onClick={() => setConfirmDelete(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm" style={{ border: '1px solid rgba(139,94,60,0.12)' }}>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-xl font-serif mb-1" style={{ color: '#3d2010' }}>
                Delete {confirmDelete.type === 'category' ? 'Category' : 'Item'}?
              </h3>
              <p className="text-sm mb-6" style={{ color: 'rgba(61,32,16,0.55)' }}>
                <span className="font-medium" style={{ color: '#3d2010' }}>&#34;{confirmDelete.name}&#34;</span> will be permanently removed and cannot be recovered.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-3 rounded-xl text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={doDelete}
                  className="flex-1 py-3 rounded-xl text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-all cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
