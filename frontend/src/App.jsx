import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Navbar from "./components/Navbar/Navbar";
import Header from "./components/Navbar/Header/Header";
import ExploreMenu from "./components/ExploreMenu/ExploreMenu";
import { StoreContext } from "./context/StoreContext";
import FoodDisplay from "./components/FoodDisplay/FoodDisplay";
import FoodItem from "./components/FoodItem/FoodItem";
import { useState } from "react";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import Footer from "./components/Footer/Footer";

const App =() => {

  const [showLogin,setShowLogin] = useState(false)
  return (
    <>
    {showLogin?<LoginPopup setShowLogin={setShowLogin}/>:<></>}
    <div className="app">
      <Navbar setShowLogin={setShowLogin}/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order" element={<PlaceOrder />} />
        <Route path="/header" element={<Header />} />
        <Route path="/explore-menu" element={<ExploreMenu />} />
        <Route path="/store-context" element={<StoreContext/>}/>
        <Route path ="/food-display" element={<FoodDisplay/>}/>
        <Route path="/navbar" element={<Navbar/>}/>
        <Route path="/place-order" element={<PlaceOrder/>}/>
        <Route path="/explore-menu" element={<ExploreMenu/>}/>
        <Route path="/food-item" element={<FoodItem/>}/>
       
        </Routes>
        
    </div>
   <Footer/>
      </>
  );
}

export default App;
