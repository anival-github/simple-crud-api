# simple-crud-api

Here you can find a simple CRUD API using in-memory database underneath.

To run the app, please go through the following steps:
## 1. Download the app on your local machine

Run the follwing command in your terminal:

    https://github.com/anival-github/simple-crud-api.git

## 2. Go to the downloaded repository

## 3. Go to the branch **task-3-simple-crud-api**

Run the follwing command in your terminal:

    git checkout task-3-simple-crud-api

## 4. Install dependencies

Run the follwing commaind in your terminal:

    npm i

## 5. Start app

To run the app in the development-mode, you need to enter

    npm run start:dev

To run the app in the production-mode, you need to enter

    npm run start:prod

Since the app is running, there will be to following routes available:

- GET /person or /person/${personId} should return all persons or person with corresponding personId
- POST /person is used to create record about new person and store it in database
- PUT /person/${personId} is used to update record about existing person
- DELETE /person/${personId} is used to delete record about existing person from database

Persons are stored as objects that have following properties:
- id — unique identifier (string, uuid) generated on server side
- name — person's name (string, required)
- age — person's age (number, required)
- hobbies — person's hobbies (array of strings or empty array, required)

## 6. Test app

To test the app, run the follwing command in your terminal:

    npm run test
