import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';
import { db } from '../db';
import './CGU.css'; // On va créer ça aussi

const CGU = () => {
  const navigate = useNavigate();
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  const scrollRef = useRef(null);

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      setHasScrolledToBottom(true);
    }
  };

  const handleAccept = async () => {
    if (check1 && check2 && hasScrolledToBottom) {
      await db.cgu_acceptance.add({
        version: '1.0',
        timestamp: new Date().toISOString()
      });
      navigate('/onboarding');
    }
  };

  return (
    <div className="cgu-page container">
      <div className="cgu-card card">
        <div className="cgu-header">
          <ShieldAlert size={32} color="var(--color-primary)" />
          <h2>Conditions Générales et Avertissements</h2>
          <p>Herribudget prend vos données au sérieux. Veuillez lire les conditions suivantes.</p>
        </div>

        <div className="cgu-scroll-box" ref={scrollRef} onScroll={handleScroll}>
          <h3>Article 1 - Objet</h3>
          <p>Herribudget est un projet open source à but non lucratif, édité par l'association Herrichain. C'est un outil éducatif de simulation personnelle...</p>
          <br/>
          <h3>Article 2 - Absence de conseil financier</h3>
          <p>
            Les calculs fournis par Herribudget (taux d'endettement, autonomie financière, projections d'épargne) sont des estimations indicatives à des fins éducatives uniquement. Ils ne constituent pas des conseils financiers, bancaires, fiscaux ou juridiques. 
            <br/><br/>
            Herribudget n'est pas un CIF agréé par l'AMF. L'association Herrichain et Artean Digital déclinent toute responsabilité quant aux décisions financières prises sur la base des données affichées.
          </p>
          <br/>
          <h3>Article 3 - Données et Confidentialité</h3>
          <p>
            Herribudget est conçu en "Privacy by Design". Aucune donnée personnelle n'est collectée. Tout est stocké en IndexedDB localement sur votre appareil. Aucune information n'est transmise à l'association Herrichain, Artean Digital, l'hébergeur ou tout tiers.
          </p>
          <br/>
          <h3>Article 4 - Cookies & Analytics</h3>
          <p>L'application n'utilise aucun cookie de suivi et aucun outil d'analytics. Herribudget utilise uniquement des cookies fonctionnels indispensables à son fonctionnement (mémorisation de vos préférences locales).</p>
          <br/>
          <h3>Article 5 - Calculateur de crédit</h3>
          <p>
            Le calculateur de mensualité intégré à Herribudget est un outil de simulation éducative. Les résultats (mensualité, TAEG, coût total) sont des estimations indicatives basées sur les paramètres saisis par l'utilisateur. Ils ne constituent en aucun cas une offre de crédit au sens de la directive 2008/48/CE, un engagement contractuel, ni un conseil en investissement ou en financement. L'association Herrichain et Artean Digital déclinent toute responsabilité quant aux décisions de financement prises sur la base de ces simulations.
          </p>
          
          <div style={{ padding: '4rem 0' }}>{/* Espace pour obliger à scroller */}</div>
          <p className="text-primary" style={{ textAlign: 'center', fontWeight: 'bold' }}>Fin du document.</p>
        </div>

        <div className="cgu-actions">
          <label className="checkbox-container">
            <input 
              type="checkbox" 
              checked={check1} 
              onChange={(e) => setCheck1(e.target.checked)} 
              disabled={!hasScrolledToBottom} 
            />
            <span className="checkmark"></span>
            J'ai lu et j'accepte les Conditions Générales d'Utilisation
          </label>
          <label className="checkbox-container">
            <input 
              type="checkbox" 
              checked={check2} 
              onChange={(e) => setCheck2(e.target.checked)} 
              disabled={!hasScrolledToBottom}
            />
            <span className="checkmark"></span>
            Je comprends que Herribudget est un outil éducatif et non un conseil financier
          </label>

          <button 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={!check1 || !check2 || !hasScrolledToBottom}
            onClick={handleAccept}
          >
            Accepter et continuer
          </button>
          
          {!hasScrolledToBottom && (
            <p className="scroll-warning text-warning" style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem' }}>
              Veuillez faire défiler le document jusqu'en bas pour activer les cases.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CGU;
