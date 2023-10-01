const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = "process.env.secretKey"

const article_routes = require('./routes/articles');
const CategoryToArticle_routes = require('./routes/CategoryToArticle');
const categorie_routes = require('./routes/categories');
const comment_routes = require('./routes/commentaires');
const user_routes = require('./routes/users');
const login_routes = require('./login/login');
const profil_routes = require('./login/profile');

const port = 3000;

app.set('view engine', 'ejs');
const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);

app.use(express.static('./public'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
const path = require('path');





app.get('/home', (req, res) => {
  const redirection='/login';
  const beIn='home';
  whatToDo(req, res,redirection,beIn);
 
});
app.get('/signin',(req,res)=>{
  const redirection='/home';
  const beIn='signin';
  whatToDo2(req, res,redirection,beIn);

});
app.get('/',(req,res)=>{
 res.render('login');

});
app.get('/profile',(req,res)=>{
  const redirection='/login';
  const beIn='profile';
  whatToDo(req, res,redirection,beIn);

});


app.get('/login',(req,res)=>{
  const redirection='/home';
  const beIn='login';
 whatToDo2(req, res,redirection,beIn);
});

app.get('/monArticles',(req,res)=>{
  const redirection='/login';
  const beIn='monArticles';
  whatToDo(req, res,redirection,beIn);
});

app.get('/addArticle',(req,res)=>{
  const redirection='/login';
  const beIn='addArticle';
  whatToDo(req, res,redirection,beIn);
});

app.get('/modifierArticle',(req,res)=>{
  const redirection='/login';
  const beIn='modifierArticle';
  whatToDo(req, res,redirection,beIn);
});

app.get('/comments',(req,res)=>{
  const redirection='/login';
  const beIn='comments';
  whatToDo(req, res,redirection,beIn);
});
app.get('/addComment',(req,res)=>{
  const redirection='/login';
  const beIn='addComment';
  whatToDo(req, res,redirection,beIn);
});
app.get('/addCategory',(req,res)=>{
  const redirection='/home';
  const beIn='addCategories';
  whatToDo_adminOrNot(req, res,redirection,beIn);
});
app.get('/addUser',(req,res)=>{
  const redirection='/home';
  const beIn='addUser';
  whatToDo_adminOrNot(req, res,redirection,beIn);
});
app.get('/logOut',(req,res)=>{
  res.clearCookie('token');
  res.redirect('/login');
});
app.get('/allUsers',(req,res)=>{
  const redirection='/home';
  const beIn='users';
  whatToDo_adminOrNot(req, res,redirection,beIn);
});
app.get('/allCategories',(req,res)=>{
  const redirection='/home';
  const beIn='categories';
  whatToDo_adminOrNot(req, res,redirection,beIn);
});
app.get('/edit-category',(req,res)=>{
  const redirection='/home';
  const beIn='editCategory';
  whatToDo_adminOrNot(req, res,redirection,beIn);
});
app.get('/modifierUser',(req,res)=>{
  const redirection='/home';
  const beIn='modifierUser';
  whatToDo_adminOrNot(req, res,redirection,beIn);
});

app.use('/api/article',article_routes);
app.use('/api/categories',categorie_routes);
app.use('/api/comments',comment_routes);
app.use('/api/users',user_routes);
app.use('/api/login',login_routes);
app.use('/api/profil',profil_routes);
app.use('/api/CategoryToArticle',CategoryToArticle_routes);






app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



function whatToDo(req, res,redirection,beIn) {
  const token = req.cookies.token;
  if (!token) {
      res.redirect(redirection);
  }
  else {
      try {
          const verifyToken = jwt.verify(token, secretKey);
          if (verifyToken) {
              res.render(beIn)

          }
          else {
              res.redirect(redirection);
          }
      }
      catch (err) {
        res.redirect(redirection); 
      }
  }
}


function whatToDo2(req, res,redirection,beIn) {
  const token = req.cookies.token;
  if (!token) {
    res.render(beIn);
  }
  else {
      try {
          const verifyToken = jwt.verify(token, secretKey);
          if (!verifyToken) {
              res.render(beIn);

          }
          else {
              res.redirect(redirection);
          }
      }
      catch (err) {
        res.render(beIn);
      }
  }
}


function whatToDo_adminOrNot(req, res,redirection,beIn) {
  const token = req.cookies.token;
  if (!token) {
      res.redirect(redirection);
  }
  else {
      try {
          const verifyToken = jwt.verify(token, secretKey);
          if (verifyToken.user.role=='ADMIN') {
            
              res.render(beIn)

          }
          else {
              res.redirect(redirection);
          }
      }
      catch (err) {
        res.redirect(redirection);
          //res.status(500).json({ err: err.message });
      }
  }
}
