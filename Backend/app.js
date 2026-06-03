const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

const expenseRoutes = require('./routes/expense');
const userRoutes = require('./routes/user');
const purchaseRoutes = require('./routes/purchase');
const premiumFeatureRoutes = require('./routes/premiumFeature');
const passwordRoutes = require('./routes/password');
// Custom CORS configuration
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumFeatureRoutes);
app.use('/password', passwordRoutes);

app.use((req, res, next) => {
    res.status(404).json({ error: 'API route not found' });
});


const PORT = process.env.PORT;

mongoose.connect(process.env.DB_HOST)
    .then(res => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}...`);
        })
    })
    .catch(err => console.log(err));





