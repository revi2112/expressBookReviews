const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  // res.setHeader('Content-Type', 'application/json');
  // return res.status(200).send(JSON.stringify(books, null, 4));
  // // Used send() and JSON.stringify to make the response look neater on powershell

  // Task 10 - I am using promise callbacks:
  new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject("Books not found");
    }
  })
  .then(books => {
    return res.status(200).send(JSON.stringify(books, null, 4));
  })
  .catch(error => {
    return res.status(500).json({ message: error });
  });


});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  const isbn = req.params.isbn;
  // const book = books[isbn];
  // if (book) {
  //   return res.status(200).json(book);
  // }
  // return res.status(404).json({message: "Book not found"});

  // Task 11 - using promise callbacks for the same task
  new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) resolve(book);
    else reject("Book not found");
  })
  .then(book => {
    return res.status(200).json(book);
  })
  .catch(error => {
    return res.status(404).json({ message: error });
  });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  const author = req.params.author;
  // const books_from_author = [];

  // const searchAuthor = author.toLowerCase();
  // for (const book in books) {
  //   if (books[book].author.toLowerCase() === searchAuthor) {
  //     books_from_author.push(books[book]);
  //   }
  // }

  // if (books_from_author.length > 0) {
  //   return res.status(200).json(books_from_author);
  // }

  // return res.status(404).json({message: "No books found for this author"});

  // Task 12 - using promise callback
  new Promise((resolve, reject) => {
    const books_from_author = [];
    const searchAuthor = author.toLowerCase();
    for (const book in books) {
      if (books[book].author.toLowerCase() === searchAuthor) {
        books_from_author.push(books[book]);
      }
    } 

    if (books_from_author.length > 0) resolve(books_from_author);
    else reject("No books found for this author");
  })
  .then(books_from_author => {
    return res.status(200).json(books_from_author);
  })
  .catch(error => {
    return res.status(404).json({ message: error });
  });

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  const title = req.params.title;
  // const books_by_title = [];

  // const searchTitle = title.toLowerCase();
  // for (const book in books) {
  //   if (books[book].title.toLowerCase() === searchTitle) {
  //     books_by_title.push(books[book]);
  //   }
  // }

  // if (books_by_title.length > 0) {
  //   return res.status(200).json(books_by_title);
  // }

  // return res.status(404).json({message: "No books with this title"});

  // Task 13 - using promise callbacks
  new Promise((resolve, reject) => {
    const books_by_title = [];
    const searchTitle = title.toLowerCase();
    for (const book in books) {
      if (books[book].title.toLowerCase() === searchTitle) {
        books_by_title.push(books[book]);
      }
    }

    if (books_by_title.length > 0) resolve(books_by_title);
    else reject("No book found by that title")
  })
  .then(books_by_title => {
    return res.status(200).json(books_by_title);
  })
  .catch(error => {
    return res.status(404).json({ message: error });
  })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    reviews = book.reviews
    if (Object.keys(reviews).length > 0){
      return res.status(200).json(reviews);
    }
    return res.status(404).json({message: "No reviews found for this book"});
  }
  return res.status(404).json({message: "Book not found"});
});

module.exports.general = public_users;
