// server.js
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env from project root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
console.log('ENV DUMP:', process.env);
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '[set]' : '[missing]');

// API route
const app = express();
app.use(express.json());

// Serve static files and fallback to Vite dev server for everything else
async function startServer() {
  // Dynamically import the handler after dotenv.config()
  const upsertProfileModule = await import('./src/pages/api/upsert-profile.js');
  const upsertProfileHandler = upsertProfileModule.default;
  app.post('/api/upsert-profile', upsertProfileHandler);

  const viteServer = await createViteServer({
    server: { middlewareMode: true },
    root: process.cwd(),
  });
  app.use(viteServer.middlewares);

  const port = process.env.PORT || 5173;
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

startServer();
