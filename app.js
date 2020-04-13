const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();



app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true});

const itemsSchema = {
    name: String
}; 

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to your todolist!"
});

const item2 = new Item({
    name: "Hit the + button to add an item"
});

const item3 = new Item({
    name: "Hover over the right side of the list and hit the delete button to delete an item"
});

const defaultItems = [item1, item2, item3];



app.get("/", function(req, res){
    let today = new Date();
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
};

let day = today.toLocaleDateString("en-US", options);

Item.find({}, function(err, foundItems){

    if(foundItems.length === 0){
        Item.insertMany(defaultItems, function(err){
            if(err){
                console.log(err);
            }else{
                console.log("Insertion sucessfull!");
            }
        });
        res.redirect("/");
    }else{
        res.render("list",{ kindOfDay: day, addItems: foundItems});
    }
    
})



});


app.post("/", function(req, res){

    if(req.body.button === ""){
        const itemName = req.body.newItem;
        const item = new Item({
            name: itemName
        });
        item.save();
        res.redirect("/");
    }else{
        var del = req.body.deleteButton;
        
        Item.findByIdAndRemove(del, function(err){
            if(!err){
                console.log("Sucessfully deleted!")
            }
            res.redirect("/");
        });
    }    
});



app.listen(8080, function(){
    console.log("app listening on port 8080!");
});