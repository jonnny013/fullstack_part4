const dummy = () => {
    return 1
}

const totalLikes = (total) => {
    const likes = total.map(a => a.likes)

    const reducer = (sum, item) => {
        return sum + item
    }
    return likes.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const totallikes = blogs.map(a => a.likes)
    if (totallikes.length === 0) {
        return undefined
    }
    const max = Math.max(...totallikes)

    const index = totallikes.indexOf(max)
    const { title, author, likes } = blogs[index]
    const result = { title, author, likes }
    return result
}

const mostBlogs = (blogs) => {
    const authors = blogs.map(a => a.author)
    if (authors.length === 0) {
        return undefined
    }
    let blogNumber = {}
    for (let i = 0; i < authors.length; i++) {
        if (authors[i] in blogNumber) {
            blogNumber[authors[i]]++
        }
        else {
            blogNumber[authors[i]] = 1
        }
    }
    let maxKey = null
    let max = 0
    for (const key in blogNumber) {
        const value = blogNumber[key]
        if (value > max) {
            max = value
            maxKey = key
        }
    }
    return { author: maxKey, blogs: max }
}

const mostLikes = (blogs) => {
    const authors = blogs.map(a => ({ author: a.author, likes: a.likes }))

    if (authors.length === 0) {
        return undefined
    }
    let blogNumber = {}
    for (let i = 0; i < authors.length; i++) {
        const authorName = authors[i].author
        const likes = authors[i].likes
        if (authorName in blogNumber) {
            blogNumber[authorName] += likes
        }
        else {
            blogNumber[authors[i].author] = likes
        }
    }
    let maxKey = null
    let max = 0
    for (const key in blogNumber) {
        const value = blogNumber[key]
        if (value > max) {
            max = value
            maxKey = key
        }
    }
    return { author: maxKey, likes: max }
}


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}