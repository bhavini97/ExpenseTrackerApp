const db = require('./db');
const User = require('./users');
const Expense = require('./expense');
const Order = require('./orders');
const syncDB = async()=>{
    try{
        await db.authenticate();
        console.log(' Database connection established');

        // Sync models
        await db.sync({ alter: true });

        console.log(' All tables synchronized');

    }
    catch(err){

        console.error('Error syncing database:', err);
    }
} 
module.exports = {User,Expense,Order,db,syncDB};