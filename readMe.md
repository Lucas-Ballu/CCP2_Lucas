# 📌 CCP2 Missions & Candidatures

Application Node.js / Express pour gérer des **missions associatives** et les **candidatures de bénévoles**, dans le cadre du projet CCP2.

---

## Configuration

### Installation

`````````bash
git clone https://github.com/Lucas-Ballu/CCP2_Lucas.git
cd CCP2_Lucas
npm install

```.env
Créer un fichier .env à la racine
PORT=3007
DB_HOST=localhost
DB_PORT=3306
DB_USER=<votre-utilisateur>
DB_PASSWORD=<votre-motdepasse>
DB_NAME=CCP2DB
JWT_SECRET=dev

````SQL
Créer la base de données
-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role ENUM('VOLUNTEER','ASSOCIATION') NOT NULL,
  email VARCHAR(200) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(200) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des missions
CREATE TABLE IF NOT EXISTS missions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(190) NOT NULL,
  description TEXT NOT NULL,
  date DATETIME NOT NULL,
  association_id INT NOT NULL,
  FOREIGN KEY (association_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table des candidatures
CREATE TABLE IF NOT EXISTS applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mission_id INT NOT NULL,
  volunteer_id INT NOT NULL,
  status ENUM('PENDING','ACCEPTED','REJECTED') NOT NULL DEFAULT 'PENDING',
  note TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_app (mission_id, volunteer_id),
  FOREIGN KEY (mission_id) REFERENCES missions(id) ON DELETE CASCADE,
  FOREIGN KEY (volunteer_id) REFERENCES users(id) ON DELETE CASCADE
);

`````npm
Lancer le projet
npm run start

``````JSDOC
Générer la doc
npm run doc

```````API
API Endpoints

Authentification
Méthode	Endpoint	Description	Accès
POST	/api/register	Créer un compte	Public
POST	/api/login	Se connecter	Public
POST	/api/logout	Se déconnecter	Authentifié

 Missions
Méthode	Endpoint	Description	Accès
GET	/api/missions	Lister toutes les missions	Public
POST	/api/missions	Créer une mission	ASSOCIATION
PUT	/api/missions/:id	Modifier une mission	ASSOCIATION (créateur)
DELETE	/api/missions/:id	Supprimer une mission	ASSOCIATION (créateur)
GET	/api/missions/:id/applications	Voir les candidatures liées à une mission	ASSOCIATION

📨 Candidatures (Applications)
Méthode	Endpoint	Description	Accès
POST	/api/applications	Postuler à une mission	VOLUNTEER
GET	/api/applications/myApplications	Voir mes candidatures	VOLUNTEER
GET	/api/missions/:id/applications	Voir toutes les candidatures d’une mission	ASSOCIATION
PATCH	/api/applications/:id/status	Modifier le statut d’une candidature (ACCEPTED / REJECTED)	ASSOCIATION

````````Roles
Roles utilisateurs

VOLUNTEER : peut consulter les missions et postuler
ASSOCIATION : peut créer/modifier/supprimer ses missions et gérer les candidatures reçues
`````````
