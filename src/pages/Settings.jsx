import React, { useState, useEffect } from 'react';
import { Shield, Download, RefreshCw, User, LogOut, ChevronRight } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import './Settings.css';

const SettingsPage = () => {
  const profile = useLiveQuery(() => db.profiles.toCollection().first());
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (profile) {
      setUserName(profile.name);
    }
  }, [profile]);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await db.profiles.update(profile.id, { name: userName });
      alert('Profil mis à jour !');
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleResetData = async () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer TOUTES vos données ? Cette action est irréversible et tout est stocké uniquement sur VOTRE appareil.')) {
      await db.delete();
      localStorage.clear();
      window.location.href = '/';
    }
  };

  if (!profile) return <div>Chargement...</div>;

  return (
    <div className="settings-page">
      <header className="settings-header">
        <h1>Paramètres</h1>
        <div className="privacy-badge">
          <Shield size={16} />
          Données 100% Locales
        </div>
      </header>

      <div className="settings-container">
        {/* Profile Section */}
        <section className="settings-section card">
          <div className="section-title">
            <User size={20} />
            <h2>Mon Profil</h2>
          </div>
          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label className="form-label">Votre nom ou pseudonyme</label>
              <input 
                type="text" 
                className="form-control" 
                value={userName} 
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Ex: Moi"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Type de gestion</label>
              <div className="static-field">
                {profile.type === 'solo' ? 'Gestion Solo' : 'Gestion Commune'}
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={isUpdating}>
              {isUpdating ? 'Mise à jour...' : 'Sauvegarder les modifications'}
            </button>
          </form>
        </section>

        {/* Installation Section */}
        <section className="settings-section card">
          <div className="section-title">
            <Download size={20} />
            <h2>Installation de l'application</h2>
          </div>
          <div className="install-info">
            <p>Pour une expérience optimale et un accès hors-ligne, installez Herribudget sur votre appareil.</p>
            {deferredPrompt ? (
              <button onClick={handleInstall} className="btn btn-primary install-btn">
                <Download size={18} />
                Installer maintenant
              </button>
            ) : (
              <div className="install-status">
                <div className="status-badge success">Application installée ou déjà intégrée</div>
                <p className="hint">Si vous ne voyez pas le bouton, l'application est probablement déjà installée ou votre navigateur ne supporte pas l'installation automatique.</p>
              </div>
            )}
          </div>
        </section>

        {/* Data Management Section */}
        <section className="settings-section card">
          <div className="section-title">
            <RefreshCw size={20} />
            <h2>Gestion des données</h2>
          </div>
          <div className="data-actions">
            <div className="action-item">
              <div className="action-info">
                <h3>Exporter mes données</h3>
                <p>Téléchargez une copie de toutes vos données au format JSON.</p>
              </div>
              <button className="btn btn-outline" onClick={() => alert('Fonctionnalité prévue prochainement.')}>
                Exporter
              </button>
            </div>
            
            <div className="action-item danger">
              <div className="action-info">
                <h3>Réinitialiser l'application</h3>
                <p>Supprime définitivement toutes les données d'Herribudget sur cet appareil.</p>
              </div>
              <button onClick={handleResetData} className="btn btn-outline-danger">
                Réinitialiser tout
              </button>
            </div>
          </div>
        </section>

        {/* Legal/About Section */}
        <section className="settings-section card legacy-section">
           <div className="legacy-item" onClick={() => window.open('/cgu', '_blank')}>
             <span>Conditions Générales d'Utilisation</span>
             <ChevronRight size={18} />
           </div>
           <div className="legacy-item" onClick={() => window.location.href = '/'}>
             <LogOut size={18} />
             <span>Retour à la Landing Page</span>
           </div>
        </section>
      </div>

      <footer className="settings-footer">
        <p>Herribudget v1.0.0 — Un projet Herrichain developed by Artean Digital</p>
      </footer>
    </div>
  );
};

export default SettingsPage;
