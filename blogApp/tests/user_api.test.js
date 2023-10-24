const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const bcrypt = require('bcrypt')

describe('Three users initially in DB', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        await api
            .post('/api/users')
            .send(helper.initialUsers[0])
        await api
            .post('/api/users')
            .send(helper.initialUsers[1])
        const passwordHash = await bcrypt.hash('secret', 10)
        const user = new User({ username: 'Test', name: 'test', passwordHash })
        await user.save()
    }, 100000)

    test('check initial users are stored', async () => {
        const users = await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(users.body).toHaveLength(3)
    })

    test('log in test', async () => {
        const userOne = {
            username: 'TestOne',
            password: '123'
        }
        const response = await api
            .post('/api/login')
            .send(userOne)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        console.log(response)
    })

    test('Check validator is working for username', async () => {
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            username: 'Test',
            name: 'abc',
            password: 'abc'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toEqual(usersAtStart)
    })
})

describe('Creating new users in DB',  () => {
    beforeEach(async () => {
        await User.deleteMany({})
        await User.insertMany(helper.initialUsers)
    }, 10000)

    test('password is too short', async () => {
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            username: 'I like short passwords',
            name: 'Dummy',
            password: '12'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(403)
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toEqual(usersAtStart)
    })

    test('username field left empty', async () => {
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            username: '',
            name: 'Oops',
            password: '123'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toEqual(usersAtStart)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})

module.exports = () => {
    process.exit(0)
}

// npm test -- tests/user_api.test.js
//npm test -- -t 'username field left empty'