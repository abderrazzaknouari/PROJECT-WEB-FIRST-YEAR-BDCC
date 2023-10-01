const { PrismaClient } = require('@prisma/client');
const faker = require('faker');

const prisma = new PrismaClient();

async function deleteAll() {
  await prisma.CategoryToArticle.deleteMany();
  await prisma.Comment.deleteMany();
  await prisma.Article.deleteMany();
  await prisma.User.deleteMany();
  await prisma.Category.deleteMany();
}



async function seed() {
  try {
    deleteAll();
    // Create 10 users with the role "AUTHOR"
    for (let i = 0; i < 10; i++) {
      
      await fetch(`http://localhost:3000/api/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          {
            nom: faker.name.firstName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            role: 'AUTHOR'
          }
        )
      }).then((response) => {
        if (response.ok) {
          console.log('user added successfully ');
        } else {
          throw new Error('Failed to add user');
        }
      });
    }

    // Create 1 user with the role "ADMIN"
    await fetch(`http://localhost:3000/api/users/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          nom: faker.name.firstName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          role: 'ADMIN'
        }
      )
    }).then((response) => {
      if (response.ok) {
        console.log('admin added successfully ');
      } else {
        throw new Error('Failed to add admin');
      }
    });

    // Create 10 categories
    for (let i = 0; i < 10; i++) {
      await fetch(`http://localhost:3000/api/categories/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          {
            nom: faker.lorem.word(),
          }
        )
      }).then((response) => {
        if (response.ok) {
          console.log('categorie added successfully ');
        } else {
          throw new Error('Failed to add categorie');
        }
      });
    }

    // Create 100 articles with random categories and authors
    for (let i = 0; i < 100; i++) {
      const response = await fetch('http://localhost:3000/api/categories/', {
        method: 'GET'
      });

      if (!response.ok) {
        // Handle any error with the fetch request
        throw new Error('Failed to fetch category ids');
      }

      const categoryIds = await response.json();
      

      const randomCategoryIds1 = categoryIds.map(c => c.id);
      const randomCount = Math.floor(Math.random() * randomCategoryIds1.length);

function getRandomElementsFromArray(array, count) {
  const randomElements = [];
  
  if (count === 0) {
    count = 3;
  }
  
  const uniqueArray = [...new Set(array)]; // Remove duplicate values
  
  for (let i = 0; i < count; i++) {
    if (uniqueArray.length === 0) {
      break; // Break if there are no more unique elements
    }
    
    const randomIndex = Math.floor(Math.random() * uniqueArray.length);
    randomElements.push(uniqueArray[randomIndex]);
    uniqueArray.splice(randomIndex, 1); // Remove the selected element from the unique array
  }

  return randomElements;
}

const randomCategoryIds = getRandomElementsFromArray(randomCategoryIds1, randomCount);


      const response2 = await fetch('http://localhost:3000/api/users/', {
        method: 'GET'
      });
      
      if (!response2.ok) {
        // Handle any error with the fetch request
        throw new Error('Failed to fetch user ids');
      }
      
      const users = await response2.json();
      
      
      const randomAuthorIds = users.map(user => user.id);
     
      const randomIndex = Math.floor(Math.random() * randomAuthorIds.length);
      

      
      
      const imageUrl = `test.jpg`;

      const createdArticle=await fetch(`http://localhost:3000/api/article/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          {
            titre: faker.lorem.sentence(),
          contenu: faker.lorem.paragraphs(),
          image: imageUrl,
          createdAt: new Date(),
          updatedAt: new Date(),
          published: faker.datatype.boolean(),
          userId: randomAuthorIds[randomIndex],
          }
        )
      }).then((response) => {
        if (response.ok) {
          console.log('article added successfully ');
          return response.json();
          
        } else {
          throw new Error('Failed to add article');
        }
      });
   
     
      // Create the relationships between the article and its categories
      for (const categoryId of randomCategoryIds) {
        await prisma.CategoryToArticle.create({
          data: {
            category: { connect: { id: categoryId } },
            article: { connect: { id: createdArticle.id } },
          },
        });
      }
    }

    // Create 0 to 20 comments for each article
    const articles = await prisma.Article.findMany();
    for (const article of articles) {
      const randomCommentCount = faker.datatype.number({ min: 0, max: 20 });

      for (let i = 0; i < randomCommentCount; i++) {
        await prisma.Comment.create({
          data: {
            email: faker.internet.email(),
            contenu: faker.lorem.sentences(),
            articleId: article.id,
          },
        });
      }
    }

    console.log('Data seeding completed.');
  } catch (error) {
    console.error('Error during data seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
