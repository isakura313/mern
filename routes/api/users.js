const express = require("express")
const router = express.Router()
const {check, validationResult} = require('express-validator/check')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('../../models/User')

//@route   POST api/users
//@desc   Register User
//@access public
router.post('/', [
    check('name', "name is required")
        .not()
        .isEmpty(),
    check("email", 'Please include a valid email').isEmail(),
    check('password', 'Please use a right password with 6 char').isLength({min: 6})
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const {name, email, password} = req.body;

    try {
        let user = await User.findOne({email});

        if (user) {
            return res.status(400).json({errors: [{msg: 'User is already register with this email'}]});
        }

        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        })

        user = new User({
            name,
            email,
            avatar,
            password
        })
        // See if users exists

        //get user gravatar
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt)
        await user.save()
        //encrypt password

        const payload = {
            user:{
                id: user.id
            }
        }
        jwt.sign(payload, config.get('jwt_secret'),
            {expiresIn: 3600000},
            (err, token) =>{
            if(err) throw err;
            res.json({token})
            })


    } catch (error) {
        console.log(error.message);
        res.status(500).send("<h1> Произошла ошибка сервера </h1>")

    }
})

module.exports = router;