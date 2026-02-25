import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const GOOGLE_ENDPOINT = 'https://addressvalidation.googleapis.com/v1:validateAddress';

app.use(express.json());

app.post('/api/validate-address', async (req, res) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GOOGLE_MAPS_API_KEY não configurada no servidor.' });
  }

  try {
    const upstream = await fetch(`${GOOGLE_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      return res.status(upstream.status).send(text);
    }

    const data = await upstream.json();
    res.json(data);
  } catch (err) {
    console.error('Erro no proxy', err);
    res.status(500).json({ error: 'Erro inesperado ao validar o endereço.', detail: err instanceof Error ? err.message : String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy de validação rodando em http://localhost:${PORT}`);
});
