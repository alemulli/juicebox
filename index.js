const PORT = 3000;
const express = require('express');
const server = express();
const bodyParser = require('body-parser');

server.use(bodyParser.json());

const apiRouter = require('./api');
server.use('/api', apiRouter);

server.use((req, res, next) => {
    console.log("<____Body Logger START____>");
    console.log(req.body);
    console.log("<_____Body Logger END_____>");
})


server.listen(PORT, () => {
    console.log('the server is up on port')
})