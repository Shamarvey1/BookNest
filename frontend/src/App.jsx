import React from 'react';
import {createBrowserRouter,createRoutesFromElements,Route,RouterProvider} from 'react-router-dom';
import Landing from './pages/Landing/Landing.jsx';
import MainLayout from './components/layout/MainLayout.jsx';
import Home from './pages/Home/Home.jsx';
import Premium from './pages/premium/premium.jsx';
import ProtectedRoute from './components/protectedRoute/ProtectedRoute.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Landing mode="login" />} />
      <Route path="/signup" element={<Landing mode="signup" />} />

      <Route path="/main" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route index element={<Home />} />
        <Route path="premium" element={<Premium />} />
      </Route>

      <Route path="*" element={<div>404 Not Found</div>} />
    </>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
