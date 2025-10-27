// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs'); 
const path = require('path');

const BudgetItem = require('./models/BudgetItem');

const app = express();
const port = 3000;

// allow JSON body in POST requests
app.use(express.json());

// allow frontend to call us
app.use(cors());


mongoose.connect('mongodb://127.0.0.1:27017/personalbudgetDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✅ Connected to MongoDB');
}).catch((err) => {
    console.error('❌ MongoDB connection error:', err);
});


app.get('/budget', async (req, res) => {
    try {
        const items = await BudgetItem.find({});
        // shape this like the old API so your frontends don't break
        res.json({
            myBudget: items.map(item => ({
                title: item.title,
                budget: item.budget,
                color: item.color
            }))
        });
    } catch (err) {
        console.error('GET /budget error:', err);
        res.status(500).json({ error: 'Failed to fetch budget data' });
    }
});


app.post('/budget', async (req, res) => {
    try {
        const { title, budget, color } = req.body;

        const newItem = new BudgetItem({
            title,
            budget,
            color
        });

        const saved = await newItem.save();
        res.status(201).json(saved);

    } catch (err) {
        console.error('POST /budget error:', err);
        res.status(400).json({
            error: 'Failed to create budget item',
            details: err.message
        });
    }
});


app.get('/seed', async (req, res) => {
    try {
        const file = path.join(__dirname, 'budget.json');
        const text = fs.readFileSync(file, 'utf8');
        const json = JSON.parse(text);

        
        const docs = json.myBudget.map((item, i) => ({
            title: item.title,
            budget: item.budget,
            color: item.color || defaultColor(i)
        }));

        await BudgetItem.deleteMany({}); // clear any old data
        const inserted = await BudgetItem.insertMany(docs);

        res.json({
            message: 'seeded',
            count: inserted.length
        });

    } catch (err) {
        console.error('/seed error:', err);
        res.status(500).json({ error: 'Seed failed', details: err.message });
    }
});

function defaultColor(i) {
    const palette = ['#ffcd56', '#ff6384', '#36a2eb', '#fd6b19', '#98abc5', '#8a89a6', '#7b6888'];
    return palette[i % palette.length];
}

app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`);
});
