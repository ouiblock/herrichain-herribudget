import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { v4 as uuidv4 } from 'uuid';
import { ArrowLeft, Plus, Share2, Receipt, ArrowRightLeft, X } from 'lucide-react';
import { db } from '../../db';
import { calculerRemboursements, partagerResultats } from '../../utils/herricountUtils';
import '../../pages/Herricount.css';

const GroupeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const groupe = useLiveQuery(() => db.herricount_groupes.get(id), [id]);
  const depenses = useLiveQuery(() => 
    db.herricount_depenses.where('groupeId').equals(id).toArray()
  , [id]) || [];

  const [activeTab, setActiveTab] = useState('depenses'); // 'depenses' | 'equilibre'
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Nouveau formulaire de dépense
  const [libelle, setLibelle] = useState('');
  const [montant, setMontant] = useState('');
  const [payeurId, setPayeurId] = useState('');
  const [repartitionType, setRepartitionType] = useState('egale'); // 'egale' | 'personnalisee'
  const [customParts, setCustomParts] = useState({}); // { participantId: part }

  // Calculs via Utils
  const transactions = useMemo(() => {
    if (!groupe || !depenses) return [];
    return calculerRemboursements(groupe.participants, depenses);
  }, [groupe, depenses]);

  if (groupe === undefined) return <div>Chargement...</div>;
  if (groupe === null) return <div>Groupe introuvable.</div>;

  const handleOpenAddModal = () => {
    setLibelle('');
    setMontant('');
    setPayeurId('');
    setRepartitionType('egale');
    
    // Initialiser les parts à 1 pour tout le monde
    const initParts = {};
    groupe.participants.forEach(p => {
      initParts[p.id] = 1;
    });
    setCustomParts(initParts);
    
    setShowAddModal(true);
  };

  const handleCustomPartChange = (participantId, value) => {
    const val = Math.max(0, parseInt(value) || 0);
    setCustomParts(prev => ({
      ...prev,
      [participantId]: val
    }));
  };

  const handleAddDepense = async (e) => {
    e.preventDefault();
    if (!libelle || !montant || !payeurId) return;

    const montantNum = parseFloat(montant);
    let parts = [];

    if (repartitionType === 'egale') {
      const n = groupe.participants.length;
      const partEgale = montantNum / n;
      parts = groupe.participants.map(p => ({
        participantId: p.id,
        montant: partEgale
      }));
    } else {
      const totalParts = Object.values(customParts).reduce((acc, curr) => acc + curr, 0);
      if (totalParts === 0) {
        alert("La somme des parts ne peut pas être zéro.");
        return;
      }
      parts = groupe.participants.map(p => ({
        participantId: p.id,
        montant: (customParts[p.id] / totalParts) * montantNum
      }));
    }

    await db.herricount_depenses.add({
      id: uuidv4(),
      groupeId: id,
      libelle,
      montant: montantNum,
      payeurId,
      dateDepense: new Date().toISOString(),
      repartition: repartitionType,
      parts
    });

    setShowAddModal(false);
  };

  const getUserName = (userId) => {
    return groupe.participants.find(p => p.id === userId)?.nom || 'Inconnu';
  };

  return (
    <div className="groupe-detail-page">
      <button className="back-btn" onClick={() => navigate('/dashboard/herricount')}>
        <ArrowLeft size={16} />
        Retour aux groupes
      </button>

      <header className="module-header" style={{ marginBottom: '1rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {groupe.nom}
          </h1>
          <div className="participants-pills" style={{ marginTop: '0.5rem' }}>
            {groupe.participants.map(p => (
              <span key={p.id} className="badge" style={{ background: 'var(--color-bg-tertiary)' }}>
                {p.nom}
              </span>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-outline" onClick={() => partagerResultats(groupe, transactions, groupe.participants)}>
            <Share2 size={16} />
            Partager
          </button>
          <button className="btn btn-primary" onClick={handleOpenAddModal}>
            <Plus size={16} />
            Dépense
          </button>
        </div>
      </header>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'depenses' ? 'active' : ''}`}
          onClick={() => setActiveTab('depenses')}
        >
          <Receipt size={16} style={{marginRight: '0.5rem', display: 'inline'}} />
          Dépenses
        </button>
        <button 
          className={`tab ${activeTab === 'equilibre' ? 'active' : ''}`}
          onClick={() => setActiveTab('equilibre')}
        >
          <ArrowRightLeft size={16} style={{marginRight: '0.5rem', display: 'inline'}} />
          Équilibre
        </button>
      </div>

      {activeTab === 'depenses' && (
        <div className="depenses-list">
          {depenses.length === 0 ? (
            <div className="card" style={{textAlign: 'center', padding: '3rem 1rem'}}>
              <Receipt size={32} color="var(--color-border)" style={{margin: '0 auto 1rem'}} />
              <p>Aucune dépense pour le moment.</p>
            </div>
          ) : (
            depenses.sort((a,b) => new Date(b.dateDepense) - new Date(a.dateDepense)).map(dep => (
              <div key={dep.id} className="depense-item">
                <div className="depense-info">
                  <h4>{dep.libelle}</h4>
                  <p>Payé par <strong>{getUserName(dep.payeurId)}</strong> — le {new Date(dep.dateDepense).toLocaleDateString('fr-FR')}</p>
                </div>
                <div className="depense-montant">
                  {dep.montant.toFixed(2)} €
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'equilibre' && (
        <div className="equilibre-view">
          {transactions.length === 0 ? (
            <div className="card" style={{textAlign: 'center', padding: '3rem 1rem'}}>
              <h3 style={{color: 'var(--color-success)'}}>Tout est remboursé !</h3>
              <p>Il n'y a aucune dette dans ce groupe.</p>
            </div>
          ) : (
            <div className="transactions-list">
              {transactions.map((t, idx) => (
                <div key={idx} className="transaction-card">
                  <div className="transaction-parties">
                    <div className="user-avatar debiteur">
                      {getUserName(t.de).charAt(0)}
                    </div>
                    <div className="transaction-flow">
                      <span style={{fontSize: '0.75rem'}}>{getUserName(t.de)} doit à</span>
                      <div className="line"></div>
                      <span style={{fontSize: '0.75rem', fontWeight: 'bold'}}>{getUserName(t.vers)}</span>
                    </div>
                    <div className="user-avatar creancier">
                      {getUserName(t.vers).charAt(0)}
                    </div>
                  </div>
                  <div className="transaction-amount-badge">
                    {t.montant.toFixed(2)} €
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal Ajout Dépense */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content card">
            <div className="modal-header">
              <h2>Ajouter une dépense</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddDepense}>
              <div className="form-group">
                <label className="form-label">Quoi ?</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={libelle} 
                  onChange={e => setLibelle(e.target.value)} 
                  placeholder="Ex: Restaurant, Courses..." 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Combien ? (€)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  min="0.01"
                  className="form-control" 
                  value={montant} 
                  onChange={e => setMontant(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Qui a payé ?</label>
                <select 
                  className="form-control" 
                  value={payeurId} 
                  onChange={e => setPayeurId(e.target.value)}
                  required
                >
                  <option value="">Sélectionner...</option>
                  {groupe.participants.map(p => (
                    <option key={p.id} value={p.id}>{p.nom}</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{marginTop: '1.5rem'}}>
                <label className="form-label" style={{marginBottom: '0.5rem', display: 'block'}}>Répartition entre les participants</label>
                <div style={{display: 'flex', gap: '1rem', marginBottom: '1rem'}}>
                  <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                    <input 
                      type="radio" 
                      name="repartition" 
                      value="egale" 
                      checked={repartitionType === 'egale'} 
                      onChange={() => setRepartitionType('egale')} 
                    />
                    Parts égales
                  </label>
                  <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                    <input 
                      type="radio" 
                      name="repartition" 
                      value="personnalisee" 
                      checked={repartitionType === 'personnalisee'} 
                      onChange={() => setRepartitionType('personnalisee')} 
                    />
                    Moduler les parts
                  </label>
                </div>
                
                {repartitionType === 'personnalisee' ? (
                  <div className="card" style={{padding: '1rem', background: 'var(--color-bg-secondary)'}}>
                    <p style={{fontSize: '0.75rem', color: 'var(--color-text-light)', marginBottom: '1rem'}}>
                      Attribuez un nombre de parts à chaque personne (0 = ne participe pas, 2 = paye double, etc.)
                    </p>
                    {groupe.participants.map(p => (
                      <div key={p.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}>
                        <span style={{fontSize: '0.875rem'}}>{p.nom}</span>
                        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                          <input 
                            type="number" 
                            min="0"
                            style={{width: '60px', textAlign: 'center', padding: '0.25rem'}}
                            className="form-control"
                            value={customParts[p.id] !== undefined ? customParts[p.id] : 1}
                            onChange={(e) => handleCustomPartChange(p.id, e.target.value)}
                          />
                          <span style={{fontSize: '0.875rem', color: 'var(--color-text-light)'}}>part(s)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="static-field" style={{fontSize: '0.875rem'}}>
                    <em>Les frais sont divisés équitablement ({groupe.participants.length} personnes).</em>
                  </div>
                )}
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowAddModal(false)}>Annuler</button>
                <button type="submit" className="btn btn-primary">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupeDetail;
