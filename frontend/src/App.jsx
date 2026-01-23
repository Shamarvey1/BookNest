import React from "react";
import {createBrowserRouter,createRoutesFromElements,Route,RouterProvider} from "react-router-dom";

import Landing from "./pages/Landing/Landing.jsx";
import MainLayout from "./components/layout/MainLayout.jsx";
import Home from "./pages/Home/Home.jsx";
import Premium from "./pages/premium/Premium.jsx";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute.jsx";
import ReaderPage from "./pages/ReaderPage/ReaderPage.jsx";
import { BookmarkProvider } from "./context/BookmarkContext.jsx";   
import { FavoriteProvider } from "./context/FavoriteContext.jsx";   
import Library from "./pages/Library/Library.jsx";   
import BookDetails from "./pages/BookDetails/BookDetails.jsx";    
import MyBooks from "./pages/Writing/MyBooks/MyBooks.jsx";
import WriteBook from "./pages/Writing/WriteBook/WriteBook.jsx";  
import Profile from "./pages/Profile/Profile.jsx";


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Landing mode="login" />} />
      <Route path="/signup" element={<Landing mode="signup" />} />
      <Route path="/main" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route index element={<Home />} />
        <Route path="book/:id" element={<BookDetails />} />
        <Route path="premium" element={<Premium />} />
        <Route path="library" element={<Library />} />
        <Route path="my-books" element={<MyBooks />} />
        <Route path="write-book" element={<WriteBook />} />
        <Route path="write-book/:id" element={<WriteBook />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="/reader/:id" element={<ReaderPage />} />
      
      <Route path="*" element={<div>404 Not Found</div>} />
    </>
  )
);

function App() {
  return <BookmarkProvider>
      <FavoriteProvider>
        <RouterProvider router={router} />
      </FavoriteProvider>
    </BookmarkProvider>
}

export default App;
