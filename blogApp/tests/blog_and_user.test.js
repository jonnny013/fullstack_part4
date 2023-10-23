const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

describe('Two users initially in DB', () => {
    let authToken
    beforeEach(async () => {
        await User.deleteMany({})
        await User.insertMany(helper.initialUsers)
    }, 10000)
    test('check initial users are stored', async () => {
        const users = await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(users.body).toHaveLength(2)
    })
    test('log in user one', async () => {
        const users = await helper.usersInDb()
        console.log(users)
        const userOne = {
            username: 'TestOne',
            password: '123'
        }
        const response = await api
            .post('/api/login')
            .send(userOne)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        authToken = response.body.token
        console.log(authToken)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})

module.exports = () => {
    process.exit(0)
}

// npm test -- tests/blog_and_user.test.js
//npm test -- -t 'username field left empty'