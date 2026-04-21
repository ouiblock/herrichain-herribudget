import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { TrendingUp, Plus, Trash2, Target, Pencil } from 'lucide-react';
import { db } from '../db';
import './Epargne.css';

const Epargne = () => {
  const profile = useLiveQuery(() => db.profiles.toCollection().first());
  const epargneList = useLiveQuery(() => db.epargne.toArray()) || [];
  const objectifsList = useLiveQuery(() => db.objectifs_epargne.toArray()) || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newObjectif, setNewObjectif] = useState({
    libelle: '', montantCible: '', dateCible: ''
  });

  const [editingObjectif, setEditingObjectif] = useState(null);

  const mainEpargne = epargneList.length > 0 ? epargneList[0] : null;

  const handleUpdateEpargne = async (amount) => {
    if (!mainEpargne) return;
    await db.epargne.update(mainEpargne.id, {
      capitalDisponible: Number(amount)
    });
  };

  const handleAddObjectif = async (e) => {
    e.preventDefault();
    if (!profile) return;
    await db.objectifs_epargne.add({
      profileId: profile.id,
      ...newObjectif,
      montantCible: Number(newObjectif.montantCible),
      progression: '0'
    });
    setIsModalOpen(false);
    setNewObjectif({ libelle: '', montantCible: '', dateCible: '' });
  };

  const handleEditObjectif = async (e) => {
    e.preventDefault();
    await db.objectifs_epargne.update(editingObjectif.id, {
      ...editingObjectif,
      montantCible: Number(editingObjectif.montantCible)
    });
    setEditingObjectif(null);
  };

  const handleDeleteObjectif = async (id) => {
    if(window.confirm('Supprimer cet objectif ?')) {
      await db.objectifs_epargne.delete(id);
    }
  };

  return (
    <div className="epargne-page">
      <div className="dashboard-header mb-8">
        <div>
          <h1>Mon Épargne</h1>
          <p style={{color: 'var(--color-text-light)'}}>Suivez la constitution de votre patrimoine localement.</p>
        </div>
      </div>

      <div className="card balance-card mb-8">
        <div className="wallet-icon-bg">
          <TrendingUp size={24} />
        </div>
        <div className="balance-label">CAPITAL DISPONIBLE (LIVRETS)</div>
        <div className="balance-amount" style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
          {mainEpargne ? (
            <input 
               type="number" 
               className="epargne-input-huge"
               value={mainEpargne.capitalDisponible}
               onChange={(e) => handleUpdateEpargne(e.target.value)}
            />
          ) : '0'} €
        </div>
        <p style={{fontSize: '0.875rem', opacity: 0.8}}>Modifier directement le montant pour mettre à jour.</p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3>Mes Objectifs</h3>
        <button className="btn btn-outline" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Nouvel objectif
        </button>
      </div>

      <div className="objectifs-grid">
        {objectifsList.map(obj => {
          // Progress simulation
          const progressPourcentage = Math.min(100, Math.max(0, ((mainEpargne?.capitalDisponible || 0) / obj.montantCible) * 100));
          return (
            <div key={obj.id} className="card objectif-card">
               <div className="flex justify-between items-start mb-4">
                 <div className="flex items-center gap-2">
                   <Target color="var(--color-primary)" size={20} />
                   <h4 style={{margin: 0}}>{obj.libelle}</h4>
                 </div>
                 <div className="flex gap-2">
                   <button onClick={() => setEditingObjectif({...obj})} style={{color: 'var(--color-primary)'}}>
                     <Pencil size={16} />
                   </button>
                   <button onClick={() => handleDeleteObjectif(obj.id)} style={{color: 'var(--color-danger)'}}>
                     <Trash2 size={16} />
                   </button>
                 </div>
               </div>
               
               <div className="objectif-stats flex justify-between mb-2">
                 <span style={{fontSize: '0.875rem', color: 'var(--color-text-light)'}}>Progression</span>
                 <span style={{fontWeight: 'bold', color: 'var(--color-primary)'}}>{progressPourcentage.toFixed(1)}%</span>
               </div>
               
               <div className="progress-bar-bg mb-4">
                 <div className="progress-bar-fill" style={{width: `${progressPourcentage}%`}}></div>
               </div>

               <div className="flex justify-between" style={{fontSize: '0.875rem'}}>
                 <span style={{color: 'var(--color-text-light)'}}>Cible : <strong style={{color: 'var(--color-text)'}}>{obj.montantCible.toLocaleString()} €</strong></span>
                 {obj.dateCible && (
                   <span style={{color: 'var(--color-text-light)'}}>Échéance : {new Date(obj.dateCible).toLocaleDateString('fr-FR')}</span>
                 )}
               </div>
            </div>
          )
        })}
        {objectifsList.length === 0 && <p className="text-light">Aucun objectif d'épargne défini.</p>}
      </div>

      {/* Modal Add/Edit Objectif */}
      {(isModalOpen || editingObjectif) && (
        <div className="modal-backdrop">
          <div className="modal-content card">
            <h2 className="mb-4">{editingObjectif ? 'Modifier l\'objectif' : 'Nouvel Objectif'}</h2>
            <form onSubmit={editingObjectif ? handleEditObjectif : handleAddObjectif}>
                 <div className="form-group">
                  <label className="form-label">Libellé du projet</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={editingObjectif ? editingObjectif.libelle : newObjectif.libelle} 
                    onChange={e => editingObjectif 
                      ? setEditingObjectif({...editingObjectif, libelle: e.target.value})
                      : setNewObjectif({...newObjectif, libelle: e.target.value})} 
                    required 
                  />
                </div>
                <div className="form-group">
                    <label className="form-label">Montant cible (€)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={editingObjectif ? editingObjectif.montantCible : newObjectif.montantCible} 
                      onChange={e => editingObjectif 
                        ? setEditingObjectif({...editingObjectif, montantCible: e.target.value})
                        : setNewObjectif({...newObjectif, montantCible: e.target.value})} 
                      required 
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Date d'échéance visée</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      value={editingObjectif ? editingObjectif.dateCible : newObjectif.dateCible} 
                      onChange={e => editingObjectif 
                        ? setEditingObjectif({...editingObjectif, dateCible: e.target.value})
                        : setNewObjectif({...newObjectif, dateCible: e.target.value})} 
                      required 
                    />
                </div>
                <div className="flex justify-between mt-4">
                  <button type="button" className="btn btn-outline" onClick={() => { setIsModalOpen(false); setEditingObjectif(null); }}>Annuler</button>
                  <button type="submit" className="btn btn-primary">{editingObjectif ? 'Mettre à jour' : 'Créer'}</button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Epargne;
