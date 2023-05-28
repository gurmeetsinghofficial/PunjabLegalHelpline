const express = require('express');
const router = express.Router();
// const db = require('../public/js/database');
const dbModel = require('../public/models/db-model');
const sendEmail = require('../public/models/sendEmailModel');
const fillRequiredAdvocateForm = require('../public/models/fillRequiredAdvocateForm');
const fillContactUsForm = require('../public/models/fillContactUsForm');

let language = 'pan';
let mailSentSuccessfully = false;
router.get('/test', (req, res) => {
    res.render('test')
})

router.post('/set-language', (req, res) => {
    const selectedLanguage = req.body.language;
    language = selectedLanguage;
    res.redirect('/');
});

router.get('/', async (req, res) => {
    let state = 'Punjab';
    if (req && req.params && req.params.state) {
        state = req.params.state;
    }
    let query;
    if (state) {
        query = `select distinct city,cityInPunjabi from Advocates where state='${state}';`;
    } else {
        query = 'select distinct city,cityInPunjabi from Advocates;';
    }
    let result = await dbModel.executeQuerySync(query);
    let cities=[{city: 'Patiala'}, {state: 'Rajpura'}];
    if(result && result.length>0) {
        cities = result;
    }
    res.render(`cityList_${language}`, {language:language, cities: cities, state: state, chatWidget: 'chat-widget' });
})

router.get('/home', (req, res) => {
    
    if(mailSentSuccessfully === true ) {
        mailSentSuccessfully=false;
        res.render(`home_${language}`, { language:language, message: 'Hello there!', chatWidget: 'chat-widget',showSuccess: true  });
    }
    else {
        res.render(`home_${language}`, { language:language, message: 'Hello there!', chatWidget: 'chat-widget',showSuccess: false  });
    }
})

router.get('/contact', (req, res) => {
    res.render(`contact_${language}`, { language:language });
})

router.get(`/listOfAdvocates/:city`, async (req, res) => {
    let city = 'Patiala';
    if (req && req.params && req.params.city) {
        city = req.params.city;
    }
    let advocates = [
        {name: 'Amaninder Singh', experience: 10, age: 30, imageName: 'Amaninder.jpg', imageAvailable: 1}, 
    ];
    let query = `select * from Advocates where city='${city}' order by experience desc;`;
    let result = await dbModel.executeQuerySync(query);
    if (result && result.length>0) {
        advocates = result;
        if (language === 'pan') {
            city = result[0].cityInPunjabi
        }
    }
    res.render(`listOfAdvocates_${language}`, { language:language,advocates: advocates, city: city});
})

router.get('/city/:state', async (req, res) => {
    let state = 'Punjab';
    if (req && req.params && req.params.state) {
        state = req.params.state;
    }
    let query;
    if (state) {
        query = `select distinct city, cityInPunjabi from Advocates where state='${state}';`;
    } else {
        query = 'select distinct city, cityInPunjabi from Advocates;';
    }
    let result = await dbModel.executeQuerySync(query);
    let cities=[{city: 'Patiala'}, {state: 'Rajpura'}];
    if(result && result.length>0) {
        cities = result;
    }
    res.render(`cityList_${language}`, {language:language, cities: cities });
})

router.get('/city', async (req, res) => {
    let state = 'Punjab';
    if (req && req.params && req.params.state) {
        state = req.params.state;
    }
    let query;
    if (state) {
        query = `select distinct city,cityInPunjabi from Advocates where state='${state}';`;
    } else {
        query = 'select distinct city,cityInPunjabi from Advocates;';
    }
    let result = await dbModel.executeQuerySync(query);
    let cities=[{city: 'Patiala'}, {state: 'Rajpura'}];
    if(result && result.length>0) {
        cities = result;
    }
    res.render(`cityList_${language}`, {language:language, cities: cities });
})

router.get('/services', async (req, res) => {
    let query = 'select distinct state, stateInPunjabi from Advocates;';
    let result = await dbModel.executeQuerySync(query);
    let states=[{state: 'Haryana'}, {state: 'Punjab'}];
    if(result && result.length>0) {
        states = result;
    }
    res.render(`statesList_${language}`, {language:language, states: states });
})

router.get('/lawyersInfo/:id', async (req, res) => {
    let id = 1;
    if (req && req.params && req.params.id) {
        id = req.params.id;
    }
    let lawyerDesc = {
        name: 'Amaninder Singh',
        description: 'He has a deep understanding of the law and is able to apply his knowledge effectively to represent his clients. He possess excellent communication skills, is able to listen carefully to his clients\' needs and concerns, and is able to provide sound legal advice and representation.',
        rating: 4,
        experience: 10, 
        age: 30, 
        imageName: 'Amaninder.jpg',
        imageAvailable: 1,
    }
    let query = `select id,descriptionInPunjabi,nameInPunjabi,name,description,rating,experience,age,imageName,imageAvailable from Advocates where id=${id};`;
    let result = await dbModel.executeQuerySync(query);
    if(result && result.length>0) {
        lawyerDesc = result[0];
    }
    res.render(`Advocateinfo_${language}`, {language: language, lawyerDesc: lawyerDesc });
})

router.get('/about', (req, res) => {
    res.render(`about_${language}`, {language:language, message: 'Hello there!' });
})

router.get('/sendEmail/:id', (req, res) => {
    let id = 1;
    if (req && req.params && req.params.id) {
        id = req.params.id;
    }
    res.render(`sendEmail_${language}`, {language:language, idOfLawyer: id });
})

router.post('/sendAppointmentReq', async (req, res) => {
    let id = 1;
    if(req && req.body && req.body.idOfLawyer) {
        id = req.body.idOfLawyer;
    }
    let lawyerDesc = {
        name: 'Amaninder Singh',
        description: 'He has a deep understanding of the law and is able to apply his knowledge effectively to represent his clients. He possess excellent communication skills, is able to listen carefully to his clients\' needs and concerns, and is able to provide sound legal advice and representation.',
        rating: 4,
        experience: 10, 
        age: 30, 
        imageName: 'Amaninder.jpg',
        imageAvailable: 1,
    }
    let query = `select name from Advocates where id=${id};`;
    let result = await dbModel.executeQuerySync(query);
    if(result && result.length>0) {
        lawyerDesc.name = result[0].name;
    }
    let reqInfo = {
        lawyerRequired: lawyerDesc.name,
        nameOfClient: req.body.name,
        phnNo: req.body.phone,
        email: req.body.email,
    }
    await fillRequiredAdvocateForm.fillGoogleForm(reqInfo);
    console.log('Mail sent successfully');
    mailSentSuccessfully=true;
    res.redirect('/home');
});

router.post('/sendContactUsReq', async(req, res) => {
    let reqInfo = {
        nameOfClient: req.body.name,
        email: req.body.email,
        message: req.body.message,
    }
    await fillContactUsForm.fillGoogleForm(reqInfo);
    console.log('Mail sent successfully');
    mailSentSuccessfully=true;
    res.redirect('/home');
});

module.exports = router;