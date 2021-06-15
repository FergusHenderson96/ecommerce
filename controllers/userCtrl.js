const Users = require ('../models/userModel')
const bcrypt = require ('bcrypt')
const jwt = require ('jsonwebtoken')

const userCtrl = {
        register: async (req, res) =>{
            try {
                const {name, email, password} = req.body;

                const user = await Users.findOne({email})
                if(user) return res.status(400).json({msg: "This email already exits"})

                if (password.length < 6)
                return res.status(400).json ({msg: "Password must be more than 6 characters long."})

                //password encryption
                const passwordHash = await bcrypt.hash(password, 8)
                // res.json({password, passwordHash})
                const newUser = new Users ({
                    name, email, password, passwordHash
                })

                //save mongodb 
                await newUser.save()

                //Then create jsonwebtoken to authenticate
                const accesstoken = createAccessToken({id: newUser._id})
                const refreshtoken = createRefreshToken({id: newUser._id})

                res.cookie('refreshtoken', refreshtoken, {
                    httpOnly: true,
                    path: '/user/refresh_token',
                    maxAge: 7*24*60*60*1000 //7 days
                })

                res.json({accesstoken})
                // res.json({msg: "You have successfully registered!"})

            } catch (err) {
                return res.status(500).json({msg: err.message})
            }
        },
        login: async (req, res) => {
            try {
                const {email, password} = req.body;

                const user = await Users.findOne({email})
                if(!user) return res.status(400).json({msg: "User does not exist"})

                const isMatch = await bcrypt.compare(password, user.password)
                if(!isMatch) return res.status(400).json({msg: "Incorrect Password"})

                //if Login successful, create access token and refresh token

                const accesstoken = creatAccessToken({id: user._id})
                const refreshtoken = createRefreshToken({id: user._id})

                res.cookie('refreshtoken', refreshtoken, {
                    httpOnly: true,
                    path: '/user/refresh_token',
                    maxAge: 7*24*60*60*1000 //7 days
                })

                res.json({accesstoken})
            } catch (error) {
                return res.status(500).json({meg: err.message})
            }
        },
        logout: async (req, res) => {
            try {
                res.clearCookie('refreshToken', {path: '/user/refresh_token'})
                return res.json({meg: "Logged out"})
            } catch (error) {
                return res.status(500).json({meg: err.message})
            }
        },
        refreshToken: (req, res) => {
            try {
                const rf_tokrn = req.cookies.refreshtoken;
                    if(!rf_token) return res.status(400).json({msg: "please Login or Register"})

                jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                    if(err) return res.status(400).json({msg: "please Login or Register"})

                    const accesstoken = createAccessToken({id: user.id})

                    res.json({accesstoken})
                })

            } catch (err) {
                return res.status(500).json({meg: err.message})
            }
            
        },
        getUser: async (req, res) => {
            try {
                const user = await Users.findById(req.user.id).select('-password')
                if(!user) return res.status(400).json({msg: "User does not exist"})
                res.json(user)
            } catch (error) {
                return res.status(500).json({msg: err.message})
            }
        },
        addCart: async (req, res) => {
            try {
                const user = await Users.findById(req.user.id)
                if(!user) return res.status(400).json({msg: "User does not exist."})

                await Users.findOneAndUpdate({_id: req.user.id}, {
                    cart: req.body.cart
                })
                return res.json({msg: "Added to cart"})
            } catch (error) {
                return res.status(500).json({msg: err.message})
            }
        }
}

const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '11m'})
}

const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
}


module.exports = userCtrl