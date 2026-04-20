import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, Wallet, CreditCard, TrendingUp, Settings, Plus, Landmark, Users } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import './Layout.css';

const Layout = () => {
  const navigate = useNavigate();
  // Get active profile (for now just the first one)
  const profile = useLiveQuery(() => db.profiles.toCollection().first());

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/dashboard/revenus', label: 'Revenus', icon: Wallet },
    { to: '/dashboard/charges', label: 'Charges', icon: CreditCard },
    { to: '/dashboard/credits', label: 'Crédits', icon: Landmark },
    { to: '/dashboard/epargne', label: 'Épargne', icon: TrendingUp },
    { to: '/dashboard/herricount', label: 'Herricount', icon: Users },
    { to: '/dashboard/parametres', label: 'Paramètres', icon: Settings }
  ];

  if (!profile) {
    // Handling case where data is loading, or user hasn't onboarded
    return <div className="app-layout" style={{justifyContent: 'center', alignItems: 'center'}}>Chargement...</div>;
  }

  return (
    <div className="app-layout">
      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Herribudget</Link>
        </div>
        <nav className="sidebar-nav">
          {navLinks.map(link => (
            <NavLink 
              key={link.to} 
              to={link.to} 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <link.icon size={20} />
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-profile" onClick={() => navigate('/dashboard/parametres')}>
           <div className="profile-avatar">
             {profile.name ? profile.name.charAt(0).toUpperCase() : 'M'}
           </div>
           <div>
             <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{profile.name}</p>
             <p style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>Gestion locale</p>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Floating Action Button */}
      <button className="fab" aria-label="Ajouter une dépense" onClick={() => alert('Modal ajout rapide (Mock)')}>
        <Plus size={24} />
      </button>

      {/* Mobile Bottom Nav */}
      <nav className="bottom-nav">
        <div className="bottom-nav-inner">
          {navLinks.map(link => (
            <NavLink 
              key={link.to} 
              to={link.to} 
              className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
            >
              <link.icon size={20} />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
