const router = require('express').Router();
const jwt = require('jsonwebtoken');
const secretKey = "process.env.secretKey"

router.get('/', (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        res.status(200).json({ error: 'not logged in' });
    }
    else {
        try {
            const verifyToken = jwt.verify(token, secretKey);
            if (verifyToken) {
                
                res.status(200).json(verifyToken);

            }
            else {
                res.status(200).json({ error: 'invalid token' });
            }
        }
        catch (err) {
            res.redirect('/login');
            
        }
    }
});






module.exports = router;


/* 
async function getUserById(req) {

    const token = req.cookies.token;
    if (!token) {
        throw new Error('empty token');
    }
    const userId = verifyToken(token);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    return user;
}

function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, secretKey);
        return decoded.userId;
    } catch (error) {
        throw new Error('Invalid token');
    }
} */