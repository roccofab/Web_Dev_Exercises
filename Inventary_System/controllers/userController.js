const userModel = require('../models/userModel');

async function showRegisterPage(req, res){
    try{
        res.render('register', { success:null});
    }catch(err){
        res.status(500).send("error while retrieving registration page");
        console.log(err);
    }
}

module.exports = { showRegisterPage};