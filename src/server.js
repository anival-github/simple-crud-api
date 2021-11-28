const dotenv = require('dotenv');
const http = require('http');
const { getPersons, getPerson, createPerson, updatePerson, deletePerson } = require('./controllers/personController');
const { validate } = require('uuid'); // ToDo add validation for uuid string

let PORT;
const result = dotenv.config();

if (result.error) {
    throw result.error
} else {
    PORT = process.env.PORT;
}

const server = http.createServer((req, res) => {
    if (req.url === '/person' && req.method === 'GET') {
        getPersons(req, res);
    } else if (req.url.match(/\/person\/([0-9A-F\-]+)/i) && req.method === 'GET') {
        const id = req.url.split('/')[2];
        const isIdValid = validate(id);

        if (isIdValid) {
            getPerson(req, res, id);
        } else {
            res.writeHead(400, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ message: 'PersonId is not valid' }))
        }
    } else if (req.url === '/person' && req.method === 'POST') {
        createPerson(req, res);
    } else if (req.url.match(/\/person\/([0-9A-F\-]+)/i) && req.method === 'PUT') {
        const id = req.url.split('/')[2];
        const isIdValid = validate(id);

        if (isIdValid) {
            updatePerson(req, res, id);
        } else {
            res.writeHead(400, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ message: 'PersonId is not valid' }))
        }
    } else if (req.url.match(/\/person\/([0-9A-F\-]+)/i) && req.method === 'DELETE') {
        const id = req.url.split('/')[2];
        const isIdValid = validate(id);

        if (isIdValid) {
            deletePerson(req, res, id);
        } else {
            res.writeHead(400, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ message: 'PersonId is not valid' }))
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ message: 'Route not found' }))
    }
})

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

module.exports = server;