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
        .get('/api/blogs')
    expect(resultBlog.body[0].id).toBeDefined()
})

test('post is successful', async () => {
    const newBlog = {
        title: 'POST',
        author: 'JEST',
        url: 'NULL',
        likes: 0
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsInDB = await helper.blogsInDb()
    expect(blogsInDB).toHaveLength(helper.initialBlogs.length + 1)
})

test('check like default', async () => {
    const newBlog = {
        title: 'POST',
        author: 'JEST',
        url: 'undefined',
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsInDB = await helper.blogsInDb()
    const newPostIndex = blogsInDB.length - 1
    expect(blogsInDB[newPostIndex].likes).toBe(0)
})

test('check url property is missing will give error', async () => {
    const initialBlogs = await helper.blogsInDb()
    const newBlog = {
        title: 'POST',
        author: 'JEST',
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

    const blogListAtEnd = await helper.blogsInDb()
    expect(blogListAtEnd).toEqual(initialBlogs)
})

test('check title property is missing will give error', async () => {
    const initialBlogs = await helper.blogsInDb()
    const newBlog = {
        author: 'JEST',
        url: 'someUrl'
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

    const blogListAtEnd = await helper.blogsInDb()
    expect(blogListAtEnd).toEqual(initialBlogs)
})

test('check deletion is successful', async () => {
    const allNotes = await helper.blogsInDb()
    const blogToDelete = allNotes[0]

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

    const notesAfterDelete = await helper.blogsInDb()
    expect(notesAfterDelete).toHaveLength(helper.initialBlogs.length - 1)
})

test('update info', async () => {
    const allBlogs = await helper.blogsInDb()
    const blogToUpdate = allBlogs[0]
    const newInfo = {
        likes: 101
    }

    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(newInfo)
        .expect(200)
    const updatedBlogs = await helper.blogsInDb()
    expect(updatedBlogs[0].likes).toBe(101)
})

afterAll(async () => {
    await mongoose.connection.close()
})

module.exports = () => {
    process.exit(0)
}