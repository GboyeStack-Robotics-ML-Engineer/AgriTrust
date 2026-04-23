import { GoogleGenAI } from '@google/genai';
import express from 'express';
import multer from 'multer';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

// Set up Multer for handling file uploads in memory
const upload = multer({ storage: multer.memoryStorage() });

// Mock Financial Database
const MOCK_FINANCIAL_DATA: Record<string, any> = {
  'F-123': {
    farmerId: 'F-123',
    avgMonthlyTransactions: 45000,
    loanRepaymentHistory: 'good',
    tenureMonths: 24,
  },
  'F-456': {
    farmerId: 'F-456',
    avgMonthlyTransactions: 12000,
    loanRepaymentHistory: 'poor',
    tenureMonths: 6,
  },
};

// Initialize Gemini SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// The App APIs
app.post('/api/analyze-crop', upload.single('image'), async (req, res) => {
  try {
    const { farmer_id } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'Image file is required.' });
    }

    const farmerId = farmer_id || 'F-123';
    const financialData = MOCK_FINANCIAL_DATA[farmerId] || MOCK_FINANCIAL_DATA['F-123'];

    // Convert the uploaded image for Gemini processing
    const mimeType = file.mimetype;
    const base64Image = file.buffer.toString('base64');
    
    const prompt = `You are an expert agronomist and risk assessor. Analyze this crop image. 
1. Identify the crop and its current health status (e.g., healthy, pest-infested, nutrient-deficient). 
2. Assign a Crop Health Score from 1 to 100. 
Return the output STRICTLY as a JSON object with keys: "crop_type", "health_status", and "health_score".`;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Image,
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const aiText = response.text();
    if (!aiText) throw new Error("No response from Gemini");
    
    let cropAnalysis = {
      crop_type: 'Unknown',
      health_status: 'Unknown',
      health_score: 50,
    };
    
    try {
      cropAnalysis = JSON.parse(aiText);
    } catch (e) {
      console.error('Failed to parse Gemini response', aiText);
    }

    // Scoring Engine Logic
    // Base trust score on financial data (out of 400) + crop health (out of 450) to make 850 total
    let financialScore = 0;
    if (financialData.loanRepaymentHistory === 'good') financialScore += 250;
    else if (financialData.loanRepaymentHistory === 'mixed') financialScore += 150;
    else financialScore += 50;

    if (financialData.avgMonthlyTransactions > 30000) financialScore += 100;
    else if (financialData.avgMonthlyTransactions > 10000) financialScore += 50;
    
    if (financialData.tenureMonths > 12) financialScore += 50;

    // Crop score contribution (max 450)
    // Map AI's 1-100 score to 0-450
    const cropScoreContribution = (cropAnalysis.health_score / 100) * 450;
    
    const finalCreditScore = Math.min(850, Math.round(financialScore + cropScoreContribution));

    return res.json({
      cropAnalysis,
      financialData,
      creditScore: finalCreditScore
    });
  } catch (error) {
    console.error('Error analyzing crop:', error);
    res.status(500).json({ error: 'Failed to analyze crop image.' });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
