# TR-Zero Web Dashboard

Interactive web interface for the TR-Zero Decarbonization Simulation Engine. This frontend visualizes carbon pricing trajectories, agent permit trading interactions, and optimization outputs.

Built with **React**, **TypeScript**, and **Vite**; configured for deployment on Vercel.

---

## Interface Features

* **Scenario Modeler:** Inputs variables such as target year, carbon cap restrictions, and carbon pricing rates to visualize simulated results.
* **Agent Trade Visualization:** Tracks transaction nodes representing carbon allowance trading between virtual plant agents.
* **Analytical Dashboards:** Displays energy generation distributions and carbon intensity indexes using optimized charting libraries.
* **Structured Natural Language Querying:** Integrates with the Gemini API to query database logs using natural language.

---

## Technical Specifications

* **State Management:** React Context API for localized theme and database run states.
* **Styles:** Vanilla CSS utilizing custom properties for high-performance dark themes.
* **Module Bundler:** Vite for optimized tree-shaking and production bundling.

---

## Installation and Deployment

### Local Development
1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/frydomesticus/tr-zero-web.git
   cd tr-zero-web
   npm install
   ```
2. Configure environment variables in `.env.local`:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

### Production Build
To build the optimized static assets:
```bash
npm run build
```
The output directory will be `dist/`, which is ready to be hosted on Vercel or Netlify.
```
