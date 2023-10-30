const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogRouter.post('/', middleware.userExtractor, async (request, response) => {
    const body = request.body

    const user = request.user
    const blog = new Blog ({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user.id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogRouter.delete('/:id',  middleware.userExtractor, async (request, response) => {
    const user = request.user
    const blog = await Blog.findById(request.params.id)
    if ( blog.user.toString() === user.id.toString()) {
        await Blog.findByIdAndRemove(request.params.id)
        console.log('deleted')
    } else {
        console.log('Not authorized to delete')
    }
    response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
    const body = request.body
    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: body.user
    }

    const updatedInfo = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.status(200).json(updatedInfo)
})

module.exports = blogRouter