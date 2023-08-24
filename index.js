const express = require('express');
const shortid = require('shortid');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;


const urlDatabase = {};

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); 


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html'); 


app.post('/shorten', (req, res) => {
    const originalUrl = req.body.url;
    const shortUrl = shortid.generate();
    urlDatabase[shortUrl] = originalUrl;
    res.render('shortened.html', { originalUrl, shortUrl }); 
});

app.get('/:shortUrl', (req, res) => {
    const shortUrl = req.params.shortUrl;
    const originalUrl = urlDatabase[shortUrl];

    if (originalUrl) {
        res.redirect(originalUrl);
    } else {
        res.status(404).send('Short URL not found');
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});



