const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


router.get('/', async (req, res) => {
    try {
        const comments = await prisma.Comment.findMany();
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/byArticle/:id', async (req, res) => {
    try {
        const id=parseInt( req.params.id);
        const comments = await prisma.Comment.findMany(
            {
                where: {
                    articleId:id,
                }
            }
        );
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).send(error);
    }
});


router.post('/', async (req, res) => {
    try {
        const { email, contenu, articleId } = req.body;
        const comment = await prisma.Comment.create({
            data: {
                email: email,
                contenu: contenu,
                articleId: parseInt(articleId)
            }
        }
        );
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).send(error);
    }
});


router.patch('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { email, contenu } = req.body;

        const comment = await prisma.Comment.update({
            where: { 
                id: id ,
            },
            data: {
                email: email,
                contenu: contenu,

            },
        });

        if (!comment) {
            res.status(404).json({ error: 'Comment not found' });
        }
        res.status(200).json(comment);
    } catch (error) {
        res.status(500).send(error);
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const  id  =parseInt(req.params.id) ;
        const comment = await prisma.Comment.delete({
            where:{
                id:id,
            }
        });
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        res.json(comment);

    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
