const { validate } = require('uuid');
const supertest = require('supertest');
const server = require('../src/server');
const { persons } = require('../src/models/personModel');

const newPerson = {
    "name": "Alex",
    "age": 31,
    "hobbies": ["reading", "football"],
};

describe('first scenario: standart flow', () => {
    let addedPerson;

    test('first GET request - return all persons (empty array for the moment) ', async () => {
        const response = await supertest(server).get('/person');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
    })

    test('POST request - create a person, return newly created person', async () => {
        const response = await supertest(server)
            .post('/person')
            .send(newPerson)
            .set('Accept', 'application/json')

        addedPerson = response.body;

        const {
            name,
            age,
            hobbies,
            id,
        } = response.body;

        expect(response.statusCode).toBe(201);
        expect(validate(id)).toBeTruthy();

        expect({ name, age, hobbies }).toMatchObject(newPerson);
    })

    test('GET request - try to fetch newly created person by his id', async () => {
        const response = await supertest(server).get(`/person/${addedPerson.id}`)
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(addedPerson)
    })

    test('PUT request - try to update person by his id', async () => {
        const response = await supertest(server)
            .put(`/person/${addedPerson.id}`)
            .send({ name: 'Alex updated' })
            .set('Accept', 'application/json')

        const {
            name,
            age,
            hobbies,
            id,
        } = response.body;

        expect(response.statusCode).toBe(200);

        expect(name).toBe('Alex updated')
        expect({ id, hobbies, age }).toMatchObject({
            id: addedPerson.id,
            age: addedPerson.age,
            hobbies: addedPerson.hobbies,
        })

        addedPerson = response.body;
    })

    test('DELETE request - should return confirmation of deletion', async () => {
        const response = await supertest(server).delete(`/person/${addedPerson.id}`)
        expect(response.statusCode).toBe(204);
    })

    test('GET request - should return 404 status code', async () => {
        const response = await supertest(server).get(`/person/${addedPerson.id}`)
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Person not found');
    })


    afterAll(() => {
        server.close()
    })
})
