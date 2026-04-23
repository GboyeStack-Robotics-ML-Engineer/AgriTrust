# AgriTrust Edge

[![Live App](https://img.shields.io/badge/Live_Deployment-View_App-2ea44f?style=for-the-badge&logo=vercel)](https://agritrust-edge-186579904097.us-west1.run.app/)

**Live Application:** [https://agritrust-edge-186579904097.us-west1.run.app/](https://agritrust-edge-186579904097.us-west1.run.app/)

---

## 🌍 Overview
AgriTrust Edge is a groundbreaking platform that merges agricultural telemetry with fintech to solve the alternative credit scoring problem for smallholder farmers. 

By analyzing local field scans (simulating Edge Computer Vision devices) and combining them with historical financial transaction volume (Mobile Money / MoMo logs), the system generates an immutable "AgriTrust Score." This enables confident, algorithmic underwriting for micro-loans in regions lacking traditional banking infrastructure.

## 🚀 Features
- **Biology Matrix:** AI-driven real-time analysis of crop health, pathogen status, and harvest yield capabilities.
- **MoMo Ledger Integration:** Fusion of financial footprints via mobile money transfer volume and utility payment history.
- **Trust Scoring Engine:** Advanced, weighted logic outputting a definitive, risk-assessed credit score (300-850 scale).
- **Edge Node Dashboard:** A premium, interactive terminal bridging offline field data uploads with backend diagnostic compute nodes.

---

## 💻 Detailed Run Instructions

Follow these instructions to run the AgriTrust Edge platform locally on your machine.

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 1. Installation
Clone the repository, navigate into the project directory, and install all required framework dependencies:

```bash
# Clone the repository
git clone <your-repository-url>

# Navigate into the project
cd agritrust-edge

# Install dependencies
npm install
```

### 2. Environment Configuration
The application relies on an artificial intelligence API to analyze crop images in the backend. You must configure your environment variables for this feature to work.

1. Create a local `.env` file by copying the provided example template:
   ```bash
   cp .env.example .env
   ```
2. Open your new `.env` file in a code editor.
3. Locate the `GEMINI_API_KEY` variable and paste your secure AI API key inside the quotes. 
   *(This key is strictly required to power the `POST /api/analyze-crop` backend route).*

### 3. Running the Development Server
Once dependencies are installed and the `.env` file is configured, boot up the local full-stack server:

```bash
npm run dev
```

The server will bind to port `3000`. 
Open [http://localhost:3000](http://localhost:3000) in your web browser to interact with the frontend and test the data fusion dashboard.

### 4. Building for Production
To compile the React/Vite frontend into static assets and run the optimized Express framework:

```bash
# Create the optimized production build
npm run build

# Start the Node.js production server
npm run start
```
