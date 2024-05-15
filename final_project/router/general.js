const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const {username, password} = req.body;
  if (username && password) {
      if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } else  {return res.status(404).json({message: "Unable to register user."})};
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  if(!books[isbn]) return res.status(404).json(`book with ${isbn} not found`)
  return res.status(200).json(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const authorBooks = [];
  
  for(const bookId in books) {
    if(books[bookId].author === author) {
      authorBooks.push(books[bookId]);
    }
  }

  if(authorBooks.length > 0) {
    res.status(200).json(authorBooks);
  } else {
    res.status(404).json({ error: `Books by ${author} not found` });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const titleBooks = [];
  
  for(const bookId in books) {
    if(books[bookId].title === title) {
      titleBooks.push(books[bookId]);
    }
  }

  if(titleBooks.length > 0) {
    res.status(200).json(titleBooks);
  } else {
    res.status(404).json({ error: `Books by ${title} not found` });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  if(!books[isbn]) return res.status(404).json(`book with ${isbn} not found`)
    const review = books[isbn].reviews
  return res.status(200).json({
    review
  })
});

module.exports.general = public_users;
