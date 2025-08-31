import foodModel from "../models/foodModel.js";
import fs from "fs";

// add food item

const addFood = async (req, res) => {
  console.log("Request body:", req.body); // Debug log
  console.log("Request file:", req.file); // Debug log

  // Check if file is uploaded
  if (!req.file) {
    return res.json({ success: false, message: "Image is required" });
  }

  // Check if all required fields are present
  if (!req.body.name || !req.body.description || !req.body.price || !req.body.category) {
    return res.json({ success: false, message: "All fields are required" });
  }

  let image_filename = `${req.file.filename}`;

  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
  });

  try {
    await food.save();
    res.json({ success: true, message: "Food Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

//all list food
const listFood = async (req,res) =>{
  try {
    const foods = await foodModel.find({});
    res.json({success:true,data:foods})
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})
  }
}

//remove food item 
const removeFood = async (req,res)=>{
  try {
    const food = await foodModel.findById(req.body.id);
    fs.unlink(`uploads/${food.image}`,()=>{})

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({success:true,message:"Food Removed"})
  } catch (error){
    console.log(error);
    res.json({success:false,message:"Error"})
  }
}


export { addFood, listFood, removeFood};
