const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

describe('Two users initially in DB', () => {
    let authorization
    beforeEach(async () => {
        await User.deleteMany({})
        const newUser = {
            username: 'tester',
            name: 'test',
            password: 'password'
        }
        const response = await api
            .post('/api/users')
            .set('Content-Type', 'application/json')
            .send (newUser)
        const result = await api
            .post('/api/login')
            .send(newUser)

        authorization = {
            Authorization: `Bearer ${result.body.token}`
        }
        console.log(authorization)

    }, 100000)
    test('check initial users are stored', async () => {
        const users = await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(users.body).toHaveLength(1)
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