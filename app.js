const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.set('views');

app.get('/', (req, res) => {
    res.send("Welcome to the safety pin");
})

app.listen(3000, () => {
    console.log("Listening on port 3000");
})