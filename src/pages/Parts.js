// Parts.js
import React, { useState, useEffect } from 'react';
import { Table, Form, Button } from 'react-bootstrap';
import axios from 'axios';

const Parts = () => {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newPart, setNewPart] = useState({
    partName: '',
    partPrice: '',
  });

  const fetchParts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5184/api/Parts', {
        headers: {
          'accept': 'application/json',
        },
      });

      setParts(response.data);
    } catch (error) {
      console.error('Error fetching parts data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPart((prevPart) => ({ ...prevPart, [name]: value }));
  };

  const handleAddPart = async () => {
    try {
      setLoading(true);
      await axios.post('http://localhost:5184/api/Parts', newPart, {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      // After adding, refetch the data to update the UI
      fetchParts();

      // Clear the input fields
      setNewPart({
        partName: '',
        partPrice: '',
      });
    } catch (error) {
      console.error('Error adding part:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePart = async (partId) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5184/api/Parts/${partId}`);

      // After deleting, refetch the data to update the UI
      fetchParts();
    } catch (error) {
      console.error('Error deleting part:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrder = async (partId, orderId, customerId) => {
    try {
      setLoading(true);
      await axios.patch('http://localhost:5184/api/Parts/updateorder', {
        partId,
        orderId,
        customerId,
      });

      // After updating, refetch the data to update the UI
      fetchParts();
    } catch (error) {
      console.error('Error updating order for part:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParts();
  }, []);

  return (
    <div>
      <h2>Parts List</h2>

      {/* Form for adding a new part */}
      <Form>
        <Form.Group controlId="partName">
          <Form.Label>Part Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter part name"
            name="partName"
            value={newPart.partName}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="partPrice">
          <Form.Label>Part Price</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter part price"
            name="partPrice"
            value={newPart.partPrice}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Button variant="primary" onClick={handleAddPart} disabled={loading}>
          Add Part
        </Button>
      </Form>

      {/* Parts table */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Part ID</th>
            <th>Shipment Date</th>
            <th>Part Name</th>
            <th>Part Price</th>
            <th>Order ID</th>
            <th>Action</th>
            <th className="text-center">Update Order</th>
          </tr>
        </thead>
        <tbody>
          {parts.map((part) => (
            <tr key={part.partId}>
              <td>{part.partId}</td>
              <td>{new Date(part.shipmentDate).toLocaleString()}</td>
              <td>{part.partName}</td>
              <td>{part.partPrice}</td>
              <td>{part.orderID}</td>
              <td>
                <Button
                  variant="danger"
                  onClick={() => handleDeletePart(part.partId)}
                  disabled={loading}
                >
                  Delete
                </Button>
              </td>
              <td className="text-center">
                {part.orderID ? (
                  <span>Order ID: {part.orderID}</span>
                ) : (
                  <div>
                    <Form.Control
                      type="number"
                      placeholder="Order ID"
                      onChange={(e) => handleUpdateOrder(part.partId, e.target.value, /* provide customerId here */)}
                    />
                    <Button
                      variant="info"
                      onClick={() => handleUpdateOrder(part.partId, part.orderID, /* provide customerId here */)}
                      disabled={loading}
                    >
                      Update Order
                    </Button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Parts;
