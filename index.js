const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const loginSignUpRoutes = require('./routes/loginSignUp');
const expRouter = require('./routes/expenseRoutes');
const orderRouter = require('./routes/orderRoutes');
const {syncDB} = require('./models/centralized');

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static('public'));

app.use('/expense',expRouter);

app.use('/auth',loginSignUpRoutes);

app.use('/payment',orderRouter);



syncDB().then(() => {
    app.listen(3000, () => console.log('Server running on port 3000'));
}).catch(err=>{
    console.error('error while starting server',err);
});
