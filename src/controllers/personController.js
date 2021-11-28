const Person = require('../models/personModel');
const { getPostData } = require('../Utils');

// @desc Get all Persons
// @route GET /person
const getPersons =  async (req, res) => {
    try {
        const persons = await Person.findAll()

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(persons))
    } catch (error) {
        console.log(error)
    }
}

// @desc Get single Person
// @route GET /person/:id
const getPerson = async (req, res, id) => {
    try {
        const person = await Person.findById(id)

        if (!person) {
            res.writeHead(404, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ message: 'Person not found '}))
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(person))
        }
    } catch (error) {
        console.log(error)
    }
}

// @desc Create new Person
// @route POST /person
const createPerson =  async (req, res) => {
    try {
        const body = await getPostData(req);

        const { name, age, hobbies } = body;

        if (!name || !age || !hobbies) {
            res.writeHead(400, { 'Content-type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Please, specify required fields: name, age, hobbies' }));
        }

        const person = {
            name,
            age,
            hobbies,
        }

        const newPerson = await Person.create(person);

        res.writeHead(201, { 'Content-type': 'application/json' });

        return res.end(JSON.stringify(newPerson));
    } catch (error) {
        console.log(error)
    }
}

// @desc Update single Person
// @route PUT /person/:id
const updatePerson = async (req, res, id) => {
    try {
        const person = await Person.findById(id)

        if (!person) {
            res.writeHead(404, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ message: 'Person not found '}))
        } else {
            const body = await getPostData(req);

            const { name, age, hobbies } = body;

            const personData = {
                name: name || person.name,
                age: age || person.age,
                hobbies: hobbies || person.hobbies,
            }

        const updatedPerson = await Person.update(id, personData);

        res.writeHead(200, { 'Content-type': 'application/json' });

        return res.end(JSON.stringify(updatedPerson));

        }
    } catch (error) {
        console.log(error)
    }
}

// @desc Delete single Person
// @route DELETE /person/:id
const deletePerson =  async (req, res, id) => {
    try {
        const person = await Person.findById(id)

        if (!person) {
            res.writeHead(404, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ message: 'Person not found '}))
        } else {
            await Person.remove(id);
            res.writeHead(204, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ message: `Person ${id} removed` }))
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    getPersons,
    getPerson,
    createPerson,
    updatePerson,
    deletePerson,
}
