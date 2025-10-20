# 💾 Discord Backup Tool V3

Un outil complet de **sauvegarde et restauration de serveurs Discord**, conçu pour les **selfbots**.  
Il permet de créer, charger et gérer des backups de serveurs, d’emojis, de templates, et bien plus encore.  

> ⚠️ **Ce projet est à but éducatif.**  
> L’utilisation de selfbots est **interdite par Discord**. L’auteur ne pourra être tenu responsable en cas de sanction de votre compte.

---

## 🚀 Fonctionnalités

### 📁 Backups
- 🔹 Créer une backup complète d’un serveur (salons, rôles, etc.)
- 🔹 Créer une backup **sans chargement**
- 🔹 Créer une backup **avec les messages**
- 🔹 Lister toutes les backups disponibles
- 🔹 Charger une backup sur un nouveau serveur

### 😺 Emojis
- 🪣 Créer une backup complète des emojis d’un serveur
- 📥 Télécharger les emojis localement
- ♻️ Restaurer les emojis à partir d’une backup JSON

### ⚙️ Outils
- 🧹 Supprimer des salons par nom
- 🗂️ Supprimer tous les salons d’une catégorie
- 🧩 Créer un **template Discord** (modèle clonable)
- 🎨 Changer la **couleur du thème** (bleu, rouge, vert, rose, jaune, etc.)

---

## 🧠 Installation

### 1️⃣ Cloner le projet
```bash
git clone https://github.com/002-sans/Discord-Backup-Tool-V3.git
cd Discord-Backup-Tool-V3
```

### 2️⃣ Installer les dépendances
```bash
npm install
```

### 3️⃣ Lancer le tool
```bash
node index.js
```

### 🧩 Structure du projet
```pgsql
📂 Discord-Backup-Tool-V3
 ┣ 📂 backups
 ┃ ┣ 📂 selfbot
 ┃ ┃ ┣ 📂 emojis
 ┃ ┃ ┗ 📂 serveurs
 ┣ 📜 config.json
 ┣ 📜 index.js
 ┗ 📜 README.md
```

### 🎨 Menu Principal
```scss
[1]  - Créé Une Backup
[2]  - Créé Une Backup (Sans Chargement)
[3]  - Créé Une Backup Des Emotes
[4]  - Télécharger des emotes
[5]  - Créé Une Backup (Avec les Messages)
[6]  - Charger une Backup
[7]  - Supprime Les Tickets (Par nom)
[8]  - Supprime Les Tickets (d'une Categorie)
[9]  - Créé Un Modèle (Besoin de Permissions)
[10] - Affiche La Liste Des Backups
[11] - Settings
[0]  - Fermer
```

### 🌈 Exemple d’affichage
<img width="1350" height="767" alt="image" src="https://github.com/user-attachments/assets/5cc12f53-6e4d-4e39-a4a9-8c28919d5922" />
