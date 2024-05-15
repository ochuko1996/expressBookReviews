const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios')

const booksApiUrl = 'https://georgeochuko-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/';


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
// public_users.get('/',function (req, res) {
//   //Write your code here
  
//   return res.status(200).json(books);
// });

// // Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   //Write your code here
//   const isbn = req.params.isbn
//   if(!books[isbn]) return res.status(404).json(`book with ${isbn} not found`)
//   return res.status(200).json(books[isbn])
//  });
  
// // Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   //Write your code here
//   const author = req.params.author;
//   const authorBooks = [];
  
//   for(const bookId in books) {
//     if(books[bookId].author === author) {
//       authorBooks.push(books[bookId]);
//     }
//   }

//   if(authorBooks.length > 0) {
//     res.status(200).json(authorBooks);
//   } else {
//     res.status(404).json({ error: `Books by ${author} not found` });
//   }
// });

// // Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   //Write your code here
//   const title = req.params.title;
//   const titleBooks = [];
  
//   for(const bookId in books) {
//     if(books[bookId].title === title) {
//       titleBooks.push(books[bookId]);
//     }
//   }

//   if(titleBooks.length > 0) {
//     res.status(200).json(titleBooks);
//   } else {
//     res.status(404).json({ error: `Books by ${title} not found` });
//   }
// });

// URL of the endpoint providing the book data

// Get the book list available in the shop using async-await
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get(booksApiUrl);
    const books = response.data;
    return res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    return res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`${booksApiUrl}/isbn/${isbn}`);
    const book = response.data;
    if (!book) {
      return res.status(404).json(`Book with ISBN ${isbn} not found`);
    }
    return res.status(200).json(book);
  } catch (error) {
    console.error('Error fetching book by ISBN:', error);
    return res.status(500).json({ error: 'Failed to fetch book' });
  }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get(`${booksApiUrl}/author/${author}`);
    const authorBooks = response.data;
    if (authorBooks.length > 0) {
      return res.status(200).json(authorBooks);
    } else {
      return res.status(404).json({ error: `Books by ${author} not found` });
    }
  } catch (error) {
    console.error('Error fetching books by author:', error);
    return res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get(`${booksApiUrl}/title/${title}`);
    const titleBooks = response.data;
    if (titleBooks.length > 0) {
      return res.status(200).json(titleBooks);
    } else {
      return res.status(404).json({ error: `Books with title ${title} not found` });
    }
  } catch (error) {
    console.error('Error fetching books by title:', error);
    return res.status(500).json({ error: 'Failed to fetch books' });
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
