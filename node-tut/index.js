//Use express for web server
const express = require('express');

//Call that function and name it app so app is the server
const app = express();

//Give it this port, basically its domain
const port = 8383;

//Middleware
//Look for static content in public directory
app.use(express.static('public'));
//Telling server to expect json
app.use(express.json());
// app.use(midWare);

//Runs in-between requests
function midWare(req, res, next) {
    console.log("running middleware");

    //Having this here protects the routes by this middleware that checks for the key
    const { api_key } = req.query;
    console.log(api_key);
    if (!api_key) {
        return res.sendStatus(403);
    }
}

const friends = {};

//Lets things run in chronological time
//Two arguments, ms seconds in time and function
function cron(ms, fn) {
    async function cb() {
        clearTimeout(timeout);
        fn();
        setTimeout(cb, ms);
    }
    //calls this cb function at end of ms duration
    let timeout = setTimeout(cb, ms);
}

cron(2000, () => console.log(friends));

//routes where user gets sent and what is shown based on what the response is
//Note you only wants one get verb for each route
app.get('/mark/welcome', (req, res) => {
    //200-299 successful
    //300 not often used
    //400 failures
    //500 error occurred on server

    //Can chain like so
    res.status(200).send('<h1 style="color: blue">hello world!! its working</h1>');
})

//You send something and get a confirmed response
//adding midWare protects this route
app.get('/friends/:id', midWare, (req, res) => {
    //request queries and parameters
    const { id } = req.params;

    //can check for api keys as example
    const { api_key } = req.query;
    console.log(id, api_key);
    if (!api_key) {
        res.sendStatus(403);
    }

    res.status(200).send(friends[id]);
})

app.post('/friends', (req, res) => {
    //Do something with what it receives
    const { friend, adjective } = req.body;
    console.log(friend);
    //Rewrite example
    friends[friend] = adjective;
    res.sendStatus(200);
})

app.patch('/friends', async (req, res) => {
    const { friend, newAdjective } = req.body;
    friends[friend] = newAdjective;
    res.status(200).send(friends);
})

app.put('/friends', (req, res) => {

})

app.delete('/friends', (req, res) => {
    const { friend } = req.body;
    delete friends[friend];
    res.status(200).send(friends);
})

//Listen to the requests in the port and when server starts show message
app.listen(port, () => console.log(`Server has started on port: ${port}`));