const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });// Specify the destination folder to temporarily store the uploaded file
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { titre, contenu, userId } = req.body;
    const { filename } = req.file; // the uploaded file will be available as req.file

    // Save the article to the database
    const article = await prisma.Article.create({
      data: {
        titre: titre,
        contenu: contenu,
        image: filename, // store the image file name in the 'image' field
        userId: parseInt(userId[1]),
      },
    });

    res.json(article);
  } catch (error) {
    console.error("backend", error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.patch('/upload/:id', upload.single('image'), async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const { titre, contenu } = req.body;
    let filename = null;
    if (req.file) filename = req.file.filename; // the uploaded file will be available as req.file
    console.log(titre, contenu, filename);
    // Save the article to the database
    let article ;
    if (filename) {
      article = await prisma.Article.update({
        where: {
          id: parseInt(id),
        },
        data: {
          titre: titre,
          contenu: contenu,
          image: filename, // store the image file name in the 'image' fiel
        },
      });
    }
    else{
       article = await prisma.Article.update({
        where: {
          id: parseInt(id),
        },
        data: {
          titre: titre,
          contenu: contenu,
          
        },
      });
    }
    res.json(article);
  } catch (error) {
    console.error("backend", error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.get('/', async (req, res) => {
  const articleWithCommentsAndCategories = await prisma.Article.findMany({

    include: {
      comments: true,
      articleCategories: { include: { category: true } },
    },
  });

  articleWithCommentsAndCategories.forEach((article) => {
    article.commentCount = article.comments.length;
  });
  res.json(articleWithCommentsAndCategories);
});


router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const article = await prisma.Article.findUnique({
      where: {
        id: id,
      },
      include: {
        user: true,
      }
    });
    res.json(article);
  }
  catch (err) {
    res.send(err.message);
  }
});



router.get('/byCategory/:id', async (req, res) => {
  const categoryId = parseInt(req.params.id);

  const articlesWithCommentsAndCategories = await prisma.article.findMany({
    where: {
      articleCategories: {
        some: {
          categoryId: categoryId,
        },
      },
    },
    include: {
      comments: true,
      articleCategories: { include: { category: true } },
    },
  });
  articlesWithCommentsAndCategories.forEach((article) => {
    article.commentCount = article.comments.length;
    article.SearchcategoryId = categoryId;
  });
  res.json(articlesWithCommentsAndCategories);

});

/////////////////////////////////////////////////////////////////////////////

router.post('/byCategory/strictmode', async (req, res) => {
  categoryIds = req.body.categoryIds.map(id => parseInt(id));


  const articlesWithCategories = await prisma.Article.findMany({
    where: {
      articleCategories: {
        some: {
          category: {
            id: {
              in: categoryIds
            }
          }
        },

      }
    },

    include: {
      comments: true,
      articleCategories: { include: { category: true } },
    },
    distinct: ['id']
  });


  const articlesWithAllCategories = articlesWithCategories.filter((article) => {
    const categoryIdsInArticle = article.articleCategories.map((ac) => ac.categoryId);
    const r = categoryIds.every(function (categoryId) {
      return categoryIdsInArticle.includes(categoryId)
    });
    return r;

  });

  // Fetch comments for the filtered articles
  const articleIdsWithAllCategories = articlesWithAllCategories.map((article) => article.id);

  const articlesWithCommentsAndCategories = await prisma.Article.findMany({
    where: {
      id: {
        in: articleIdsWithAllCategories
      }
    },
    include: {
      comments: true,
      articleCategories: { include: { category: true } },
    }
  });


  articlesWithCommentsAndCategories.forEach((article) => {
    article.commentCount = article.comments.length;
    article.SearchcategoryIds = categoryIds;
  });
  res.json(articlesWithCommentsAndCategories);
});

///////////////////////////////////////////////////////////////////////////////////

router.post('/byCategory', async (req, res) => {
  categoryIds = req.body.categoryIds.map(id => parseInt(id));

  try {
    const articlesWithCommentsAndCategories = await prisma.Article.findMany({
      where: {
        articleCategories: {
          some: {
            category: {
              id: {
                in: categoryIds
              }
            }
          },

        }
      },

      include: {
        comments: true,
        articleCategories: { include: { category: true } },
      }
    });

    articlesWithCommentsAndCategories.forEach((article) => {
      article.commentCount = article.comments.length;
      article.SearchcategoryIds = categoryIds;
    });

    res.json(articlesWithCommentsAndCategories);
  } catch (e) {
    console.log(e);
    res.json({ error: e });
  }
});



router.get('/byUser/:id', async (req, res) => {
  const userId = parseInt(req.params.id);
  try {


    const articlesWithCommentsAndCategories = await prisma.article.findMany({
      where: {
        userId: userId,
      },
      include: {
        comments: true,
        articleCategories: { include: { category: true } },
      },
    });

    articlesWithCommentsAndCategories.forEach((article) => {
      article.commentCount = article.comments.length;
    });
    res.json(articlesWithCommentsAndCategories);
  }
  catch (err) {
    res.send(err.message);
  }
});

router.post('/', async (req, res) => {
  try {
    const article = await prisma.Article.create({
      data: {
        titre: req.body.titre,
        contenu: req.body.contenu,
        image: req.body.image,
        createdAt: new Date(),
        published: req.body.published,
        userId: parseInt(req.body.userId),
      },
    })
    res.json(article);
  }
  catch (err) { res.send(err.message); }
});

router.patch('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const updateArticle = await prisma.Article.update({
      where: {
        id: id,
      },
      data: {
        titre: req.body.titre,
        contenu: req.body.contenu,
        image: req.body.image,
        updatedAt: new Date(),
        published: req.body.published,

      },
    })

    res.send(updateArticle);
  }
  catch (err) { res.send(err.message) };
});

router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {


    const deleteArticle = await prisma.Article.delete({
      where: {
        id: id,
      },
    })
    res.json(deleteArticle);
  }
  catch (err) { res.send(err) };

});



router.post('/search', async (req, res) => {
  const { query } = req.body;

  try {
    // Query the articles based on the search query
    const filteredArticles = await prisma.Article.findMany({
      where: {
        titre: { contains: query }
      },
      include: {
        comments: true,
        articleCategories: { include: { category: true } },
      }
    });
    filteredArticles.forEach((article) => {
      article.commentCount = article.comments.length;
    });

    res.json(filteredArticles);
  } catch (error) {
    console.log('An error occurred:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;