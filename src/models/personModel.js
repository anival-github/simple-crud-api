const { v4: uuidv4 } = require('uuid');

let persons = [{
    id: '75442486-0878-440c-9db1-a7006c25a39f',
}, 2, 3];

const findAll = () => {
    return new Promise((resolve, reject) => {
        resolve(persons)
    })
}

const findById = async (id) => {
    const person = persons.find((elem) => elem.id === id);
    return person;
}

const create = async (person) => {
    const newPerson = { id: uuidv4(), ...person };
    persons.push(newPerson);
    return newPerson;
}

const update = async (id, person) => {
    const personIndex = persons.findIndex((elem) => elem.id === id);

    persons[personIndex] = { id, ...person };

    return persons[personIndex];
}

const remove = async (id) => {
    persons = persons.filter((elem) => elem.id !== id);
    return;
}

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove,
}