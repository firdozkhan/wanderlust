const express=require("express");
const mongoose=require("mongoose");
const Listing=require("./model/listing.js");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const path=require("path");
const app=express();

app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

main()
    .then(()=>console.log("connected to database"))
    .catch((err)=>console.log(err))

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/tour");
}
app.get("/",(req,res)=>res.redirect("/listing"));
app.get("/listing",async (req,res)=>{
    let listingData=await Listing.find({});
    res.render("listing/homePage.ejs",{listingData});
})

app.get("/listing/new",(req,res)=>{
    res.render("listing/addListing.ejs");
})
app.post("/listing/new",async (req,res)=>{
    let newListing=new Listing({...req.body.listing});
    newListing.save()
        .then(res=>console.log(res))
        .catch(err=>console.log(err));
    res.redirect("/listing");
})

app.get("/listing/:id",async (req,res)=>{
    let {id}=req.params;
    let listing= await Listing.findById(id);
    res.render("listing/listingDetail.ejs",{listing});
})

app.get("/listing/:id/edit",async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    
    res.render("listing/editListing.ejs",{listing});
})
app.put("/listing/:id",async (req,res)=>{
    let {id}=req.params;
    console.log(req.body.listing);
    await Listing.findOneAndUpdate({_id:id},{...req.body.listing});
    res.redirect("/listing");
})
app.delete("/listing/:id/delete",async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
})
app.listen(8080,()=>{
    console.log("Listening on port 8080");
})