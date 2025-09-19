require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());

const offerRoutes = require('./routes/offerRoute');
const leadsRoutes = require('./routes/leadRoute');

const connectDB = require('./config/db.js');

app.use('/offer', offerRoutes);
app.use('/leads', leadsRoutes);


connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
