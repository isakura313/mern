const express = require("express")
const router = express.Router()
const bcrypt = require('bcryptjs')
const auth = require("../../middlewire/auth")
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator/check')
const config = require('config')

const User = require('../../models/User')
//@route   GET api/auth
//@desc   Test route
//@access public
router.get('/', async  (req, res) => {
   try{
    const user = await User.findById(req.user.id).select("-password")
       res.json(user)
   } catch(err){
    console.error(err.message)
       res.status(500).send('Server error')
   }
});

router.post('/', [
    check("email", 'Please include a valid email').isEmail(),
    check('password', 'Please use a right password with 6 char').isLength({min: 6})
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const { email, password} = req.body;

    try {
        let user = await User.findOne({email});

        if (!user) {
            return res.status(400).json({errors: [{msg: 'Invalid credentials'}]});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({errors: [{ msg: 'Invalid credentials' }]});
        }

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

module.exports = router;