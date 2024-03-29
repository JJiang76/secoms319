const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const Product = require("./dataSchema.js");

app.use(express.json());
app.use(cors());

app.use(express.static("public"));
app.use("/images", express.static("images"));

mongoose.connect("mongodb://127.0.0.1:27017/reactdata",
    {
    dbName: "reactdata",
    useNewUrlParser: true,
    useUnifiedTopology: true,
    }
);

const port = process.env.PORT || 4000;
const host = "localhost";
app.listen(port, () => {
    console.log(`App listening at http://%s:%s`, host, port);
});

app.get("/", async (req, resp) => {
    const query = {};
    const allProducts = await Product.find(query);
    console.log(allProducts);
    resp.send(allProducts);
});

app.get("/:category", async (req, resp) => {
    const category = req.params.category;
    const query = { category: category };
    const products = await Product.find(query);
    console.log(products);
    resp.send(products);
});


app.delete("/delete", async (req, res) => {
    console.log("Delete :", req.body);
    try {
        const query = { _id: req.body._id };
        await Product.deleteOne(query);
        const messageResponse = { message: `Product ${req.body._id} deleted correctly`, };
        res.send(JSON.stringify(messageResponse));
    } catch (err) {
        console.log("Error while deleting :" + p_id + " " + err);
    }
});

app.post("/insert", async (req, res) => {
    console.log(req.body);
    const p_id = req.body._id;
    const ptitle = req.body.title;
    const pprice = req.body.price;
    const pcategory = req.body.category;
    const pimage = req.body.image;
    const formData = new Product({
        _id: p_id,
        title: ptitle,
        price: pprice,
        category: pcategory,
        image: pimage
    });
    try {
        await Product.create(formData);
        const messageResponse = { message: `Product ${p_id} added correctly` };
        res.send(JSON.stringify(messageResponse));
    } catch (err) {
        console.log("Error while adding a new product:" + err);
    }
});

app.post("/update", async (req, res) => {
    console.log(req.body);
    const p_id = req.body._id;
    const pprice = req.body.price;
    try {
        await Product.findByIdAndUpdate(p_id, { price: pprice});
        const messageResponse = { message: `Product ${p_id} updated correctly` };
        res.send(JSON.stringify(messageResponse));
    } catch (err) {
        console.log("Error while updating a product:" + err);
    }
});