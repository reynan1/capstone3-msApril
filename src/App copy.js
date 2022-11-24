import { useState, useEffect } from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { Container } from "react-bootstrap";
import AppNavbar from "./components/AppNavbar";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import Products from "./pages/Products";
import ProductView from "./pages/ProductView";
import Error from "./pages/Error";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Register from "./pages/Register";
import './App.css';
import { UserProvider } from "./UserContext";



function App() {

  const [user, setUser] = useState({
    id: null,
    isAdmin: null
  });

  const unsetUser = () =>{
    localStorage.clear(); 
  }

  useEffect(()=>{
    console.log(user);
    console.log(localStorage);
  }, [user])
  useEffect(()=>{

    fetch(`${process.env.REACT_APP_ECOMMERCE_URL}/users/:userId/details`, {
      method: "GET",
      headers:{
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);

      if(data._id !== undefined){
        setUser({
          id: data._id,
          isAdmin: data.isAdmin
        });
      }
      else{
        setUser({
          id: null,
          isAdmin: null
        });
      }
      
    })

  }, [])

  return (
    <UserProvider value={{user, setUser, unsetUser}}>
      <Router>
        <AppNavbar />
        <Container>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/adminDashboard" element={<AdminDashboard />} />
            <Route exact path="/products" element={<Products />} />
            <Route exact path="/products/:productId" element={<ProductView />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/logout" element={<Logout />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="*" element={<Error />} />
          </Routes>
            
        </Container>
      </Router>
    </UserProvider>
  );
}

export default App;
