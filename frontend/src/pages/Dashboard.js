import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 2rem' }}>
      <h1 style={{ marginBottom: '2rem', color: '#2c3e50' }}>Welcome to FindMe</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#3498db', marginBottom: '1rem' }}>Post an Item</h2>
          <p style={{ marginBottom: '1rem', color: '#7f8c8d' }}>
            Lost or found something? Post it here and let our AI help you find matches.
          </p>
          <Link to="/post" style={{ 
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#3498db',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            transition: 'background-color 0.2s'
          }}>
            Post Item
          </Link>
        </div>

        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#9b59b6', marginBottom: '1rem' }}>My Items</h2>
          <p style={{ marginBottom: '1rem', color: '#7f8c8d' }}>
            View, edit, or delete the items you've posted.
          </p>
          <Link to="/my-items" style={{ 
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#9b59b6',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            transition: 'background-color 0.2s'
          }}>
            View My Items
          </Link>
        </div>

        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#27ae60', marginBottom: '1rem' }}>View Matches</h2>
          <p style={{ marginBottom: '1rem', color: '#7f8c8d' }}>
            Check if we found any matches for your lost or found items.
          </p>
          <Link to="/matches" style={{ 
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#27ae60',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            transition: 'background-color 0.2s'
          }}>
            View Matches
          </Link>
        </div>

        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#e67e22', marginBottom: '1rem' }}>Notifications</h2>
          <p style={{ marginBottom: '1rem', color: '#7f8c8d' }}>
            Stay updated with notifications about matches and messages.
          </p>
          <Link to="/notifications" style={{ 
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#e67e22',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            transition: 'background-color 0.2s'
          }}>
            View Notifications
          </Link>
        </div>
      </div>

      <div style={{ marginTop: '3rem', background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginBottom: '1rem', color: '#2c3e50' }}>How It Works</h2>
        <ol style={{ lineHeight: '2', color: '#7f8c8d' }}>
          <li>Post your lost or found item with a photo, text description, or voice recording</li>
          <li>Our AI automatically searches for matches using advanced image and text analysis</li>
          <li>Get instant notifications when a potential match is found</li>
          <li>Chat in real-time with the other person to verify and arrange return</li>
        </ol>
      </div>
    </div>
  );
};

export default Dashboard;
