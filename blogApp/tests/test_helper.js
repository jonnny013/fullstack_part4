const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: 'Learning Backend',
        url: 'https://jonnny013.github.io/index.html',
        likes: 100
    },
    {
        title: 'Forgetting Frontend Already',
        url: 'https://github.com/jonnny013',
        likes: 10
    }
]

const initialUsers = [
    {
        username: 'TestOne',
        name: 'Jon Love',
        password: '123'
    },
    {
        username: 'TestTwo',
        name: 'Bob',
        password: '123'
    }
]

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

const nonExistingId = async () => {
    const blog = new Blog({ title: 'soon to go' })
    await blog.save()
    await blog.deleteOne()

    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs,
    nonExistingId,
    blogsInDb,
    usersInDb,
    initialUsers
}