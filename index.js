const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const loginSignUpRoutes = require('./routes/loginSignUp');
const expRouter = require('./routes/expenseRoutes');
const orderRouter = require('./routes/orderRoutes');
const leaderboardRouter = require('./routes/leadershipRoutes')
const forgotpasswordRouter = require('./routes/forgetPassword');
const {syncDB} = require('./models/centralized');
const premiumRoutes = require('./routes/premiumTable');
require('dotenv').config()
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');


app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static('public'));

// write logging data in this file
const accessLogStream = fs.createWriteStream(
    path.join(__dirname,'access.log'),
    {flags :'a'}
)

app.use(morgan('combined',{stream:accessLogStream}))

app.use('/expense',expRouter);

app.use('/auth',loginSignUpRoutes);

app.use('/payment',orderRouter);

app.use('/premium',leaderboardRouter);

app.use('/password',forgotpasswordRouter);

app.use('/table', premiumRoutes); 

syncDB().then(() => {
    app.listen(process.env.PORT, () => console.log('Server running on port 3000'));
}).catch(err=>{
    console.error('error while starting server',err);
});
