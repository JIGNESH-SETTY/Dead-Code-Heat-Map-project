# Dead Code Heat Map: The Complete Project Guide

## 1. Introduction & Vision
The **Dead Code Heat Map** is a sophisticated full-stack developer productivity tool designed to solve **Software Entropy** (Code Rot). It provides a visual, interactive bridge between raw source code and actionable technical debt management.

### The Mission
To transform "invisible" technical debt into a "visible" heat map, making it impossible for engineering teams to ignore the legacy code that slows them down.

---

## 2. The Core Problem: Why Dead Code Costs Millions
As software matures, it inevitably accumulates inactive code paths. This leads to four critical "Taxation Categories":

1.  **The Knowledge Tax**: New engineers spend up to 30% of their onboarding time studying code that does absolutely nothing.
2.  **The Maintenance Tax**: Every refactor or dependency update must carry the weight of unused code, increasing the risk of breakage.
3.  **The Performance Tax**: High-entropy codebases lead to massive bundle sizes, slower builds, and increased cold-start latencies.
4.  **The Security Tax**: Unmaintained code is a prime target for vulnerabilities, as it often bypasses modern security audits.

---

## 3. The Technical Solution
This website acts as a **Diagnostic Scanner** for any repository. It uses a three-stage pipeline to analyze and visualize health.

### Step A: Static Analysis (AST Parsing)
Instead of a simple text search, the backend uses `@babel/parser` (for JS/TS) and regex parsers (for Python/Java/Go) to build a mathematical model of the source code (an Abstract Syntax Tree). This allows us to identify exact function boundaries and relationships.

### Step B: The "Dead Score" Algorithm
We calculate a score from **0 (Live/Healthy)** to **100 (Dead/Rotten)** based on:
*   **Recency (50%)**: How long since the code was last touched? (Baseline: High score after 3 years).
*   **Connectivity (30%)**: Is the function called by any other file in the repository?
*   **Context (20%)**: Is it a critical entry point (like `main.js` or `App.tsx`)?

### Step C: D3.js Visualization
The results are rendered as an interactive **Treemap**:
*   **Area**: Represents the size of the file/directory.
*   **Color**: Intensity from **Electric Green** to **Deep Crimson** indicates the Dead Score.
*   **Interaction**: Users can drill down into subdirectories to find specific legacy "hotspots."

---

## 4. How the Website Helps You
1.  **Safe Pruning**: Confidence to delete "never-called" code globally.
2.  **Visual ROI**: Instantly show stakeholders the "red" areas that need a budget for refactoring.
3.  **Onboarding Clarity**: Give new hires a map of which folders are active versus which ones are legacy ghosts.
4.  **Optimized Bundle Size**: Target the largest "red" files for immediate removal to speed up the app.

---

## 5. Technical Stack
*   **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion.
*   **Backend**: Node.js, Express, `adm-zip` for streaming uploads.
*   **Analytics**: AST Parsing with `@babel/parser`.
*   **Visualization**: D3.js (Data-Driven Documents).

---

## 6. Security and Deployment
*   **Privacy First**: The analysis is designed to run locally or within a private VPC, ensuring source code never leaves the internal perimeter.
*   **Modern UX**: A premium, "Material You" inspired interface that makes technical debt management feel like a modern dashboard experience.

---

## 7. Future Roadmap
*   **Automated Git Integration**: Polling GitHub/GitLab commits.
*   **AI-Assisted Deletion**: Using LLMs to confirm if a "dead" function is actually part of an external public API.
*   **Visual Diffing**: Tracking the "Greening" of the map over multiple months as debt is paid off.

---
*Created by the Dead Code Finder Team - 2026*
