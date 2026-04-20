import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { AlertCircle, Plus, Trash2, ShieldAlert } from 'lucide-react';
import { db } from '../db';
import './Credits.css';

const Credits = () => {
  const navigate = useNavigate();
  const profile = useLiveQuery(() => db.profiles.toCollection().first());
  const credits = useLiveQuery(() => db.credits.toArray()) || [];
  const revenus = useLiveQuery(() => db.revenus.toArray()) || [];
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCredit, setNewCredit] = useState({
    libelle: '', capitalRestant: '', mensualite: '', taux: '', dateFin: ''
  });

  const totalMensualites = useMemo(() => credits.reduce((acc, curr) => acc + curr.mensualite, 0), [credits]);
  const totalRevenus = useMemo(() => revenus.reduce((acc, curr) => acc + curr.montant, 0), [revenus]);
  
  const tauxEndettement = totalRevenus > 0 ? ((totalMensualites / totalRevenus) * 100).toFixed(1) : 0;
  
  let endettementStatus = 'sain'; // sain, warning, danger
  let endettementMessage = "Votre taux d'endettement est sain.";
  let gaugeColor = 'var(--color-success)';

  if (tauxEndettement >= 25 && tauxEndettement <= 35) {
     endettementStatus = 'warning';
     endettementMessage = "Vous approchez du seuil bancaire recommandé.";
     gaugeColor = 'var(--color-warning)';
  } else if (tauxEndettement > 35) {
     endettementStatus = 'danger';
     endettementMessage = "Votre taux dépasse les recommandations du HCSF. Consultez un conseiller financier.";
     gaugeColor = 'var(--color-danger)';
  }

  const handleAddCredit = async (e) => {
    e.preventDefault();
    if (!profile) return;
    await db.credits.add({
      profileId: profile.id,
      ...newCredit,
      capitalRestant: Number(newCredit.capitalRestant),
      mensualite: Number(newCredit.mensualite),
      taux: Number(newCredit.taux)
    });
    setIsModalOpen(false);
    setNewCredit({ libelle: '', capitalRestant: '', mensualite: '', taux: '', dateFin: '' });
  };

  const handleDeleteCredit = async (id) => {
    if(window.confirm('Supprimer ce crédit ?')) {
      await db.credits.delete(id);
    }
  };

  return (
    <div className="credits-page">
      <div className="dashboard-header mb-8">
        <div>
          <h1>Mes Crédits</h1>
          <p style={{color: 'var(--color-text-light)'}}>Gérez vos emprunts et surveillez votre taux d'endettement.</p>
        </div>
        <div className="flex gap-4">
          <button className="btn btn-outline" onClick={() => navigate('/dashboard/credits/simulateur')}>
            Simulateur
          </button>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Ajouter 
          </button>
        </div>
      </div>

      <div className="dashboard-top-grid mb-8">
         <div className="card text-center" style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
           <h3 style={{marginBottom: '1rem'}}>Taux d'endettement</h3>
           <div className="circular-gauge" style={{borderTopColor: gaugeColor, borderRightColor: gaugeColor, borderBottomColor: gaugeColor}}>
             <div className="gauge-inner">
               <h3 style={{color: gaugeColor}}>{tauxEndettement}%</h3>
             </div>
           </div>
           <p style={{fontWeight: 600, color: gaugeColor, marginTop: '1rem'}}>{endettementMessage}</p>
         </div>

         <div className="card text-center" style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: 'var(--color-bg)'}}>
             <ShieldAlert size={32} color="var(--color-text-light)" style={{margin: '0 auto', marginBottom: '1rem'}} />
             <p style={{fontSize: '0.8rem', color: 'var(--color-text-light)', lineHeight: 1.6}}>
               <strong>Disclaimer obligatoire :</strong> Ce calcul est fourni à titre indicatif et éducatif uniquement. Il ne constitue pas un conseil financier, bancaire ou en investissement. Herribudget n'est pas un établissement financier agréé. Consultez un conseiller agréé pour toute décision.
             </p>
         </div>
      </div>

      <div className="credits-list">
        <h3 className="mb-4">Crédits en cours</h3>
        {credits.length === 0 && <p className="text-light">Aucun crédit en cours.</p>}
        {credits.map(cr => (
           <div key={cr.id} className="card credit-item mb-4">
               <div className="flex justify-between items-start mb-4">
                 <div>
                   <h4 style={{fontSize: '1.25rem', marginBottom: '0.25rem'}}>{cr.libelle}</h4>
                   <span style={{fontSize: '0.875rem', color: 'var(--color-text-light)'}}>Fin prévue : {new Date(cr.dateFin).toLocaleDateString('fr-FR')} • Taux {cr.taux}%</span>
                 </div>
                 <button onClick={() => handleDeleteCredit(cr.id)} style={{color: 'var(--color-danger)'}}><Trash2 size={18} /></button>
               </div>
               
               <div className="flex justify-between" style={{borderTop: '1px solid var(--color-border)', paddingTop: '1rem', marginTop: '1rem'}}>
                  <div>
                    <p style={{fontSize: '0.75rem', color: 'var(--color-text-light)', textTransform: 'uppercase', fontWeight: 600}}>Capital Mettant Dû</p>
                    <p style={{fontSize: '1.25rem', fontWeight: 'bold'}}>{cr.capitalRestant.toLocaleString('fr-FR')} €</p>
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <p style={{fontSize: '0.75rem', color: 'var(--color-text-light)', textTransform: 'uppercase', fontWeight: 600}}>Mensualité</p>
                    <p style={{fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-danger)'}}>- {cr.mensualite.toLocaleString('fr-FR')} €</p>
                  </div>
               </div>
           </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content card">
            <h2 className="mb-4">Ajouter un crédit</h2>
            <form onSubmit={handleAddCredit}>
                <div className="form-group">
                  <label className="form-label">Libellé (ex: Prêt Immo, Crédit Auto)</label>
                  <input type="text" className="form-control" value={newCredit.libelle} onChange={e => setNewCredit({...newCredit, libelle: e.target.value})} required />
                </div>
                <div className="flex gap-4">
                  <div className="form-group" style={{flex: 1}}>
                      <label className="form-label">Capital restant dû (€)</label>
                      <input type="number" className="form-control" value={newCredit.capitalRestant} onChange={e => setNewCredit({...newCredit, capitalRestant: e.target.value})} required />
                  </div>
                  <div className="form-group" style={{flex: 1}}>
                      <label className="form-label">Mensualité (€)</label>
                      <input type="number" className="form-control" value={newCredit.mensualite} onChange={e => setNewCredit({...newCredit, mensualite: e.target.value})} required />
                  </div>
                </div>
                <div className="flex gap-4">
                   <div className="form-group" style={{flex: 1}}>
                      <label className="form-label">Taux d'intérêt annuel (%)</label>
                      <input type="number" step="0.01" className="form-control" value={newCredit.taux} onChange={e => setNewCredit({...newCredit, taux: e.target.value})} required />
                  </div>
                  <div className="form-group" style={{flex: 1}}>
                      <label className="form-label">Date de fin prévue</label>
                      <input type="month" className="form-control" value={newCredit.dateFin} onChange={e => setNewCredit({...newCredit, dateFin: e.target.value})} required />
                  </div>
                </div>
                <div className="flex justify-between mt-4">
                  <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Annuler</button>
                  <button type="submit" className="btn btn-primary">Sauvegarder</button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Credits;
