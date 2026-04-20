import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Database, 
  Wallet, 
  ShieldCheck, 
  EyeOff, 
  CheckCircle2, 
  Rocket, 
  HeartHandshake,
  BarChart4,
  Target,
  Compass,
  Zap,
  Users,
  Lock,
  ZapOff,
  Scale,
  HelpCircle,
  MessageSquare,
  HelpCircle as QuestionIcon,
  ArrowRight
} from 'lucide-react';
import CookieBanner from '../components/CookieBanner.jsx';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-wrapper">
      <div className="container">
        {/* Navbar */}
        <nav className="landing-navbar">
          <div className="logo">Herribudget</div>
          <div className="landing-nav-links">
            <a href="#fonctionnalites">Fonctionnalités</a>
            <a href="#methodologie">Méthodologie</a>
            <a href="#a-propos">À propos</a>
            <button className="btn btn-primary" onClick={() => navigate('/cgu')}>
              Lancer l'app
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <header className="hero-section">
          <div className="hero-content">
            <div className="hero-tag">🎯 Atteignez vos objectifs financiers. Un par un.</div>
            <h1>Pilotez votre budget, <span>réalisez vos projets.</span></h1>
            <p>
              Herribudget vous aide à piloter votre budget au quotidien, visualiser votre progression et savoir exactement où vous en êtes — sans compte, sans cloud, sans distractions.
            </p>
            <div className="hero-buttons">
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/cgu')}
              >
                Commencer avec Herribudget — c'est gratuit <Rocket size={18} />
              </button>
              <button className="btn btn-outline" onClick={() => document.getElementById('demo').scrollIntoView({ behavior: 'smooth' })}>
                Voir comment ça marche
              </button>
            </div>
            <div className="hero-sub-cta">
              <span>🎯 Gratuit</span>
              <span>•</span>
              <span>🔒 100% local</span>
              <span>•</span>
              <span>✅ Prêt en 5 minutes</span>
            </div>
          </div>
          <div className="hero-image">
            <img 
              src="/assets/hero.png" 
              alt="Herribudget Illustration" 
              className="floating-illustration"
            />
          </div>
        </header>

        {/* Problem Section */}
        <section className="problem-section text-center">
          <div className="problem-content">
            <h2>Marre de naviguer à vue ?</h2>
            <p className="large-text">
              "Vous mettez de l'argent de côté, mais vous ne savez pas si c'est assez. Vous avez des projets — un voyage, un achat, une sécurité — mais aucun outil ne vous dit concrètement combien de temps il vous reste pour les atteindre."
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section id="fonctionnalites" className="features-section">
          <div className="text-center mb-12">
            <h2>4 raisons de choisir le pilotage actif</h2>
            <p>Tout ce dont vous avez besoin pour avancer, sans le superflu.</p>
          </div>
          
          <div className="features-grid">
            <div className="card feature-card">
              <div className="feature-icon-wrapper">
                <Target size={24} />
              </div>
              <h3>Fixez vos objectifs, suivez leur progression</h3>
              <p>"Voyage, épargne de précaution, remboursement de crédit — Herribudget vous montre où vous en êtes et quand vous allez y arriver."</p>
            </div>
            
            <div className="card feature-card">
              <div className="feature-icon-wrapper">
                <Compass size={24} />
              </div>
              <h3>Pilotez votre budget en temps réel</h3>
              <p>"Solde net, charges à venir, taux d'épargne : tout ce dont vous avez besoin pour décider, pas juste constater."</p>
            </div>

            <div className="card feature-card">
              <div className="feature-icon-wrapper">
                <Zap size={24} />
              </div>
              <h3>Des alertes qui vous gardent sur la bonne voie</h3>
              <p>"Prélèvement imminent, objectif atteint, taux d'endettement qui grimpe — Herribudget vous prévient avant que ça devienne un problème."</p>
            </div>

            <div className="card feature-card">
              <div className="feature-icon-wrapper">
                <Users size={24} />
              </div>
              <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                Module Herricount
                <span className="badge" style={{ background: 'var(--color-primary)', color: 'white', fontSize: '0.6rem' }}>NOUVEAU</span>
              </h3>
              <p style={{ marginBottom: '1rem' }}>"Le module de partage de frais, 100% local. Calculez qui doit quoi à qui en vacances ou en coloc, sans compte ni cloud. L'algo minimise les remboursements en local."</p>
              <div 
                className="btn btn-outline" 
                style={{ width: '100%', textAlign: 'center', cursor: 'pointer', padding: '0.5rem', fontSize: '0.875rem' }}
                onClick={() => navigate('/dashboard/herricount')}
              >
                Tester maintenant
              </div>
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section id="demo" className="demo-sequence">
          <div className="text-center mb-12">
            <h2>Prêt en 5 minutes, efficace pour toujours</h2>
          </div>
          
          <div className="dashboard-preview card mb-12">
            <img 
              src="/assets/dashboard.png" 
              alt="Dashboard Preview" 
              className="dashboard-screenshot"
            />
          </div>

          <div className="sequence-grid">
            <div className="sequence-step">
              <div className="step-number">1</div>
              <h3>Je configure en 5 minutes</h3>
              <p>Je renseigne mes revenus, mes charges, mon épargne de départ. Herribudget calcule immédiatement mon solde réel et mon autonomie.</p>
              <div className="step-visual">
                <div className="mockup-mini-details">
                  <div style={{fontWeight: 600, fontSize: '0.8rem', color: 'var(--color-text)'}}>Solde initial calculé</div>
                  <div style={{fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary)'}}>+ 1 450,00 €</div>
                  <div style={{display: 'flex', gap: '0.5rem', marginTop: '0.5rem'}}>
                    <div style={{height: 4, width: '40%', background: 'var(--color-primary)', borderRadius: 2}}></div>
                    <div style={{height: 4, width: '20%', background: 'var(--color-danger)', borderRadius: 2}}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="sequence-step">
              <div className="step-number">2</div>
              <h3>Je fixe mes objectifs</h3>
              <p>Je crée l'objectif "Voyage Japon — 3 000 €". La barre de progression se met à jour automatiquement selon mon épargne.</p>
              <div className="step-visual">
                <div className="mockup-mini-details">
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem'}}>
                    <span style={{fontWeight: 600}}>Voyage Japon</span>
                    <span style={{fontWeight: 600, color: 'var(--color-primary)'}}>65%</span>
                  </div>
                  <div className="mockup-progress">
                    <div className="progress-fill"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="sequence-step">
              <div className="step-number">3</div>
              <h3>Je pilote et reçois des alertes</h3>
              <p>Herribudget me prévient que mon prélèvement EDF arrive dans 2 jours ou si mon taux d'endettement augmente.</p>
              <div className="step-visual">
                <div className="mockup-alert-details">
                  <span style={{display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#B45309'}}><Zap size={14} /> ALERTE</span>
                  <p style={{margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#78350F'}}>Votre prélèvement "EDF" de 85€ est prévu dans 2 jours.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Herricount Showcase & Credit Simulator */}
        <section className="herricount-showcase" style={{marginTop: '4rem'}}>
          <div className="text-center mb-12">
             <h2>Des outils gratuits, intégrés et souverains</h2>
             <p>Pour vous aider à maîtriser de A à Z : la gestion des frais partagés et les prêts.</p>
          </div>

          {/* Module 1 : Herricount */}
          <div className="showcase-container container mb-12">
            <div className="showcase-content">
              <div className="hero-tag" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                EXTENSION #1
              </div>
              <h2>Herricount : Partagez sans cloud.</h2>
              <p>
                Gérez votre budget seul, en couple ou en colocation. Partagez certaines dépenses, isolez les vôtres, divisez au centime près. Comme Tricount, mais pour votre budget complet — et 100% privé.
              </p>
              <ul className="showcase-list">
                <li><CheckCircle2 size={18} /> <strong>Algo de minimisation</strong> : Moins de virements, plus de simplicité.</li>
                <li><CheckCircle2 size={18} /> <strong>Saisie éclair</strong> : Ajoutez une dépense avec répartition personnalisée.</li>
                <li><CheckCircle2 size={18} /> <strong>Partage sécurisé</strong> : Envoyez le résumé par SMS sans serveur.</li>
              </ul>
              <button className="btn btn-primary" onClick={() => navigate('/cgu')}>
                Tester Herricount
              </button>
            </div>
            <div className="showcase-visual card">
               <div className="mockup-herricount">
                 <div className="mockup-h-header">
                   <Users size={16} />
                   <span>Groupe : Vacances Bretagne</span>
                 </div>
                 <div className="mockup-h-transaction">
                   <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                     <div className="mini-avatar" style={{background: '#fee2e2', color: '#ef4444'}}>B</div>
                     <ArrowRight size={12} />
                     <div className="mini-avatar" style={{background: '#dcfce7', color: '#22c55e'}}>A</div>
                   </div>
                   <div style={{fontWeight: 800, fontSize: '0.9rem'}}>Alice doit 15,00 €</div>
                 </div>
               </div>
            </div>
          </div>

          {/* Module 2 : Simulateur Crédit */}
          <div className="showcase-container container" style={{flexDirection: 'row-reverse'}}>
             <div className="showcase-content">
              <div className="hero-tag" style={{ background: 'rgba(39, 174, 96, 0.1)', color: 'var(--color-success)' }}>
                EXTENSION #2
              </div>
              <h2>Simulateur de crédit</h2>
              <p>
                Testez vos propres scénarios de prêt immobilier, automobile ou conso. Calculez votre mensualité, le coût total avec ou sans assurance, et visualisez immédiatement votre tableau d'amortissement. Sans pop-ups ni revente de vos données aux courtiers.
              </p>
              <ul className="showcase-list">
                <li><CheckCircle2 size={18} /> <strong>100% anonyme</strong> : Vos simulations sont locales.</li>
                <li><CheckCircle2 size={18} /> <strong>Indépendant</strong> : Aucune affiliation avec les banques.</li>
              </ul>
              <button className="btn btn-primary" onClick={() => navigate('/dashboard/credits/simulateur')}>
                Calculer un crédit
              </button>
            </div>
            <div className="showcase-visual card bg-gradient" style={{background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)', color: 'white', padding: '2rem'}}>
                <h3 style={{color: 'white', marginBottom: '1.5rem'}}>Aperçu Simulation</h3>
                <div style={{background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem'}}>
                  <div style={{fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.8}}>Mensualité avec assurance</div>
                  <div style={{fontSize: '2rem', fontWeight: 800}}>1 156,00 €</div>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem'}}>
                  <span>TAEG Estimé</span>
                  <span style={{fontWeight: 600}}>3.45%</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginTop: '0.5rem'}}>
                  <span>Coût Total</span>
                  <span style={{fontWeight: 600}}>277 440 €</span>
                </div>
            </div>
          </div>
        </section>
      </div>

      {/* Vision Section (Full Width Background) */}
      <section id="methodologie" className="vision-section">
        <div className="vision-container">
          <div className="vision-content">
            <h2>Votre sérénité, notre priorité.</h2>
            <p>
              Herribudget ne vous distrait pas avec des publicités, ne vous vend pas de produits financiers et ne partage aucune donnée. Vos finances vous appartiennent — dans tous les sens du terme.
            </p>
            <div className="badges-grid">
              <div className="badge-item">
                <Lock size={18} />
                <span>Données 100% locales, jamais transmises</span>
              </div>
              <div className="badge-item">
                <ZapOff size={18} />
                <span>Gratuit pour toujours, open source</span>
              </div>
              <div className="badge-item">
                <Scale size={18} />
                <span>Conforme RGPD · Zéro cookie · Zéro tracking</span>
              </div>
            </div>
          </div>
          <div className="vision-illustration" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
               <div>
                 <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>AUTONOMIE</p>
                 <h2 style={{ color: 'var(--color-primary)' }}>18.5 Mois</h2>
               </div>
               <BarChart4 size={32} color="var(--color-primary)" />
            </div>
            <div className="card">
               <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-light)', marginBottom: '1rem' }}>FLUX DE TRÉSORERIE</p>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                 <span style={{ fontSize: '0.875rem' }}>Revenus</span>
                 <span style={{ fontSize: '0.875rem', color: 'var(--color-primary)', fontWeight: 600 }}>+4,120 €</span>
               </div>
               <div style={{ width: '100%', height: '4px', background: 'var(--color-primary)', borderRadius: '2px', marginBottom: '1rem' }}></div>
               
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                 <span style={{ fontSize: '0.875rem' }}>Dépenses</span>
                 <span style={{ fontSize: '0.875rem', color: 'var(--color-danger)', fontWeight: 600 }}>-2,100 €</span>
               </div>
               <div style={{ width: '60%', height: '4px', background: 'var(--color-danger)', borderRadius: '2px' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* NGO Section */}
      <section id="a-propos" className="ngo-section container">
        <div className="hero-tag" style={{ background: 'rgba(39, 174, 96, 0.1)', color: 'var(--color-success)' }}>
          ÉTHIQUE AVANT TOUT
        </div>
        <h2>Un droit humain à but non lucratif.</h2>
        <p>
          Herribudget n'est pas un produit, c'est une mission. Nous pensons que les outils de gestion financière doivent être accessibles, privés et exempts des motivations de profit qui mènent à l'exploitation des données.
        </p>

        <div className="card ngo-card">
          <img 
            src="/assets/trust.png" 
            alt="Trust Illustration" 
            className="ngo-decoration-img"
          />
          <h3>Association Herrichain</h3>
          <p style={{ fontStyle: 'italic', fontSize: '0.8rem', marginTop: '-1rem' }}>Identification RNA : W641015204</p>
          <div className="badges-grid mb-6">
            <div className="badge-item">
              <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub" style={{width: 20, height: 20}} />
              <span>Badge Open Source</span>
            </div>
          </div>
          <p>
            Soutenu par l'association Herrichain, ce projet est développé pour favoriser la souveraineté locale. 
            Le code source est entièrement public et auditable sur GitHub. Aucune ligne de code cachée — vérifiez par vous-même l'absence de tracking. Pas de Capital Risque, pas de stratégie de sortie, juste une éthique open-source pour le Pays Basque et au-delà.
          </p>
          <div className="ngo-footer">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>&lt;/&gt;</span>
              </div>
              <div>
                <p style={{ fontSize: '0.65rem', margin: 0, fontWeight: 700, color: 'var(--color-text-light)' }}>DÉVELOPPÉ PAR</p>
                <a href="#" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>arteandigital.fr</a>
              </div>
            </div>
            <a href="https://github.com/herrichain/herribudget" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
              Voir le dépôt GitHub
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section container">
        <div className="text-center mb-12">
          <div className="hero-tag">FOIRE AUX QUESTIONS</div>
          <h2>Tout savoir sur Herribudget</h2>
        </div>
        
        <div className="faq-grid">
          <div className="faq-item card">
            <div className="faq-question">
              <HelpCircle size={20} className="faq-icon" />
              <h3>C'est quoi une application "sans serveur" ?</h3>
            </div>
            <p>
              Contrairement aux applications classiques, vos données ne sont pas envoyées sur un ordinateur chez nous (cloud). Elles sont stockées directement dans votre navigateur (technologie IndexedDB). Herribudget ne peut techniquement pas voir votre solde.
            </p>
          </div>

          <div className="faq-item card">
             <div className="faq-question">
              <ShieldCheck size={20} className="faq-icon" />
              <h3>Pourquoi est-ce 100% local ?</h3>
            </div>
            <p>
              Pour votre souveraineté. Personne n'a besoin de savoir comment vous dépensez votre argent. En restant local, nous éliminons les risques de fuites de données massives ou de revente à des tiers.
            </p>
          </div>

          <div className="faq-item card">
             <div className="faq-question">
              <HeartHandshake size={20} className="faq-icon" />
              <h3>C'est quoi l'association Herrichain ?</h3>
            </div>
            <p>
              Herrichain est une association à but non lucratif qui oeuvre pour l'éducation financière et la compréhension des écosystèmes décentralisée. Nous fournissons des outils publics qui redonnent le pouvoir aux citoyens sur leur vie digitale.
            </p>
          </div>

          <div className="faq-item card">
             <div className="faq-question">
              <Zap size={20} className="faq-icon" />
              <h3>Est-ce que l'app est vraiment gratuite ?</h3>
            </div>
            <p>
              Oui. Pas d'abonnement, pas de publicité, pas de "freemium". C'est un bien commun numérique gratuit. Vous pouvez soutenir le projet en contribuant au code sur GitHub.
            </p>
          </div>

          <div className="faq-item card">
             <div className="faq-question">
              <Database size={20} className="faq-icon" />
              <h3>Puis-je récupérer mes données ?</h3>
            </div>
            <p>
              Absolument. Dans les paramètres, vous pouvez exporter toutes vos données au format JSON ou réinitialiser totalement l'application. Vous restez maître de votre bouton "Effacer".
            </p>
          </div>

          <div className="faq-item card">
             <div className="faq-question">
              <Lock size={20} className="faq-icon" />
              <h3>Faut-il créer un compte ?</h3>
            </div>
            <p>
              Zéro compte. Zéro email. Zéro mot de passe. Vous ouvrez le site, et c'est déjà chez vous. Si vous perdez votre appareil sans export, les données sont perdues (c'est le prix de l'anonymat total).
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta-section text-center">
        <div className="container">
          <h2>Quel est votre prochain objectif financier ?</h2>
          <button 
            className="btn btn-primary btn-large"
            onClick={() => navigate('/cgu')}
          >
            Commencer avec Herribudget — c'est gratuit
          </button>
        </div>
      </section>
      
      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--color-border)', padding: '3rem 0', marginTop: '4rem' }}>
        <div className="container flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '2rem' }}>
          <div style={{ maxWidth: '400px' }}>
            <h4 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Herribudget</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginBottom: '1rem' }}>
              Projet à but non lucratif porté par l'association Herrichain (W641015204) et développé par Artean Digital. Aucune donnée n'est collectée, tout reste sur votre appareil.
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>&copy; 2024 Herribudget. Renforcer la souveraineté locale par la transparence.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
               <a href="/privacy" style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>Politique de confidentialité</a>
               <a href="/legal" style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>Mentions légales</a>
               <a href="mailto:contact@herrichain.org" style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>Contact</a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
               <a href="/terms" style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>Conditions d'utilisation</a>
               <a href="#" style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>Accessibilité</a>
            </div>
          </div>
        </div>
      </footer>

      <CookieBanner />
    </div>
  );
};

export default LandingPage;
