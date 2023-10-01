const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving categories' });
  }
});

// GET //:categoryId
router.get('/:categoryId', async (req, res) => {
  const { categoryId } = req.params;
  try {
    const category = await prisma.category.findUnique({
      where: { id: parseInt(categoryId) },
    });
    if (!category) {
      res.status(404).json({ error: 'Category not found' });
    } else {
      res.status(200).json(category);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving category' });
  }
});

// POST /
router.post('/', async (req, res) => {
  const { nom } = req.body;
  try {
    const category = await prisma.category.create({
      data: { nom },
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Error creating category' });
  }
});

// PATCH //:categoryId
router.patch('/:categoryId', async (req, res) => {
  const { categoryId } = req.params;
  const { nom } = req.body;
  try {
    const category = await prisma.category.update({
      where: { id: parseInt(categoryId) },
      data: { nom },
    });
    if (!category) {
      res.status(404).json({ error: 'Category not found' });
    } else {
      res.status(200).json(category);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating category' });
  }
});

// DELETE //:categoryId
router.delete('/:categoryId', async (req, res) => {
  const categoryId = parseInt(req.params.categoryId);
  try {
    const cat = await prisma.Category.delete({
      where: { id: categoryId },
    });
    res.send(cat);

  } catch (error) {

    res.status(500).send(error);
  }
});


module.exports = router;




/* we have to use fetch to delet articles becaus there is no article without categorie */

