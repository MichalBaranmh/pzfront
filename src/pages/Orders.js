import React, { useState, useEffect } from 'react';
import { Table, Form, Button } from 'react-bootstrap';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newOrder, setNewOrder] = useState({
    serviceName: '',
    servicePrice: '',
    customerId: '',
  });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5184/api/Orders', {
        headers: {
          'accept': 'application/json',
        },
      });

      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOrder((prevOrder) => ({ ...prevOrder, [name]: value }));
  };

  const handleAddOrder = async () => {
    try {
      setLoading(true);
      await axios.post('http://localhost:5184/api/Orders', {
        serviceName: newOrder.serviceName,
        servicePrice: parseFloat(newOrder.servicePrice), // Ensure it's a number
        customerId: parseInt(newOrder.customerId), // Ensure it's a number
      }, {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      // After adding, refetch the data to update the UI
      fetchOrders();

      // Clear the input fields
      setNewOrder({
        serviceName: '',
        servicePrice: '',
        customerId: '',
      });
    } catch (error) {
      console.error('Error adding order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5184/api/Orders/${orderId}`);

      // After deleting, refetch the data to update the UI
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <h2>Orders List</h2>

      {/* Form for adding a new order */}
      <Form>
        <Form.Group controlId="serviceName">
          <Form.Label>Service Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter service name"
            name="serviceName"
            value={newOrder.serviceName}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="servicePrice">
          <Form.Label>Service Price</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter service price"
            name="servicePrice"
            value={newOrder.servicePrice}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="customerId">
          <Form.Label>Customer ID</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter customer ID"
            name="customerId"
            value={newOrder.customerId}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Button variant="primary" onClick={handleAddOrder} disabled={loading}>
          Add Order
        </Button>
      </Form>

      {/* Orders table */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Order Date</th>
            <th>Service Name</th>
            <th>Service Price</th>
            <th>Customer ID</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.orderId}>
              <td>{order.orderId}</td>
              <td>{new Date(order.orderDate).toLocaleString()}</td>
              <td>{order.serviceName}</td>
              <td>{order.servicePrice}</td>
              <td>{order.customerId}</td>
              <td>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteOrder(order.orderId)}
                  disabled={loading}
                >
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

export default Orders;
