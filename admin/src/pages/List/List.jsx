import React, { useEffect, useState } from 'react'
import './List.css'
import axios from 'axios'
import { toast } from 'react-toastify'

const List = () => {

  const url = "http://localhost:4000";
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/api/food/list`);
      console.log("Full response:", response);
      console.log("Response data:", response.data);
      
      if (response.data.success) {
        console.log("Food items:", response.data.data);
        setList(response.data.data);
      } else {
        console.log("API returned success: false");
        toast.error("Error: " + (response.data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Fetch error:", error);
      console.error("Error response:", error.response);
      toast.error("Failed to fetch food items: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList(); 
      } else {
        toast.error("Error removing food item");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to remove food item");
    }
  }

  useEffect(() => {
    fetchList();
  }, [])

  return (
    <div className='list add flex-col'>
        <p>All Foods List</p>
        {loading ? (
          <p>Loading...</p>
        ) : list.length === 0 ? (
          <p>No food items found. Check console for errors.</p>
        ) : (
          <div className="list-table">
            <div className="list-table-format title">
                <b>Image</b>
                <b>Name</b>
                <b>Category</b>
                <b>Price</b>
                <b>Action</b>
            </div>
            {list.map((item,index)=>{
                return (
                    <div key={index} className='list-table-format'>
                       <img src={`${url}/images/`+item.image} alt='' />
                       <p>{item.name}</p>
                       <p>{item.category}</p>
                       <p>${item.price}</p>
                       <p onClick={()=>removeFood(item._id)} className='cursor'>X</p>
                    </div>
                )
            })}
          </div>
        )}
    </div>
  )
}

export default List