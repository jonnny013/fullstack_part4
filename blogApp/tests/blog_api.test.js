const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
}, 10000)

test('check for json format', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
}, 10000)

test('check for unique id', async () => {
    const resultBlog = await api
        .get(`/api/blogs`)
    expect(resultBlog.body[0]._id).toBeDefined()
})

afterAll(async () => {
  await mongoose.connection.close()
})

module.exports = () => {
  process.exit(0)
}