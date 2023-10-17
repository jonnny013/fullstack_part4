const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: "Learning Backend",
        author: "Jon Love",
        url: "https://jonnny013.github.io/index.html",
        likes: 100
    },
    {
        title: "Forgetting Frontend Already",
        author: "My Brain",
        url: "https://github.com/jonnny013",
        likes: 10
    }
]

const nonExistingId = async () => {
    const blog = new Blog({title: "soon to go"})
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
    blogsInDb
}