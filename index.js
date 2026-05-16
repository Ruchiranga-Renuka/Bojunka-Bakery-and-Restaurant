const express = require('express');
const app = express();
const restaurantRoutes = require('./routes/restaurant');
const bakeryRoutes = require('./routes/bakery');

app.use(express.json());

app.use('/restaurant', restaurantRoutes);
app.use('/bakery', bakeryRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
