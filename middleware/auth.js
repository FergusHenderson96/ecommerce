const jwt = require ('jsonwebtoken')

const auth = (req, res, next) => {
    try {
        const token = req.header("Authorisation")
        if(!token) return res.status(400).json({meg: "Invalid Authentication"})

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.status(400).json({meg: "Invalid Authentication"})

            req.user = user
            next()
        })
    } catch (error) {
        return res.status(500).json({meg: err.message})
    }
}
module.exports = auth