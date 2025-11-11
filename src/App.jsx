import React from 'react';
import SideBar from './components/SideBar/SideBar.jsx';
import { createBrowserRouter, createRoutesFromElements, Route ,RouterProvider} from 'react-router-dom';
import Home from './pages/Home.jsx';
import Premium from './pages/premium/premiun.jsx';
import Login from './pages/Login.jsx';
import Signup from "./pages/Signup.jsx"
import MainLayout from './components/layout/MainLayout.jsx';
function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={< MainLayout/>}>
        <Route index element={<Home/>}/>
        <Route path="premium" element={<Premium/>}/>
        <Route path='login' element={<Login/>}/>
        <Route path='signup' element={<Signup/>}/>
      </Route>
    )
  )
  return (
    <RouterProvider router={router} />
  )
}

export default App
