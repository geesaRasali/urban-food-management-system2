import React, { useContext, useState, useEffect } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';

const MyOrders = () => {
    const { url, token } = useContext(StoreContext);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log("Fetching orders with token:", token);
            console.log("URL:", url + "/api/order/userorders");
            
            const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
            console.log("Orders response:", response.data);
            
            if (response.data.success) {
                setData(response.data.data || []);
            } else {
                setError(response.data.message || "Failed to fetch orders");
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            setError("Failed to load orders. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (token) {
            fetchOrders();
        } else {
            setLoading(false);
            setError("Please log in to view your orders");
        }
    }, [token])

    if (loading) {
        return (
            <div className='my-orders'>
                <h2>My Orders</h2>
                <div className="loading">Loading your orders...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='my-orders'>
                <h2>My Orders</h2>
                <div className="error">{error}</div>
            </div>
        );
    }

    return (
        <div className='my-orders'>
            <h2>My Orders</h2>
            <div className="container">
                {data.length === 0 ? (
                    <div className="no-orders">
                        <p>No orders found. Start ordering some delicious food!</p>
                    </div>
                ) : (
                    data.map((order, index) => (
                        <div key={order._id || index} className='my-orders-order'>
                            <img src={assets.parcel_icon} alt="Order" />
                            <p>{order.items && order.items.map((item, itemIndex) => {
                                if (itemIndex === order.items.length - 1) {
                                    return item.name + " x " + item.quantity;
                                } else {
                                    return item.name + " x " + item.quantity + ", ";
                                }
                            })}</p>
                            <p>${order.amount}.00</p>
                            <p>Items: {order.items ? order.items.length : 0}</p>
                            <p><span>&#x25cf;</span> <b>{order.status || "Food Processing"}</b></p>
                            <button onClick={fetchOrders}>Track Order</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default MyOrders