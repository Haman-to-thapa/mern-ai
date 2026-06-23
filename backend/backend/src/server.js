import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

import productRoutes from './routes/products.js';
import { initSchema } from './db/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

initSchema().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
