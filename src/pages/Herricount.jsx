import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLiveQuery } from 'dexie-react-hooks';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, ArrowRight, X } from 'lucide-react';
import { db } from '../db';
import './Herricount.css';

const Herricount = () => {
  const navigate = useNavigate();
  const groupes = useLiveQuery(() => db.herricount_groupes.toArray()) || [];
  
  const [showModal, setShowModal] = useState(false);
  const [newGroupNom, setNewGroupNom] = useState('');
  const [participantInput, setParticipantInput] = useState('');
  const [participants, setParticipants] = useState([]);

  const addParticipant = (e) => {
    e.preventDefault();
    if (participantInput.trim().length > 0) {
      setParticipants([...participants, { id: uuidv4(), nom: participantInput.trim() }]);
      setParticipantInput('');
    }
  };

  const removeParticipant = (id) => {
    setParticipants(participants.filter(p => p.id !== id));
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (newGroupNom.trim() === '' || participants.length < 2) {
      alert('Veuillez donner un nom et ajouter au moins 2 participants.');
      return;
    }

    const groupeId = uuidv4();
    await db.herricount_groupes.add({
      id: groupeId,
      nom: newGroupNom.trim(),
      statut: 'actif',
      dateCreation: new Date().toISOString(),
      participants: participants
    });

    setShowModal(false);
    setNewGroupNom('');
    setParticipants([]);
    navigate(`/dashboard/herricount/${groupeId}`);
  };

  return (
    <div className="herricount-page">
      <header className="module-header">
        <div>
          <h1>Herricount</h1>
          <p className="subtitle">Partagez les dépenses de groupe, 100% localement.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          Nouveau Groupe
        </button>
      </header>

      {groupes.length === 0 ? (
        <div className="empty-state card">
          <Users size={48} color="var(--color-border)" />
          <h3>Aucun groupe Herricount</h3>
          <p>Créez un groupe pour un voyage, une coloc ou un événement, et simplifiez vos remboursements sans aucun cloud.</p>
          <button className="btn btn-outline" onClick={() => setShowModal(true)} style={{marginTop: '1rem'}}>
            Créer mon premier groupe
          </button>
        </div>
      ) : (
        <div className="groupes-grid">
          {groupes.map(groupe => (
            <div 
              key={groupe.id} 
              className={`card groupe-card ${groupe.statut === 'soldé' ? 'archived' : ''}`}
              onClick={() => navigate(`/dashboard/herricount/${groupe.id}`)}
            >
              <div className="groupe-header">
                <h3>{groupe.nom}</h3>
                <span className={`badge ${groupe.statut}`}>{groupe.statut}</span>
              </div>
              <div className="groupe-participants">
                <Users size={16} />
                <span>{groupe.participants ? groupe.participants.length : 0} participants</span>
              </div>
              <div className="groupe-action">
                <span>Ouvrir</span>
                <ArrowRight size={16} />
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content card">
            <div className="modal-header">
              <h2>Créer un groupe</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateGroup}>
              <div className="form-group">
                <label className="form-label">Nom du groupe</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={newGroupNom} 
                  onChange={e => setNewGroupNom(e.target.value)} 
                  placeholder="Ex: Vacances Bretagne"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Ajouter des participants</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={participantInput} 
                    onChange={e => setParticipantInput(e.target.value)}
                    placeholder="Prénom"
                  />
                  <button type="button" className="btn btn-outline" onClick={addParticipant}>Ajouter</button>
                </div>
                
                <div className="participants-pills">
                  {participants.map(p => (
                    <div key={p.id} className="participant-pill">
                      {p.nom}
                      <button type="button" onClick={() => removeParticipant(p.id)}><X size={14} /></button>
                    </div>
                  ))}
                  {participants.length === 0 && <span style={{fontSize: '0.8rem', color: 'var(--color-text-light)'}}>Aucun participant pour le moment</span>}
                </div>
              </div>

              <div className="modal-actions" style={{ marginTop: '2rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Annuler</button>
                <button type="submit" className="btn btn-primary" disabled={participants.length < 2 || !newGroupNom.trim()}>Créer le groupe</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Herricount;
