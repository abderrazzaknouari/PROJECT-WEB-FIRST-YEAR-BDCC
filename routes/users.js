const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');




router.get('/', async (req, res) => {
    try {
        const users = await prisma.User.findMany({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


router.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const user = await prisma.User.findUnique({
            where: {
                id: id
            },
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


router.post('/', async (req, res) => {
    let newUser;
    try {
        const { nom, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        newUser = await prisma.User.create({
            data: {
                nom: nom,
                email: email,
                password: hashedPassword,
                role: role
            }
        });
        res.redirect('/login');
        // res.json(newUser);
    } catch (error) {
        console.error(error);
        res.redirect('/signin');
    }
    
   
});


router.post('/byEmail', async (req, res) => {
    try {
        const { email } = req.body;

        const user = await prisma.User.findUnique({ where: { email: email } });
        if (!user) { res.json({ statu: "true" }) }
        if (user) { res.json({ statu: "false" }) }
    } catch (error) {

        console.error(error);
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { nom, email, password, role } = req.body;
        let updatedData = {
            nom: nom,
            email: email,
            role: role
        };

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updatedData.password = hashedPassword;
        }

        const updatedUser = await prisma.User.update({
            where: {
                id: id
            },
            data: updatedData
        });

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).send(error.message);
    }
});




router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const deletedUser = await prisma.user.delete({
            where: {
                id: id
            }
        });
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(deletedUser);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
