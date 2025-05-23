import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Zhansaya0089',
  database: 'balalar_kiim',
  waitForConnections: true,
  connectionLimit: 10,
});

// ✅ Жаңа маршрут: барлық өнімдер немесе фильтрмен
app.get('/api/products', async (req, res) => {
  try {
    const { gender, category } = req.query;

    let query = 'SELECT * FROM products';
    const params = [];

    if (gender || category) {
      const conditions = [];
      if (gender) {
        conditions.push('gender = ?');
        params.push(gender);
      }
      if (category) {
        conditions.push('category = ?');
        params.push(category);
      }
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Қате:', error);
    res.status(500).json({ error: 'Сервер қатесі' });
  }
});

// 🔎 Бір өнімді ID арқылы алу
app.get('/api/products/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({ error: 'ID дұрыс емес' });
    }

    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [productId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Өнім табылмады' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Қате:', error);
    res.status(500).json({ error: 'Сервер қатесі' });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер http://localhost:${PORT} мекенжайында іске қосылды`);
});
