import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Legal = () => {
  const navigate = useNavigate();

  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
      <button className="back-btn mb-8" onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', padding: 0 }}>
        <ArrowLeft size={16} />
        Retour à l'accueil
      </button>

      <h1 className="mb-8 text-center">Mentions Légales</h1>
      <div className="card" style={{ padding: '2rem', lineHeight: '1.6' }}>
        
        <h2 className="mb-4" style={{ fontSize: '1.25rem' }}>Éditeur de l'application</h2>
        <p className="mb-6 text-light">
          <strong>Association Herrichain</strong><br />
          Président : Xavier CHAUMET-NICOLAS<br />
          Numéro RNA : W641015204<br />
          Contact : contact@herrichain.org
        </p>

        <h2 className="mb-4" style={{ fontSize: '1.25rem' }}>Directeur de la publication</h2>
        <p className="mb-6 text-light">
          Xavier CHAUMET-NICOLAS
        </p>

        <h2 className="mb-4" style={{ fontSize: '1.25rem' }}>Développement & conception</h2>
        <p className="mb-6 text-light">
          <strong>Artean Digital</strong> — <a href="https://arteandigital.fr" target="_blank" rel="noreferrer" style={{color: 'var(--color-primary)'}}>arteandigital.fr</a>
        </p>

        <h2 className="mb-4" style={{ fontSize: '1.25rem' }}>Hébergement</h2>
        <p className="mb-6 text-light">
          <strong>Netlify Inc.</strong><br />
          44 Montgomery Street, Suite 300<br />
          San Francisco, California 94104, USA<br />
          <a href="https://netlify.com" target="_blank" rel="noreferrer" style={{color: 'var(--color-primary)'}}>netlify.com</a>
        </p>

        <h2 className="mb-4" style={{ fontSize: '1.25rem' }}>Code source</h2>
        <p className="mb-6 text-light">
          <a href="https://github.com/herrichain/herribudget" target="_blank" rel="noreferrer" style={{color: 'var(--color-primary)'}}>github.com/herrichain/herribudget</a><br />
          Licence : MIT
        </p>

        <h2 className="mb-4" style={{ fontSize: '1.25rem' }}>Propriété intellectuelle</h2>
        <p className="mb-0 text-light">
          Le code source de Herribudget est publié sous licence open source. Le nom "Herribudget", le logo et la charte graphique sont la propriété de l'association Herrichain. Toute reproduction commerciale sans autorisation est interdite.
        </p>
      </div>
    </div>
  );
};

export default Legal;
