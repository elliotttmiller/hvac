import express from 'express';
import cors from 'cors';
import { stage1Extraction, stage2Analysis } from './aiService.js';

const app = express();
const PORT = process.env.PORT_SERVER || 4000;

app.use(cors());
app.use(express.json({ limit: '25mb' }));

app.post('/api/ai/extract', async (req, res) => {
  try {
    const { base64Image, mimeType } = req.body;
    if (!base64Image) return res.status(400).json({ error: 'missing base64Image' });
    const result = await stage1Extraction(base64Image, mimeType || 'image/png');
    res.json(result);
  } catch (err) {
    console.error('extract error', err);
    res.status(500).json({ error: 'internal_error', detail: String(err) });
  }
});

app.post('/api/ai/analyze', async (req, res) => {
  try {
    const { base64Image, mimeType, detectedComponents } = req.body;
    if (!base64Image) return res.status(400).json({ error: 'missing base64Image' });
    const result = await stage2Analysis(base64Image, mimeType || 'image/png', detectedComponents || []);
    res.json(result);
  } catch (err) {
    console.error('analyze error', err);
    res.status(500).json({ error: 'internal_error', detail: String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`AI proxy server listening on port ${PORT}`);
});
