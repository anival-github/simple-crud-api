const { validate, v4: uuidv4} = require('uuid');
const supertest = require('supertest');
const server = require('../src/server');

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

    afterEach(() => {
        server.close()
    })
})

describe('second scenario: wrong requests handling', () => {
    test('not existing path) ', async () => {
        const response = await supertest(server).get('/person/there-is-no-such-a-path');
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toEqual('Route not found');
    })

    test('GET request - invalid id in request params) ', async () => {
        const response = await supertest(server).get('/person/1234');
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual('PersonId is not valid');
    })

    test('GET request - person is not found) ', async () => {
        const id = uuidv4()
        const response = await supertest(server).get(`/person/${id}`);
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toEqual('Person not found');
    })

    test('POST request - adding person with no mandatory field) ', async () => {
        const response = await supertest(server)
            .post('/person')
            .send({ name: 'Alex' })
            .set('Accept', 'application/json')

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual('Please, specify required fields: name, age, hobbies');
    })

    test('PUT request - invalid id in request params) ', async () => {
        const response = await supertest(server).put('/person/1234');
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual('PersonId is not valid');
    })

    test('PUT request - person is not found) ', async () => {
        const id = uuidv4()
        const response = await supertest(server).put(`/person/${id}`);
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toEqual('Person not found');
    })

    test('DELETE request - invalid id in request params) ', async () => {
        const response = await supertest(server).delete('/person/1234');
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual('PersonId is not valid');
    })

    test('DELETE request - person is not found) ', async () => {
        const id = uuidv4()
        const response = await supertest(server).delete(`/person/${id}`);
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toEqual('Person not found');
    })

    afterEach(() => {
        server.close()
    })
})


describe('fourth scenario: test presons quantity', () => {
    const personsQuantity = 10;

    test('first GET request - return all persons (empty array for the moment) ', async () => {
        const response = await supertest(server).get('/person');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
    })

    test('POST request - create a person 10 times, GET request - return 10', async () => {
        for (let i = 0; i < personsQuantity; i += 1) {
            await supertest(server)
                .post('/person')
                .send(newPerson)
                .set('Accept', 'application/json')
        }

        const response = await supertest(server).get('/person');

        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(personsQuantity);
    })

    afterEach(() => {
        server.close()
    })
})