import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const placeOrder = async (req,res) => {

    const frontend_url = "http://localhost:5173"

    try {
        console.log("Order request received:", req.body);
        
       
        if (!req.body.items || !req.body.amount || !req.body.address) {
            return res.json({success:false, message:"Missing required fields"});
        }

        
        const userId = req.headers.token; // Temporary - you should decode the actual userId from JWT

       
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        })

        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}});
       
   
        
        const line_items = req.body.items.map((item)=>({
            price_data:{
                currency:"lkr",                    
                product_data:{
                    name:item.name                  // Product name
                },
                unit_amount:item.price*100*80  // Price in cents (Stripe requirement)
            },
            quantity:item.quantity                  // How many items
        }))
   
         // Add delivery charges as separate line item
         line_items.push({
            price_data:{
                currency:"lkr",
                product_data:{
                    name:"Delivery Charges"
                },
                unit_amount:2*100*80           // Delivery fee
            },
            quantity:1
         })

         // Create Stripe checkout session
         const session = await stripe.checkout.sessions.create({
              line_items:line_items,              // What customer is buying
              mode:'payment',                     // One-time payment
              success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
              cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
              
            }) 
            
            // Send session URL back to frontend
            res.json({success:true,success_url:session.url})

    } catch (error) {
            console.log(error);
            res.json({success:false,message:"Error"})
    }

}

const verifyOrder =  async (req,res) =>{
   const {orderId,success} = req.body;
   try {

       if (success=="true") {
           await orderModel.findByIdAndUpdate(orderId,{payment:true});
           res.json({success:true,message:'paid'})
      
        }

        else{
            await orderModel.findByIdAndDelete(orderId);
            RES.json ({success:false,message:"Not Paid"})
        }
   } catch (error) {
       console.log(error);
       res.json({success:false,message:"Error"})
   }
}
 
export {placeOrder,verifyOrder}