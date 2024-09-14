const express = require('express');
const bodyParser = require('body-parser');
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
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.static('public'));


app.use('/signup', (req, res, next) => {
    res.sendFile('signup2.html', { root: 'views' });
})
app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumFeatureRoutes);
app.use('/password', passwordRoutes);
app.get('/home', (req, res) => {
    res.sendFile('home.html', { root: 'views' });
})
app.get('/', (req, res) => {
    res.sendFile('notfound.html', { root: 'views' });
});


const PORT = process.env.PORT;

mongoose.connect(process.env.DB_HOST)
    .then(res => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}...`);
        })
    })
    .catch(err => console.log(err));





