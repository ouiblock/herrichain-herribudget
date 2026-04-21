import React, { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Wallet, Plus, Trash2, AlertTriangle, Pencil } from 'lucide-react';
import { db } from '../db';
import './Revenus.css';

const Revenus = () => {
  // Use first profile temporarily
  const profile = useLiveQuery(() => db.profiles.toCollection().first());
  const revenus = useLiveQuery(() => db.revenus.toArray()) || [];
  const epargne = useLiveQuery(() => db.epargne.toArray()) || [];
  const charges = useLiveQuery(() => db.charges_recurrentes.toArray()) || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRevenu, setNewRevenu] = useState({
    libelle: '', montant: '', frequence: 'mensuel', type: 'principal'
  });

  const [editingRevenu, setEditingRevenu] = useState(null);

  const totalRevenus = useMemo(() => revenus.reduce((acc, curr) => acc + curr.montant, 0), [revenus]);
  const isSurvivalMode = totalRevenus === 0;
  
  const totalCharges = useMemo(() => charges.reduce((acc, curr) => acc + curr.montant, 0), [charges]);
  const capitalEpargne = epargne.length > 0 ? epargne[0].capitalDisponible : 0;
  const autonomieSurvie = totalCharges > 0 ? (capitalEpargne / totalCharges).toFixed(1) : 0;

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!profile) return;
    
    await db.revenus.add({
      profileId: profile.id,
      libelle: newRevenu.libelle,
      montant: Number(newRevenu.montant),
      frequence: newRevenu.frequence,
      type: newRevenu.type,
      date: new Date().toISOString()
    });
    setIsModalOpen(false);
    setNewRevenu({ libelle: '', montant: '', frequence: 'mensuel', type: 'principal' });
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    await db.revenus.update(editingRevenu.id, {
      ...editingRevenu,
      montant: Number(editingRevenu.montant)
    });
    setEditingRevenu(null);
  };

  const handleDelete = async (id) => {
    if(window.confirm('Voulez-vous supprimer ce revenu ?')) {
      await db.revenus.delete(id);
    }
  };

  return (
    <div className="revenus-page">
      <div className="dashboard-header mb-8">
        <div>
          <h1>Mes Revenus</h1>
          <p style={{color: 'var(--color-text-light)'}}>Gérez vos flux entrants réguliers et ponctuels.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Ajouter un revenu
        </button>
      </div>

      {isSurvivalMode ? (
        <div className="survival-mode-banner">
          <AlertTriangle size={32} color="var(--color-warning)" />
          <div>
            <h3>Mode survie activé (Revenus = 0 €)</h3>
            <p>Votre épargne prend le relais. Au rythme actuel de vos charges, votre autonomie est de <strong>{autonomieSurvie} mois</strong>.</p>
          </div>
        </div>
      ) : (
        <div className="total-revenus-card card mb-8">
          <div className="wallet-icon-bg">
            <Wallet size={24} />
          </div>
          <p className="balance-label">TOTAL DES REVENUS (MOIS)</p>
          <div className="balance-amount" style={{color: 'var(--color-success)'}}>
            + {totalRevenus.toLocaleString('fr-FR')} €
          </div>
        </div>
      )}

      <div className="revenus-list">
        <h3 className="mb-4">Revenus actuels</h3>
        {revenus.length === 0 && <p className="text-light">Aucun revenu pour le moment.</p>}
        {revenus.map(r => (
          <div key={r.id} className="card revenu-item flex justify-between items-center mb-4">
             <div className="flex items-center gap-4">
               <div style={{width: 48, height: 48, borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(45, 155, 111, 0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                 <Wallet size={24} />
               </div>
               <div>
                 <h4 style={{fontSize: '1.125rem'}}>{r.libelle}</h4>
                 <span style={{fontSize: '0.875rem', color: 'var(--color-text-light)', textTransform: 'capitalize'}}>{r.frequence} • {r.type}</span>
               </div>
             </div>
             <div className="flex items-center gap-4">
               <span style={{fontSize: '1.25rem', fontWeight: 'bold'}}>{r.montant.toLocaleString('fr-FR')} €</span>
               <div className="flex gap-1">
                 <button onClick={() => setEditingRevenu({...r})} style={{color: 'var(--color-primary)', padding: '0.5rem'}}>
                   <Pencil size={18} />
                 </button>
                 <button onClick={() => handleDelete(r.id)} style={{color: 'var(--color-danger)', padding: '0.5rem'}}>
                   <Trash2 size={18} />
                 </button>
               </div>
             </div>
          </div>
        ))}
      </div>

      {/* Modal Add/Edit Revenu */}
      {(isModalOpen || editingRevenu) && (
        <div className="modal-backdrop">
          <div className="modal-content card">
            <h2 className="mb-4">{editingRevenu ? 'Modifier le revenu' : 'Ajouter un revenu'}</h2>
            <form onSubmit={editingRevenu ? handleEdit : handleAdd}>
              <div className="form-group">
                <label className="form-label">Libellé (ex: Salaire CDI, APL...)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={editingRevenu ? editingRevenu.libelle : newRevenu.libelle}
                  onChange={e => editingRevenu 
                    ? setEditingRevenu({...editingRevenu, libelle: e.target.value})
                    : setNewRevenu({...newRevenu, libelle: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Montant (€)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={editingRevenu ? editingRevenu.montant : newRevenu.montant}
                  onChange={e => editingRevenu 
                    ? setEditingRevenu({...editingRevenu, montant: e.target.value})
                    : setNewRevenu({...newRevenu, montant: e.target.value})}
                  required 
                />
              </div>
              <div className="flex gap-4">
                 <div className="form-group" style={{flex: 1}}>
                    <label className="form-label">Type</label>
                    <select 
                      className="form-control"
                      value={editingRevenu ? editingRevenu.type : newRevenu.type}
                      onChange={e => editingRevenu 
                        ? setEditingRevenu({...editingRevenu, type: e.target.value})
                        : setNewRevenu({...newRevenu, type: e.target.value})}
                    >
                      <option value="principal">Principal (Salaire, Freelance)</option>
                      <option value="aides">Aides (CAF, RSA...)</option>
                      <option value="secondaire">Secondaire (Location, etc.)</option>
                      <option value="ponctuel">Ponctuel (Prime, Vente)</option>
                    </select>
                 </div>
                 <div className="form-group" style={{flex: 1}}>
                    <label className="form-label">Fréquence</label>
                    <select 
                      className="form-control"
                      value={editingRevenu ? editingRevenu.frequence : newRevenu.frequence}
                      onChange={e => editingRevenu 
                        ? setEditingRevenu({...editingRevenu, frequence: e.target.value})
                        : setNewRevenu({...newRevenu, frequence: e.target.value})}
                    >
                      <option value="mensuel">Mensuel</option>
                      <option value="trimestriel">Trimestriel</option>
                      <option value="annuel">Annuel</option>
                      <option value="unique">Une seule fois</option>
                    </select>
                 </div>
              </div>
              <div className="flex justify-between mt-4">
                <button type="button" className="btn btn-outline" onClick={() => { setIsModalOpen(false); setEditingRevenu(null); }}>Annuler</button>
                <button type="submit" className="btn btn-primary">{editingRevenu ? 'Mettre à jour' : 'Sauvegarder'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Revenus;
