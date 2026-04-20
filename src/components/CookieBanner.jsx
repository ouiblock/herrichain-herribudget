import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isAccepted = localStorage.getItem('cgu_accepted');
    if (!isAccepted) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cgu_accepted', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0, left: 0, right: 0,
      background: 'var(--color-bg)',
      borderTop: '1px solid var(--color-border)',
      padding: '1.5rem',
      boxShadow: '0 -10px 40px rgba(0,0,0,0.1)',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '2rem',
      flexWrap: 'wrap'
    }}>
      <div style={{ flex: 1, minWidth: '300px' }}>
        <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Gestion des cookies</h4>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', margin: 0, lineHeight: 1.5 }}>
          Herribudget utilise uniquement des cookies fonctionnels indispensables à son fonctionnement (mémorisation de vos préférences locales). Aucun cookie publicitaire ni analytique n'est utilisé. <span onClick={() => navigate('/privacy')} style={{color: 'var(--color-primary)', cursor: 'pointer', textDecoration: 'underline'}}>En savoir plus sur notre politique de confidentialité</span>.
        </p>
      </div>
      <div>
        <button className="btn btn-primary" onClick={handleAccept}>
          Accepter et continuer
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
