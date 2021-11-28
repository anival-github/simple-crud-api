const supertest = require('supertest');
const server = require('../src/server');
const { getPersons } = require('../src/controllers/personController');
const PersonsController = jest.requireActual('../src/controllers/personController');

const errorMessage = 'custom error';

jest.mock('../src/controllers/personController', () => ({
    getPersons: jest.fn(),
}));

describe('second scenario: general errors handling', () => {
    beforeEach(() => {
        getPersons.mockImplementation(PersonsController.getPersons);
    })

    test('GET request - get all persons - some error occure) ', async () => {
        getPersons.mockImplementation(() => {
            throw new Error(errorMessage)
        })

        const response = await supertest(server).get('/person');

        expect(response.statusCode).toBe(500);
        expect(response.body.message).toEqual(errorMessage);
    })

    test('first GET request - return all persons (empty array for the moment) ', async () => {
        const response = await supertest(server).get('/person');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
    })

    afterAll(() => {
        server.close()
    })
})
