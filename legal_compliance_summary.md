# Herribudget — Synthèse Juridique & RGPD (v1.2)

Ce document récapitule les fondements légaux, les politiques de confidentialité et les données associatives intégrées au projet Herribudget pour l'association **Herrichain**.

---

## 1. Identité de l'Association & Propriété
- **Nom** : Association Herrichain
- **Statut** : Association à but non lucratif (loi 1901)
- **Objet** : Éducation financière, souveraineté numérique et promotion des écosystèmes décentralisés.
- **Numéro RNA** : W641015204
- **Président & Directeur de Publication** : Xavier CHAUMET-NICOLAS
- **Contact** : contact@herrichain.org
- **Développement** : Artean Digital — arteandigital.fr
- **Licence Code** : MIT (Open Source)
- **Hébergement** : Netlify (Statique)

---

## 2. Manifeste RGPD : "Privacy by Design"
Herribudget est conçu selon le principe de la protection des données dès la conception.

### Fondamentaux :
1. **Zéro Serveur** : Aucune donnée financière (revenus, charges, crédits) ne transite par un serveur distant.
2. **Stockage Local** : Utilisation exclusive de **IndexedDB** (via Dexie.js) dans le navigateur de l'utilisateur. 
3. **Zéro Tracking** : Absence totale de cookies publicitaires, de trackers (Google Analytics, Facebook Pixel, etc.) ou de scripts tiers intrusifs.
4. **Droit à l'Oubli** : La suppression des données se fait simplement en vidant le cache du navigateur ou via le bouton "Réinitialiser" dans les paramètres de l'application.

---

## 3. Conformité spécifique au Crédit (Loi Lagarde & ORIAS)
L'intégration du simulateur de crédit impose des mentions obligatoires suivies dans l'application :

### Avertissements Légaux :
- **Un crédit vous engage et doit être remboursé**. Vérifiez vos capacités de remboursement avant de vous engager.
- **Nature de l'outil** : Le simulateur est un outil **éducatif et indicatif** uniquement. Il ne constitue pas une offre de crédit.
- **Non-agrément** : Herribudget/Herrichain n'est pas un établissement de crédit ni un courtier en assurance.
- **Calculs** : Le TAEG (Taux Annuel Effectif Global) affiché est une estimation. Seule une fiche d'information standardisée (FISC) fournie par une banque a valeur contractuelle.

---

## 4. Politique de Cookies (CNIL)
- **Système de Consentement** : Une bannière légère informe l'utilisateur que l'application utilise uniquement des données locales pour son fonctionnement.
- **Exemption** : Comme l'application ne pratique aucun suivi et que le stockage est strictement nécessaire au service demandé par l'utilisateur (mémoriser son budget), elle est conforme aux recommandations simplifiées de la CNIL.

---

## 5. SEO & GEO (Signals d'Autorité)
Le projet utilise des données structurées **JSON-LD** pour valider son autorité auprès des moteurs de recherche (Google) et des moteurs de réponses (LLMs/SearchGPT) :

- **SoftwareApplication** : Définit Herribudget comme un logiciel de finance gratuit.
- **NGO / Organization** : Relie le logiciel à l'entité légale Herrichain.
- **Person** : Identifie Xavier CHAUMET-NICOLAS comme figure d'autorité et expert.
- **FAQPage** : Répond aux questions critiques sur la gratuité et la sécurité pour augmenter la confiance des algorithmes.

---

## 6. Hébergement & Sécurité Technique
- **Hébergeur** : Netlify (Statique).
- **Sécurité (Headers)** : Implémentation via `netlify.toml` de :
    - `Content-Security-Policy` (CSP) strict.
    - `X-Frame-Options: DENY` (Anti-clickjacking).
    - `Strict-Transport-Security` (Force le HTTPS).

---

> [!NOTE]
> Ce document sert de base pour toute nouvelle déclinaison de projet nécessitant une conformité souveraine et locale.
