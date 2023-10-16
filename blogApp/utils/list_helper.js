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

module.exports = {
    dummy,
    totalLikes
}