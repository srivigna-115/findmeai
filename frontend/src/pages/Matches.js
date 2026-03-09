import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, accepted
  const navigate = useNavigate();

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/matches`);
      console.log('Matches data received:', res.data.matches);
      if (res.data.matches && res.data.matches.length > 0) {
        console.log('First match lost item imageUrl:', res.data.matches[0].lostItem?.imageUrl);
        console.log('First match found item imageUrl:', res.data.matches[0].foundItem?.imageUrl);
      }
      setMatches(res.data.matches || []);
    } catch (error) {
      toast.error('Failed to load matches');
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const openChat = (chatRoomId) => {
    navigate(`/chat/${chatRoomId}`);
  };

  const getMatchScore = (score) => {
    const percentage = Math.round(score * 100);
    let color = '#e74c3c';
    if (percentage >= 80) color = '#27ae60';
    else if (percentage >= 70) color = '#f39c12';
    return { percentage, color };
  };

  const filteredMatches = matches.filter(match => {
    if (filter === 'all') return true;
    return match.status === filter;
  });

  if (loading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 2rem', textAlign: 'center' }}>
        <h2>Loading matches...</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>Your Matches</h1>
        <p style={{ color: '#7f8c8d' }}>
          {matches.length === 0 
            ? 'No matches found yet. Post items to find matches!' 
            : `Found ${matches.length} match${matches.length !== 1 ? 'es' : ''}`}
        </p>
      </div>

      {matches.length > 0 && (
        <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              backgroundColor: filter === 'all' ? '#3498db' : '#ecf0f1',
              color: filter === 'all' ? 'white' : '#2c3e50',
              transition: 'all 0.2s'
            }}
          >
            All ({matches.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              backgroundColor: filter === 'pending' ? '#3498db' : '#ecf0f1',
              color: filter === 'pending' ? 'white' : '#2c3e50',
              transition: 'all 0.2s'
            }}
          >
            Pending ({matches.filter(m => m.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('accepted')}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              backgroundColor: filter === 'accepted' ? '#3498db' : '#ecf0f1',
              color: filter === 'accepted' ? 'white' : '#2c3e50',
              transition: 'all 0.2s'
            }}
          >
            Accepted ({matches.filter(m => m.status === 'accepted').length})
          </button>
        </div>
      )}

      {filteredMatches.length === 0 ? (
        <div style={{
          background: 'white',
          padding: '3rem',
          borderRadius: '8px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
          <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>
            {filter === 'all' ? 'No matches yet' : `No ${filter} matches`}
          </h3>
          <p style={{ color: '#7f8c8d', marginBottom: '1.5rem' }}>
            {filter === 'all' 
              ? 'Post lost or found items to get AI-powered matches!'
              : `You don't have any ${filter} matches at the moment.`}
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
              fontSize: '1rem',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
          >
            Post an Item
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {filteredMatches.map((match) => {
            const { percentage, color } = getMatchScore(match.matchScore);
            
            return (
              <div
                key={match._id}
                style={{
                  background: 'white',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.85rem',
                        fontWeight: '500',
                        backgroundColor: match.status === 'pending' ? '#fff3cd' : '#d4edda',
                        color: match.status === 'pending' ? '#856404' : '#155724'
                      }}>
                        {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                      </span>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.85rem',
                        fontWeight: '500',
                        backgroundColor: match.matchType === 'image' ? '#e3f2fd' : '#f3e5f5',
                        color: match.matchType === 'image' ? '#1565c0' : '#6a1b9a'
                      }}>
                        {match.matchType === 'image' ? '📷 Image Match' : '📝 Text Match'}
                      </span>
                    </div>
                    <p style={{ color: '#7f8c8d', fontSize: '0.9rem', margin: 0 }}>
                      Matched on {format(new Date(match.createdAt), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: color
                    }}>
                      {percentage}%
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#7f8c8d' }}>
                      Match Score
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto 1fr',
                  gap: '1.5rem',
                  alignItems: 'center',
                  marginBottom: '1.5rem'
                }}>
                  {/* Lost Item */}
                  <div style={{
                    padding: '1rem',
                    backgroundColor: '#fff3e0',
                    borderRadius: '8px',
                    border: '2px solid #ff9800'
                  }}>
                    <div style={{
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      color: '#e65100',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Lost Item
                    </div>
                    <div style={{
                      marginBottom: '0.75rem',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      border: '1px solid #ffb74d',
                      backgroundColor: '#ffe0b2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '150px'
                    }}>
                      {match.lostItem?.imageUrl ? (
                        <img 
                          src={match.lostItem.imageUrl.startsWith('http') ? match.lostItem.imageUrl : `http://localhost:5000${match.lostItem.imageUrl}`}
                          alt={match.lostItem.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block'
                          }}
                        />
                      ) : (
                        <div style={{ fontSize: '3rem' }}>📷</div>
                      )}
                    </div>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>
                      {match.lostItem?.title || 'N/A'}
                    </h3>
                    <p style={{
                      margin: '0 0 0.5rem 0',
                      color: '#7f8c8d',
                      fontSize: '0.9rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {match.lostItem?.description || 'No description'}
                    </p>
                    <div style={{ fontSize: '0.85rem', color: '#95a5a6' }}>
                      <div>📍 {match.lostItem?.location?.address || 'Unknown'}</div>
                      <div>📅 {match.lostItem?.date ? format(new Date(match.lostItem.date), 'MMM dd, yyyy') : 'N/A'}</div>
                      <div style={{ marginTop: '0.5rem', fontWeight: '500', color: '#7f8c8d' }}>
                        Posted by: {match.lostUser?.name || 'Unknown'}
                      </div>
                    </div>
                  </div>

                  {/* Match Icon */}
                  <div style={{
                    fontSize: '2rem',
                    color: color
                  }}>
                    ⟷
                  </div>

                  {/* Found Item */}
                  <div style={{
                    padding: '1rem',
                    backgroundColor: '#e8f5e9',
                    borderRadius: '8px',
                    border: '2px solid #4caf50'
                  }}>
                    <div style={{
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      color: '#2e7d32',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Found Item
                    </div>
                    <div style={{
                      marginBottom: '0.75rem',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      border: '1px solid #81c784',
                      backgroundColor: '#c8e6c9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '150px'
                    }}>
                      {match.foundItem?.imageUrl ? (
                        <img 
                          src={match.foundItem.imageUrl.startsWith('http') ? match.foundItem.imageUrl : `http://localhost:5000${match.foundItem.imageUrl}`}
                          alt={match.foundItem.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block'
                          }}
                        />
                      ) : (
                        <div style={{ fontSize: '3rem' }}>📷</div>
                      )}
                    </div>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>
                      {match.foundItem?.title || 'N/A'}
                    </h3>
                    <p style={{
                      margin: '0 0 0.5rem 0',
                      color: '#7f8c8d',
                      fontSize: '0.9rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {match.foundItem?.description || 'No description'}
                    </p>
                    <div style={{ fontSize: '0.85rem', color: '#95a5a6' }}>
                      <div>📍 {match.foundItem?.location?.address || 'Unknown'}</div>
                      <div>📅 {match.foundItem?.date ? format(new Date(match.foundItem.date), 'MMM dd, yyyy') : 'N/A'}</div>
                      <div style={{ marginTop: '0.5rem', fontWeight: '500', color: '#7f8c8d' }}>
                        Posted by: {match.foundUser?.name || 'Unknown'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => openChat(match.chatRoomId)}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#3498db',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '500',
                      transition: 'background-color 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
                  >
                    💬 Open Chat
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Matches;
