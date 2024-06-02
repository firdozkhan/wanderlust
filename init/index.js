const mongoose=require("mongoose");
const listing=require("../model/listing.js");
const initData=require("./data.js");

main()
    .then(()=>console.log("connected to database"))
    .catch((err)=>console.log(err))

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/tour");
}
const initDatabase=async ()=>{
    await listing.deleteMany({});
    await listing.insertMany(initData.data);
    console.log("data is initialised");
}
initDatabase();
