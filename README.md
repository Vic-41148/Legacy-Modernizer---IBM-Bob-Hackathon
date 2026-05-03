# ModernizeAI 🚀

> **Automating Enterprise Java Modernization with IBM Bob**
> 
> *Built for the IBM Bob Hackathon 2026*

Legacy Java modernization costs enterprises weeks of engineering and millions of dollars. **ModernizeAI** is a centralized "Migration Factory" dashboard that wraps the incredible power of the **IBM Bob IDE** engine, allowing entire enterprise teams to automate the migration of Java 8 / Spring Boot 2 codebases to Java 17 / Spring Boot 3 in minutes.

---

## 🌟 The Vision

IBM Bob is a phenomenal AI coding assistant, but for an enterprise trying to modernize 500,000 lines of legacy Java, having developers manually open every file in an IDE to prompt an AI simply doesn't scale. 

We built **ModernizeAI** to take Bob out of the IDE and turn it into an automated pipeline. 
Instead of migrating one file at a time, a project manager drops an entire legacy repository into our web dashboard. Our platform:
1. Analyzes the architecture
2. Generates a migration plan
3. Rewrites the codebase to Java 17
4. Generates JUnit 5 tests
5. Provides a real-time Audit Trail and Unified Diff Viewer for human review.

**We turned a developer tool into a multi-million dollar B2B SaaS modernization product.**

---

## ✨ Key Features

- **Automated Workflow Pipeline:** Drop a ZIP of legacy `.java` files in, and the system automatically orchestrates the IBM Bob engine through 5 massive phases of modernization.
- **Enterprise Audit Trail:** A Live Terminal stream logs every action, dependency change, and AI decision made by Bob during the refactoring process.
- **Interactive Diff Viewer:** Powered by Monaco Editor, engineers can review side-by-side or unified diffs of the legacy code vs. the AI-modernized code, and manually tweak the AI's output before merging.
- **Risk Assessment Tree:** A color-coded repository view (Red/Amber/Green) highlighting files that require architectural changes (like `pom.xml` dependency updates or deprecated `javax` imports).
- **One-Click Export:** Download the fully modernized, compile-ready codebase instantly.

---

## 🛠️ Tech Stack

**Frontend:**
- **React 18 & Vite:** High-performance UI rendering.
- **Tailwind CSS:** Modern, responsive, and stunning user interface.
- **Monaco Editor:** Industry-standard code diff viewing (the engine behind VS Code).
- **Lucide React:** Beautiful, clean iconography.

**Backend:**
- **Node.js & Express:** Lightweight, fast REST API orchestration.
- **WebSockets (ws):** Real-time, bi-directional streaming of terminal logs and file progress.
- **Multer:** Secure, heavily-validated file processing.

---

# Team

## Team 7 | IBM Bob Hackathon — India

### Aditya Shibu
### Ujjwal
### Rakesh


---

## 🚀 Running the Project Locally

### 1. Prerequisites
- Node.js (v18+)
- npm or yarn
- Local IBM Bob IDE Installation

### 2. Installation
Clone the repository and install dependencies for both the frontend and backend:

```bash
git clone https://github.com/Vic-41148/Legacy-Modernizer---IBM-Bob-Hackathon.git
cd Legacy-Modernizer---IBM-Bob-Hackathon

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Start the Application
You can start both servers simultaneously from the root directory:

```bash
# From the project root
npm run dev
```

Alternatively, run them in separate terminals:
- **Backend:** `cd backend && npm run dev` (Runs on port 3001)
- **Frontend:** `cd frontend && npm run dev` (Runs on port 5173)

Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

---

## 📂 IBM Bob Integration (`/bob_sessions`)

The true heavy lifting of this project is done by the **IBM Bob IDE**. 
To ensure a flawless demonstration and prove enterprise reliability without the risk of live-demo timeouts, this application implements a robust **Decoupled Data-Playback Architecture**. 

1. We use the IBM Bob IDE locally to run real migrations (e.g., migrating the Spring PetClinic repo).
2. The AI's outputs, analysis JSONs, diffs, and generated tests are exported to the `/bob_sessions` directory.
3. The ModernizeAI backend orchestrates these outputs into a seamless, real-time WebSocket stream for the dashboard.

*Note: For details on the exact prompts used in the IBM Bob IDE to generate the migrated data, please refer to the submission documentation.*

---

## ⚖️ License

Built with ❤️ for the IBM Bob Hackathon.
