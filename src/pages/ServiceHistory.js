// ServiceHistory.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ServiceHistory = () => {
  const [serviceOrders, setServiceOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customerId, setCustomerId] = useState(5); // Default value, replace with the actual CustomerId provided by the user
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5184/api/Orders/getcustomerorder?customerId=${customerId}`);
        
        if (response.data.$values && response.data.$values.length > 0) {
          setServiceOrders(response.data.$values);
          setNotFound(false);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Error fetching service orders:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [customerId]);

  const handleCustomerIdChange = (e) => {
    setCustomerId(e.target.value);
  };

  // Function to calculate the total price of all orders and parts
  const calculateTotalCosts = () => {
    let totalCosts = 0;

    serviceOrders.forEach((order) => {
      totalCosts += calculateTotalPrice(order);
    });

    return totalCosts;
  };

  // Function to calculate the total price of the order
  const calculateTotalPrice = (order) => {
    const servicePrice = order.ServicePrice || 0;
    const partPrices = order.Parts.$values.map((part) => part.partPrice || 0);
    const totalPartPrice = partPrices.reduce((total, price) => total + price, 0);

    return servicePrice + totalPartPrice;
  };

  return (
    <div>
      <h2>Service History</h2>
      <label htmlFor="customerId">Select Customer ID: </label>
      <input
        type="number"
        id="customerId"
        name="customerId"
        value={customerId}
        onChange={handleCustomerIdChange}
      />

      {loading ? (
        <p>Loading...</p>
      ) : notFound ? (
        <p>Service history not found for the provided Customer ID.</p>
      ) : (
        <div>
          <ul>
            {serviceOrders.map((order, index) => (
              <li key={order.OrderId} style={{ backgroundColor: index % 4 < 2 ? '#f2f2f2' : '#d9d9d9', padding: '10px', marginBottom: '10px' }}>
                <strong>Order ID:</strong> {order.OrderId}<br />
                <strong>Order Date:</strong> {new Date(order.OrderDate).toLocaleString()}<br />
                <strong>Service Name:</strong> {order.ServiceName}<br />
                <strong>Service Price:</strong> {order.ServicePrice}<br />
                {order.Parts.$values.length > 0 && (
                  <div>
                    <strong>Parts:</strong>
                    <ul>
                      {order.Parts.$values.map((part) => (
                        <li key={part.PartId}>
                          <strong>Part Name:</strong> {part.partName}<br />
                          <strong>Part Price:</strong> {part.partPrice}<br />
                          <strong>Shipment Date:</strong> {new Date(part.shipmentDate).toLocaleString()}<br />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <strong>Total Price:</strong> {calculateTotalPrice(order)}<br />
                <hr />
              </li>
            ))}
          </ul>
          <hr />
          <strong>Total Costs of All Orders and Parts:</strong> {calculateTotalCosts()}<br />
        </div>
      )}
    </div>
  );
};

export default ServiceHistory;
