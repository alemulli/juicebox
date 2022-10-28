require('dotenv').config();
const PORT = 3000;
const express = require('express');
const server = express();

const bodyParser = require('body-parser');
server.use(bodyParser.json());

const morgan = require('morgan');
server.use(morgan('dev'));

server.use(express.json());


server.use((req, res, next) => {
    console.log("<____Body Logger START____>");
    console.log(req.body);
    console.log("<_____Body Logger END_____>");

    next();
})


// adds background color
// server.get('/background/:color', (req, res, next) => {
//     res.send(`
//     <body style="background: ${ req.params.color };">
//         <h1> hello world </h1>
//     </body>
//     `);
// });



// adds two numbers
// server.get('/add/:first/to/:second', (req, res, next) => {
//     res.send(`<h1>${ req.params.first } + ${ req.params.second } = ${
//       Number(req.params.first) + Number(req.params.second)
//      }</h1>`);
//   });




const apiRouter = require('./api');
server.use('/api', apiRouter);

const { client } = require('./db');
client.connect();

server.listen(PORT, () => {
    console.log('The server is up on port', PORT)
})