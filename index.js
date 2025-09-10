const {initDatabase} = require("./db/db.connect");
const express = require("express");
const app = express();
app.use(express.json()); //middleware

const Book = require("./models/book.models");

initDatabase();

async function createBook(book) {
    try {
        const newBook = new Book(book);
        const savedBook = await newBook.save();
        return savedBook;
    } catch(error) {
        console.log("Error in adding book data to DB", error);
    }
};

app.post("/books", async (req,res) => {
    try {
        const newBook = await createBook(req.body);
        if(newBook) {
            res.status(200).json({message: "Book Added successfully", newBook});
        } else {
            res.status(400).json({error: "Error in adding new book."});
        }
    } catch(error) {
        res.status(500).json({error: "Failed to add Book in DB"});
    }
});

async function readBookByTitle (byTitle) {
    try {
        const bookByTitle = await Book.findOne({title: byTitle});
        return bookByTitle;
    } catch (error) {
        console.log("Error in fetching book", error);
    }
};

app.get("/books/:title", async (req,res) => {
    try {
        const bookByTitle = await readBookByTitle(req.params.title);
        if(bookByTitle.length != 0) {
            res.json(bookByTitle);
        } else {
            res.status(404).json({error: "Book not found by title."});
        }
    }catch (error) {
        res.status(500).json({error: "Failed to fetch book by title."})
    }
});

async function readBookByAuthor (byAuthor) {
    try {
        const bookByAuthor = await Book.find({author: byAuthor});
        return bookByAuthor;
    } catch (error) {
        console.log("Error in fetching book", error);
    }
};

app.get("/books/author/:author", async (req,res) => {
    try {
        const bookByAuthor = await readBookByAuthor(req.params.author);
        if(bookByAuthor.length != 0) {
            res.json(bookByAuthor);
        } else {
            res.status(404).json({error: "Book not found by author."});
        }
    }catch (error) {
        res.status(500).json({error: "Failed to fetch book by author."})
    }
});

async function readBookByGenre (byGenre) {
    try {
        const bookByGenre = await Book.find({genre: byGenre});
        return bookByGenre;
    } catch (error) {
        console.log("Error in fetching book", error);
    }
};

app.get("/books/genre/business", async (req,res) => {
    try {
        const bookByGenre = await readBookByGenre("Business");
        if(bookByGenre.length != 0) {
            res.json(bookByGenre);
        } else {
            res.status(404).json({error: "Book not found of Business genre."});
        }
    }catch (error) {
        res.status(500).json({error: "Failed to fetch book by business genre."})
    }
});

async function readBookByYear (byYear) {
    try {
        const bookByYear = await Book.find({publishedYear: byYear});
        return bookByYear;
    } catch (error) {
        console.log("Error in fetching book", error);
    }
};

app.get("/books/year/:publishedyear", async (req,res) => {
    try {
        const bookByYear = await readBookByYear(req.params.publishedyear);
        if(bookByYear.length != 0) {
            res.json(bookByYear);
        } else {
            res.status(404).json({error: "Book not found of published year 2012."});
        }
    }catch (error) {
        res.status(500).json({error: "Failed to fetch book by pubishedYear."})
    }
});

async function updateRatingById (id, newRating) {
    try {
        const updatedBook = await Book.findByIdAndUpdate(id, {rating: newRating}, {new: true});
        return updatedBook;
    } catch(error) {
        console.log("Error in updating rating.");
    }
}

app.post("/books/:id/:rating", async(req,res) => {
    try {
        const updatedBook = await updateRatingById(req.params.id,req.params.rating);
        if(updatedBook) {
            res.status(200).json({message: "Book rating updated successfully", updatedBook});
        } else {
            res.status(404).json({error: "Book not found."});
        }
    } catch(error) {
        res.status(500).json({error: "Book does not exist"});
    }
});

async function updateBookDataByTitle (newTitle, dataToUpdate) {
    try {
        const updatedBook = await Book.findOneAndUpdate({title: newTitle}, dataToUpdate, {new: true});
        return updatedBook;
    } catch(error) {
        console.log("Error in updating rating.");
    }
}

app.post("/books/:title", async(req,res) => {
    try {
        const updatedBook = await updateBookDataByTitle(req.params.title,req.body);
        if(updatedBook) {
            res.status(200).json({message: "Book data updated successfully", updatedBook});
        } else {
            res.status(404).json({error: "Book not found."});
        }
    } catch(error) {
        res.status(500).json({error: "Book does not exist"});
    }
});

async function deleteBookData (id) {
    try {
        const deletedBook = await Book.findByIdAndDelete(id);
        return deletedBook;
    } catch(error) {
        console.log("Error in deleting data", error);
    }
};

app.delete("/books/:id", async (req,res) => {
    try {
        const deletedBook = await deleteBookData(req.params.id);
        if(deletedBook) {
            res.status(200).json({message: "Book deleted successfully.", deletedBook});
        } else {
            res.status(400).json({error: "Book not found."});
        }
    } catch(error) {
        res.status(500).json({error: "Error in deleting book."});
    }
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});

async function readAllBooks () {
    try {
        const allBooks = await Book.find();
        return allBooks;
    } catch (error) {
        console.log("Errror in fetching data", error);
    }
}

app.get("/books", async (req,res) => {
    try {
        const books = await readAllBooks();
        if(books.length != 0) {
            res.json(books);
        } else {
            res.status(404).json({error: "Books not found"});
        }
    } catch (error) {
        res.status(404).json({error: "Error in fetching data."});
    }
});

