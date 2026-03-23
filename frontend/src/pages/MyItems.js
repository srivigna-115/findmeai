import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const MyItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, lost, found
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [lightboxImage, setLightboxImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyItems();
  }, []);

  const fetchMyItems = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/items/my-items`);
      setItems(res.data.items || []);
    } catch (error) {
      toast.error('Failed to load items');
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/items/${itemId}`);
      toast.success('Item deleted successfully');
      setItems(items.filter(item => item._id !== itemId));
    } catch (error) {
      toast.error('Failed to delete item');
      console.error('Error deleting item:', error);
    }
  };

  const startEdit = (item) => {
    setEditingItem(item._id);
    setEditForm({
      title: item.title,
      description: item.description,
      category: item.category,
      status: item.status
    });
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setEditForm({});
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveEdit = async (itemId) => {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/items/${itemId}`,
        editForm
      );
      toast.success('Item updated successfully');
      setItems(items.map(item => item._id === itemId ? res.data.item : item));
      setEditingItem(null);
      setEditForm({});
    } catch (error) {
      toast.error('Failed to update item');
      console.error('Error updating item:', error);
    }
  };

  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  if (loading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 2rem', textAlign: 'center' }}>
        <h2>Loading your items...</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 2rem' }}>
      {/* Image Lightbox Modal */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            cursor: 'pointer'
          }}
        >
          <img
            src={lightboxImage}
            alt="Full size"
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              objectFit: 'contain'
            }}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setLightboxImage(null)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              fontSize: '24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
        </div>
      )}

      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>My Items</h1>
          <p style={{ color: '#7f8c8d' }}>
            {items.length === 0 
              ? 'You haven\'t posted any items yet' 
              : `You have ${items.length} item${items.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          onClick={() => navigate('/post')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          + Post New Item
        </button>
      </div>

      {items.length > 0 && (
        <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              backgroundColor: filter === 'all' ? '#3498db' : '#ecf0f1',
              color: filter === 'all' ? 'white' : '#2c3e50'
            }}
          >
            All ({items.length})
          </button>
          <button
            onClick={() => setFilter('lost')}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              backgroundColor: filter === 'lost' ? '#e74c3c' : '#ecf0f1',
              color: filter === 'lost' ? 'white' : '#2c3e50'
            }}
          >
            Lost ({items.filter(i => i.type === 'lost').length})
          </button>
          <button
            onClick={() => setFilter('found')}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              backgroundColor: filter === 'found' ? '#27ae60' : '#ecf0f1',
              color: filter === 'found' ? 'white' : '#2c3e50'
            }}
          >
            Found ({items.filter(i => i.type === 'found').length})
          </button>
        </div>
      )}

      {filteredItems.length === 0 ? (
        <div style={{
          background: 'white',
          padding: '3rem',
          borderRadius: '8px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
          <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>
            {filter === 'all' ? 'No items yet' : `No ${filter} items`}
          </h3>
          <p style={{ color: '#7f8c8d', marginBottom: '1.5rem' }}>
            Post your first item to get started!
          </p>
          <button
            onClick={() => navigate('/post')}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Post an Item
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {filteredItems.map((item) => (
            <div
              key={item._id}
              style={{
                background: 'white',
                borderRadius: '8px',
                padding: '1.5rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: `2px solid ${item.type === 'lost' ? '#e74c3c' : '#27ae60'}`
              }}
            >
              {editingItem === item._id ? (
                // Edit Mode
                <div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Title</label>
                    <input
                      type="text"
                      name="title"
                      value={editForm.title}
                      onChange={handleEditChange}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description</label>
                    <textarea
                      name="description"
                      value={editForm.description}
                      onChange={handleEditChange}
                      rows="3"
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Category</label>
                    <select
                      name="category"
                      value={editForm.category}
                      onChange={handleEditChange}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }}
                    >
                      <option value="electronics">Electronics</option>
                      <option value="documents">Documents</option>
                      <option value="pets">Pets</option>
                      <option value="accessories">Accessories</option>
                      <option value="clothing">Clothing</option>
                      <option value="keys">Keys</option>
                      <option value="bags">Bags</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Status</label>
                    <select
                      name="status"
                      value={editForm.status}
                      onChange={handleEditChange}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }}
                    >
                      <option value="active">Active</option>
                      <option value="matched">Matched</option>
                      <option value="resolved">Resolved</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                      onClick={() => saveEdit(item._id)}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#27ae60',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#95a5a6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '1.5rem', alignItems: 'start' }}>
                  {/* Image */}
                  <div style={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '2px solid #ddd',
                    backgroundColor: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: item.imageUrl ? 'pointer' : 'default'
                  }}
                  onClick={() => item.imageUrl && setLightboxImage(`${process.env.REACT_APP_SOCKET_URL}${item.imageUrl}`)}
                  >
                    {item.imageUrl ? (
                      <img
                        src={`${process.env.REACT_APP_SOCKET_URL}${item.imageUrl}`}
                        alt={item.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          console.error('Item image failed:', e.target.src);
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<div style="font-size:3rem">❌</div>';
                        }}
                      />
                    ) : (
                      <div style={{ fontSize: '3rem' }}>📷</div>
                    )}
                  </div>

                  {/* Details */}
                  <div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.85rem',
                        fontWeight: '500',
                        backgroundColor: item.type === 'lost' ? '#fee' : '#efe',
                        color: item.type === 'lost' ? '#c00' : '#060'
                      }}>
                        {item.type.toUpperCase()}
                      </span>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.85rem',
                        fontWeight: '500',
                        backgroundColor: '#f0f0f0',
                        color: '#555'
                      }}>
                        {item.category}
                      </span>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.85rem',
                        fontWeight: '500',
                        backgroundColor: item.status === 'active' ? '#e3f2fd' : '#f3e5f5',
                        color: item.status === 'active' ? '#1565c0' : '#6a1b9a'
                      }}>
                        {item.status}
                      </span>
                    </div>
                    <h3 style={{ margin: '0.5rem 0', color: '#2c3e50' }}>{item.title}</h3>
                    <p style={{ margin: '0.5rem 0', color: '#7f8c8d' }}>{item.description}</p>
                    <div style={{ fontSize: '0.9rem', color: '#95a5a6', marginTop: '0.5rem' }}>
                      <div>📍 {item.location?.address || 'Unknown location'}</div>
                      <div>📅 {item.date ? format(new Date(item.date), 'MMM dd, yyyy') : 'N/A'}</div>
                      <div>🕒 Posted {format(new Date(item.createdAt), 'MMM dd, yyyy')}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button
                      onClick={() => startEdit(item)}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#3498db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyItems;
