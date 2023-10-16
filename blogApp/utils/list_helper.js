const dummy = (blogs) => {
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
    const {title, author, likes} = blogs[index]
    const result = {title, author, likes}
    return result
}

module.exports = {
    dummy,
    totalLikes, 
    favoriteBlog
}