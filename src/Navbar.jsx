import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css'; // Import your custom CSS file for styling

const navItems = ['Home', 'Create', 'View'];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const navLinks = (
    <div style={{ display: 'flex', marginLeft: 'auto' }}>
      {navItems.map((item) => (
        <Link key={item} to={`/${item.toLowerCase()}`} style={{ textDecoration: 'none' }}>
          <button style={{ color: '#000', marginRight: 16, background: 'none', border: 'none' }} className='nav-links'>
            {item}
          </button>
        </Link>
      ))}
    </div>
  );

  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '8px 16px', borderBottom: '1px solid #ccc' }}>
      <button
        onClick={handleDrawerToggle}
        style={{ marginRight: 16, display: 'none', // add your own media query for showing/hiding on smaller screens
        }}
      >
        ☰
      </button>
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <h2 style={{ margin: 0 }}>Firebase React</h2>
      </Link>
      {navLinks}
    </div>
  );
};

export default Navbar;
