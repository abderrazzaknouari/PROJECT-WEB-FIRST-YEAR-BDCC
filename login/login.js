const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();
const secretKey = "process.env.secretKey"


router.post('/', async (req, res) => {
    try {
        const password = req.body.password;
        const email = req.body.email;
        const user = await loginUser(email, password);
        let token;
        if (user) {
            const payload = { user };
             token = jwt.sign(payload, secretKey, { expiresIn: '5h' });

            res.cookie('token', token, {
                maxAge: 30*24*60*60, 
          
            });
               
            res.json({statu:"true"});
        }
        else {
            res.json({statu:"false"});
            
        }

    }
    catch (err) {
        console.error(err);
        res.status(500).json(err.message); }

});


module.exports = router;








async function loginUser(email, password) {



    const user = await prisma.User.findUnique({ where: { email: email } });
    if (!user) {
        return null;
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
        return null;
    }
    return user

}