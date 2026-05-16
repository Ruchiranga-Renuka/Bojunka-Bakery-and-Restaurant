const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDb = require('./config/db');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

connectDb();

app.use('/api/auth', require('./routes/auth'));
app.use('/api/restaurant', require('./routes/restaurant'));
app.use('/api/bakery', require('./routes/bakery'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
