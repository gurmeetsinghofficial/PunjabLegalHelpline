const http = require('http');
const express = require('express');

const indexRouter = require('./routes/index');
const path = require('path');

const hostname = '0.0.0.0';
const port = 80;
const app = express();
const PORT = 1313;
console.log(__dirname+ 'testing')

app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/',indexRouter);

// Define a catch-all route for any other requests
app.use((req, res) => {
    res.render('errorPage');
    // res.status(404).send('Sorry, page not found.');
});

app.listen(PORT, function(err){
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});