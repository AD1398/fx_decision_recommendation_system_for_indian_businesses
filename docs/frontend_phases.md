# FX Decision System: Frontend Development Roadmap (Phase-Wise)

This roadmap outlines the systematic development of the **FX Decision Recommendation Dashboard**. We transition from a static design to a fully integrated, data-driven analytical platform.

---

## 🎨 Core Tech Stack & UI Principles
- **Framework**: React + Vite (Vanilla CSS)
- **Visuals**: Chart.js / react-chartjs-2 (Advanced Analytics)
- **Icons**: Lucide-React
- **Aesthetic**: **Dark Premium** (Deep blacks, Glassmorphism, Cyber-Neon accents)

---

## � Roadmap Breakdown

### 🛠️ Phase 1: Architecture & UI Foundation
*Focus: Environment setup and design system implementation.*

- [x] **1.1 Workspace Init**: Verify Vite project structure and essential dependencies.
- [x] **1.2 CSS Infrastructure**: Define `:root` variables for colors (`#0A0A0B`, `#2563EB`, etc.) and glassmorphism utilities.
- [/] **1.3 Component Framework**: Design reusable `GlassCard`, `StatusPill`, and `Typography` components.
- [ ] **1.4 Premium Shell**: Create a high-fidelity dashboard layout with fixed sidebar and responsive main stage.

---

### � Phase 2: Backend Bridge (API Integration)
*Focus: Connecting the React frontend to the Python FX Engine.*

- [ ] **2.1 API Bridge**: Develop a lightweight Flask/FastAPI server (`api_bridge.py`) that executes `FXEngine`.
- [ ] **2.2 Endpoint Development**: 
  - `GET /api/status`: Returns current rate and model health.
  - `GET /api/recommendation`: Returns the final hedge/wait decision.
  - `GET /api/metrics`: Returns 7-day forecast and volatility data.
- [ ] **2.3 Data Fetching Hook**: Implement a custom React hook (`useFXData`) to poll the API and handle loading states.

---

### � Phase 3: Analytical Visualizations
*Focus: Interactive data representation using Chart.js.*

- [ ] **3.1 Spot Rate Tracker**: A real-time line chart showing historical vs. current rates.
- [ ] **3.2 Forecast Engine Chart**: Visualize the 7-day Prophet forecast with confidence intervals.
- [ ] **3.3 Risk Heatmap**: A radial gauge or bar chart displaying the 60/40 weighted risk components.
- [ ] **3.4 Exposure Matrix**: Interactive table showing impact across Importer, Exporter, and IT personas.

---

### 🤖 Phase 4: Recommendation Dashboard
*Focus: Presenting actionable intelligence prominently.*

- [ ] **4.1 Decision Hub**: The "Hero" component showing the final recommendation (e.g., "HEDGE IMMEDIATELY").
- [ ] **4.2 Reasoning Module**: Tooltips or modal popups explaining the logic (e.g., "High Volatility detected + Upward Trend").
- [ ] **4.3 Action Center**: UI for business inputs (e.g., inputting custom exposure amounts to see live updates).

---

## ✨ Phase 5: Polish & Excellence
*Focus: Transitions and professional micro-interactions.*

- [ ] **5.1 Reveal Effects**: Smooth staggered entry for cards using CSS keyframes.
- [ ] **5.2 Hover Dynamics**: Neon border glows and subtle scale transforms on interactive elements.
- [ ] **5.3 Responsive Optimization**: Ensure the dashboard is flawless on tablet and desktop resolutions.

---

## � Phase 6: Final Deployment & Documentation
*Focus: Handoff and production readiness.*

- [ ] **6.1 Performance Check**: Optimize asset delivery and chart rendering speeds.
- [ ] **6.2 End-to-End Testing**: Verify flow from Raw Data -> FX Engine -> API -> Dashboard.
- [ ] **6.3 Technical Walkthrough**: Complete the `walkthrough.md` with final UI screenshots and instructions.
