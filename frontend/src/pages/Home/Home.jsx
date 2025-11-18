import React from "react";
import "./Home.css";

import SearchBar from "../../components/SearchBar/SearchBar";
import BookCard from "../../components/BookCard/BookCard";

const Home = () => {
  const sampleBooks = [
    {
      id: 1,
      title: "Atomic Habits",
      author: "James Clear",
      cover:
        "https://images-na.ssl-images-amazon.com/images/I/81wgcld4wxL.jpg",
    },
    {
      id: 2,
      title: "The Psychology of Money",
      author: "Morgan Housel",
      cover:
        "https://m.media-amazon.com/images/I/71g2ednj0JL._AC_UF1000,1000_QL80_.jpg",
    },
    {
      id: 3,
      title: "Rich Dad Poor Dad",
      author: "Robert Kiyosaki",
      cover:
        "https://m.media-amazon.com/images/I/81bsw6fnUiL._AC_UF1000,1000_QL80_.jpg",
    },
  ];

  return (
    <div className="home-container">
      <SearchBar />

      <h2 className="section-title">Recommended Books</h2>
      <div className="books-grid">
        {sampleBooks.map((book) => (
          <BookCard
            key={book.id}
            title={book.title}
            author={book.author}
            cover={book.cover}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
