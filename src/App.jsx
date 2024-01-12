import React from 'react';
import { Routes, Route, Link, NavLink } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Customers from './pages/Customers';
import Orders from './pages/Orders';
import Parts from './pages/Parts';
import { NavbarBrand } from 'react-bootstrap';

function App() {
  return (
    <div>
      <>
      <Navbar expand="lg" bg="dark" data-bs-theme="dark" >
        <Container>
          <NavbarBrand>Car Service</NavbarBrand>
          <Nav className="me-auto">
            <NavLink className="nav-link" to="/Customers" >Customers</NavLink>
            <NavLink className="nav-link" to="/Orders">Orders</NavLink>
            <NavLink className="nav-link" to="/Parts">Parts</NavLink>
          </Nav>
        </Container>
      </Navbar>
      
      <Routes>
        <Route path='/Customers' element={<Customers />} />
        <Route path='/Orders' element={<Orders />}/>
        <Route path='/Parts' element={<Parts />}/>
      </Routes>
      </>
    </div>
  );
}

export default App;
