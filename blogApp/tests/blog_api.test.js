const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

test('check for json format', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
}, 10000)

test('check for unique id', async () => {
    const blogs = await helper.blogsInDb()
    const checkBlog = blogs[0]
    const resultBlog = await api
        .get(`/api/blogs/${checkBlog.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    expect(resultBlog).toEqual(checkBlog)
})

afterAll(async () => {
  await mongoose.connection.close()
})

module.exports = () => {
  process.exit(0)
}