# Dead Code Heat Map

A full-stack developer tool to visualize "dead code" in your codebase. Built with React, D3.js, and Node.js.

## 📂 Project Overview
This repository contains the **Dead Code Heat Map** project, a dashboard that highlights technical debt and inactive code through interactive visualizations.

### 📄 Documentation (The Big Picture)
For the most detailed explanation of the problem, the algorithm, and the technical vision, please refer to the master documentation:
👉 **[PROJECT_EXPLANATION.md](./PROJECT_EXPLANATION.md)**
*(This file contains everything you need to understand the project and can be easily printed/saved as a PDF)*.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v16+)
- npm or yarn

### 2. Installation
Run the following in the project root:

```bash
# Install server dependencies
cd dead-code-heatmap/server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Running the App
Open two terminal windows:

**Terminal 1 (Backend):**
```bash
cd dead-code-heatmap/server
npm start
```

**Terminal 2 (Frontend):**
```bash
cd dead-code-heatmap/client
npm run dev
```

The app will be live at `http://localhost:3000`.

---

## 🛠 Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, D3.js.
- **Backend**: Node.js, Express, @babel/parser.
- **Support**: Python/Java/Go/Rust parsing via regex.

---

