import React, { useState, useEffect } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import './Customers.css';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    customerName: '',
    firstName: '',
    lastName: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5184/api/Customers', {
        headers: {
          'accept': 'application/json',
        },
      });

      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (customerId) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5184/api/Customers/${customerId}`);
      // After deleting, refetch the data to update the UI
      fetchData();
    } catch (error) {
      console.error('Error deleting customer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer((prevCustomer) => ({ ...prevCustomer, [name]: value }));
  };

  const handleAddCustomer = async () => {
    try {
      setLoading(true);
      await axios.post('http://localhost:5184/api/Customers', newCustomer, {
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
        },
      });

      // After adding, refetch the data to update the UI
      fetchData();

      // Clear the input fields
      setNewCustomer({
        customerName: '',
        firstName: '',
        lastName: '',
      });
    } catch (error) {
      console.error('Error adding customer:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // This dependency array should be empty if you want to fetch data on component mount

  return (
    <div>
      <h2>Customer List</h2>

      {/* Form for adding a new customer */}
      <Form>
        <Form.Group controlId="customerName">
          <Form.Label>Customer Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter customer name"
            name="customerName"
            value={newCustomer.customerName}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="firstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter first name"
            name="firstName"
            value={newCustomer.firstName}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="lastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter last name"
            name="lastName"
            value={newCustomer.lastName}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Button variant="primary" onClick={handleAddCustomer} disabled={loading}>
          Add Customer
        </Button>
      </Form>

      {/* Customer table */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer Name</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Creation Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.customerId}>
              <td>{customer.customerId}</td>
              <td>{customer.customerName}</td>
              <td>{customer.firstName}</td>
              <td>{customer.lastName}</td>
              <td>{new Date(customer.creationDate).toLocaleString()}</td>
              <td>
                <Button variant="danger" onClick={() => handleDelete(customer.customerId)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Customers;
