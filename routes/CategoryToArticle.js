const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
    try {
    const relation = await prisma.CategoryToArticle.create({
        data: {
            category: { connect: { id: parseInt(req.body.categoryId) } },
            article: { connect: { id: parseInt(req.body.articleId) } },
        },


    });
    res.json(relation);
}
catch (err) {
    res.json({ error: err});
}
})

module.exports =router;