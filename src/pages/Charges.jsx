import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { CreditCard, Plus, Trash2, Calendar, CheckCircle, Pencil } from 'lucide-react';
import { db } from '../db';
import './Charges.css';

const Charges = () => {
  const profile = useLiveQuery(() => db.profiles.toCollection().first());
  const recurrentes = useLiveQuery(() => db.charges_recurrentes.toArray()) || [];
  const ponctuelles = useLiveQuery(() => db.charges_ponctuelles.toArray()) || [];

  const [activeTab, setActiveTab] = useState('recurrentes'); // 'recurrentes' | 'ponctuelles'
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReccurente, setNewReccurente] = useState({
    libelle: '', montant: '', frequence: 'mensuel', categorie: 'Logement', datePrelevement: 1, repartition: '100% Personnel'
  });
  
  const [newPonctuelle, setNewPonctuelle] = useState({
    libelle: '', montant: '', datePrevue: '', statut: 'avenir'
  });

  const [editingCharge, setEditingCharge] = useState(null); // { type: 'recurrente'|'ponctuelle', data: {...} }

  const categories = ['Logement', 'Crédits', 'Énergie', 'Eau', 'Télécom', 'Assurances', 'Transport', 'Véhicule', 'Alimentation', 'Enfants', 'Abonnements', 'Santé', 'Épargne automatique', 'Autre'];
  const repartitions = ['100% Personnel', '100% Commun', '50/50'];

  const handleAddReccurente = async (e) => {
    e.preventDefault();
    if (!profile) return;
    await db.charges_recurrentes.add({
      profileId: profile.id,
      ...newReccurente,
      montant: Number(newReccurente.montant),
      datePrelevement: Number(newReccurente.datePrelevement)
    });
    setIsModalOpen(false);
    setNewReccurente({ libelle: '', montant: '', frequence: 'mensuel', categorie: 'Logement', datePrelevement: 1, repartition: '100% Personnel' });
  };

  const handleAddPonctuelle = async (e) => {
    e.preventDefault();
    if (!profile) return;
    await db.charges_ponctuelles.add({
      profileId: profile.id,
      ...newPonctuelle,
      montant: Number(newPonctuelle.montant)
    });
    setIsModalOpen(false);
    setNewPonctuelle({ libelle: '', montant: '', datePrevue: '', statut: 'avenir' });
  };

  const handleEditCharge = async (e) => {
    e.preventDefault();
    if (editingCharge.type === 'recurrente') {
      await db.charges_recurrentes.update(editingCharge.data.id, {
        ...editingCharge.data,
        montant: Number(editingCharge.data.montant),
        datePrelevement: Number(editingCharge.data.datePrelevement)
      });
    } else {
      await db.charges_ponctuelles.update(editingCharge.data.id, {
        ...editingCharge.data,
        montant: Number(editingCharge.data.montant)
      });
    }
    setEditingCharge(null);
  };

  const startEdit = (charge, type) => {
    setEditingCharge({ type, data: { ...charge } });
  };

  const handleDeleteRecurrente = async (id) => {
    if(window.confirm('Supprimer cette charge récurrente ?')) {
      await db.charges_recurrentes.delete(id);
    }
  };

  const handleDeletePonctuelle = async (id) => {
    if(window.confirm('Supprimer cette charge ponctuelle ?')) {
      await db.charges_ponctuelles.delete(id);
    }
  };

  const toggleStatutPonctuelle = async (charge) => {
    await db.charges_ponctuelles.update(charge.id, {
      statut: charge.statut === 'avenir' ? 'paye' : 'avenir'
    });
  };

  return (
    <div className="charges-page">
      <div className="dashboard-header mb-8">
        <div>
          <h1>Mes Charges</h1>
          <p style={{color: 'var(--color-text-light)'}}>Gérez vos dépenses récurrentes et exceptionnelles.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Ajouter
        </button>
      </div>

      <div className="tabs mb-8">
        <button 
          className={`tab-btn ${activeTab === 'recurrentes' ? 'active' : ''}`}
          onClick={() => setActiveTab('recurrentes')}
        >
          Charges Récurrentes
        </button>
        <button 
          className={`tab-btn ${activeTab === 'ponctuelles' ? 'active' : ''}`}
          onClick={() => setActiveTab('ponctuelles')}
        >
          Charges Ponctuelles
        </button>
      </div>

      {activeTab === 'recurrentes' && (
        <div className="charges-list">
          {recurrentes.length === 0 && <p className="text-light">Aucune charge récurrente.</p>}
          {recurrentes.map(c => (
            <div key={c.id} className="card charge-item flex justify-between items-center mb-4">
               <div className="flex items-center gap-4">
                 <div style={{width: 48, height: 48, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-bg)', color: 'var(--color-danger)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                   <CreditCard size={24} />
                 </div>
                 <div>
                   <h4 style={{fontSize: '1.125rem'}}>{c.libelle}</h4>
                   <span style={{fontSize: '0.875rem', color: 'var(--color-text-light)'}}>
                     {c.categorie} • Le {c.datePrelevement} du mois • {c.repartition}
                   </span>
                 </div>
               </div>
                <div className="flex items-center gap-2">
                  <span style={{fontSize: '1.25rem', fontWeight: 'bold'}}>- {c.montant.toLocaleString('fr-FR')} €</span>
                  <div className="flex gap-1">
                    <button onClick={() => startEdit(c, 'recurrente')} style={{color: 'var(--color-primary)', padding: '0.5rem'}}>
                      <Pencil size={18} />
                    </button>
                    <button onClick={() => handleDeleteRecurrente(c.id)} style={{color: 'var(--color-danger)', padding: '0.5rem'}}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'ponctuelles' && (
        <div className="charges-list">
          {ponctuelles.length === 0 && <p className="text-light">Aucune charge ponctuelle prévue.</p>}
          {ponctuelles.map(p => (
            <div key={p.id} className={`card charge-item flex justify-between items-center mb-4 ${p.statut === 'paye' ? 'opacity-50' : ''}`}>
               <div className="flex items-center gap-4">
                 <button onClick={() => toggleStatutPonctuelle(p)} style={{color: p.statut === 'paye' ? 'var(--color-primary)' : 'var(--color-text-light)', padding: '0.5rem'}}>
                   <CheckCircle size={28} />
                 </button>
                 <div>
                   <h4 style={{fontSize: '1.125rem'}}>{p.libelle}</h4>
                   <span style={{fontSize: '0.875rem', color: 'var(--color-text-light)'}}>
                     Prévue le : {new Date(p.datePrevue).toLocaleDateString('fr-FR')}
                   </span>
                 </div>
               </div>
                <div className="flex items-center gap-2">
                  <span style={{fontSize: '1.25rem', fontWeight: 'bold', textDecoration: p.statut === 'paye' ? 'line-through' : 'none'}}>- {p.montant.toLocaleString('fr-FR')} €</span>
                  <div className="flex gap-1">
                    <button onClick={() => startEdit(p, 'ponctuelle')} style={{color: 'var(--color-primary)', padding: '0.5rem'}}>
                      <Pencil size={18} />
                    </button>
                    <button onClick={() => handleDeletePonctuelle(p.id)} style={{color: 'var(--color-danger)', padding: '0.5rem'}}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add/Edit */}
      {(isModalOpen || editingCharge) && (
        <div className="modal-backdrop">
          <div className="modal-content card">
            <h2 className="mb-4">{editingCharge ? 'Modifier la charge' : 'Ajouter une charge'}</h2>
            
            {!editingCharge && (
              <div className="tabs mb-4" style={{borderBottom: 'none'}}>
                <button type="button" className={`btn ${activeTab === 'recurrentes' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('recurrentes')} style={{flex: 1}}>Récurrente</button>
                <button type="button" className={`btn ${activeTab === 'ponctuelles' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('ponctuelles')} style={{flex: 1, marginLeft: '0.5rem'}}>Ponctuelle</button>
              </div>
            )}

            {(editingCharge ? editingCharge.type === 'recurrente' : activeTab === 'recurrentes') ? (
              <form onSubmit={editingCharge ? handleEditCharge : handleAddReccurente}>
                <div className="form-group">
                  <label className="form-label">Libellé</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={editingCharge ? editingCharge.data.libelle : newReccurente.libelle} 
                    onChange={e => editingCharge 
                      ? setEditingCharge({...editingCharge, data: {...editingCharge.data, libelle: e.target.value}})
                      : setNewReccurente({...newReccurente, libelle: e.target.value})} 
                    required 
                  />
                </div>
                <div className="flex gap-4">
                  <div className="form-group" style={{flex: 1}}>
                    <label className="form-label">Montant (€)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={editingCharge ? editingCharge.data.montant : newReccurente.montant} 
                      onChange={e => editingCharge 
                        ? setEditingCharge({...editingCharge, data: {...editingCharge.data, montant: e.target.value}})
                        : setNewReccurente({...newReccurente, montant: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="form-group" style={{flex: 1}}>
                    <label className="form-label">Catégorie</label>
                    <select 
                      className="form-control" 
                      value={editingCharge ? editingCharge.data.categorie : newReccurente.categorie} 
                      onChange={e => editingCharge 
                        ? setEditingCharge({...editingCharge, data: {...editingCharge.data, categorie: e.target.value}})
                        : setNewReccurente({...newReccurente, categorie: e.target.value})}
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="form-group" style={{flex: 1}}>
                    <label className="form-label">Jour de prélèvement (1-31)</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="31" 
                      className="form-control" 
                      value={editingCharge ? editingCharge.data.datePrelevement : newReccurente.datePrelevement} 
                      onChange={e => editingCharge 
                        ? setEditingCharge({...editingCharge, data: {...editingCharge.data, datePrelevement: e.target.value}})
                        : setNewReccurente({...newReccurente, datePrelevement: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="form-group" style={{flex: 1}}>
                    <label className="form-label">Répartition</label>
                    <select 
                      className="form-control" 
                      value={editingCharge ? editingCharge.data.repartition : newReccurente.repartition} 
                      onChange={e => editingCharge 
                        ? setEditingCharge({...editingCharge, data: {...editingCharge.data, repartition: e.target.value}})
                        : setNewReccurente({...newReccurente, repartition: e.target.value})}
                    >
                      {repartitions.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex justify-between mt-4">
                  <button type="button" className="btn btn-outline" onClick={() => { setIsModalOpen(false); setEditingCharge(null); }}>Annuler</button>
                  <button type="submit" className="btn btn-primary">{editingCharge ? 'Mettre à jour' : 'Sauvegarder'}</button>
                </div>
              </form>
            ) : (
              <form onSubmit={editingCharge ? handleEditCharge : handleAddPonctuelle}>
                 <div className="form-group">
                  <label className="form-label">Libellé (ex: Impôts, Vacances)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={editingCharge ? editingCharge.data.libelle : newPonctuelle.libelle} 
                    onChange={e => editingCharge 
                      ? setEditingCharge({...editingCharge, data: {...editingCharge.data, libelle: e.target.value}})
                      : setNewPonctuelle({...newPonctuelle, libelle: e.target.value})} 
                    required 
                  />
                </div>
                <div className="form-group">
                    <label className="form-label">Montant estimé (€)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={editingCharge ? editingCharge.data.montant : newPonctuelle.montant} 
                      onChange={e => editingCharge 
                        ? setEditingCharge({...editingCharge, data: {...editingCharge.data, montant: e.target.value}})
                        : setNewPonctuelle({...newPonctuelle, montant: e.target.value})} 
                      required 
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Date prévue</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      value={editingCharge ? editingCharge.data.datePrevue : newPonctuelle.datePrevue} 
                      onChange={e => editingCharge 
                        ? setEditingCharge({...editingCharge, data: {...editingCharge.data, datePrevue: e.target.value}})
                        : setNewPonctuelle({...newPonctuelle, datePrevue: e.target.value})} 
                      required 
                    />
                </div>
                <div className="flex justify-between mt-4">
                  <button type="button" className="btn btn-outline" onClick={() => { setIsModalOpen(false); setEditingCharge(null); }}>Annuler</button>
                  <button type="submit" className="btn btn-primary">{editingCharge ? 'Mettre à jour' : 'Sauvegarder'}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Charges;
