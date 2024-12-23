const express = require('express');
const adminRouter = express.Router();
const admin = require('../middlewares/admin');
const Product = require('../models/product');

//creating an admin middleware
adminRouter.post('/admin/add-product', admin, async (req, res) => {
    try{
        const {name, description, images, quantity, price, category} = req.body;
        let product = new Product({
            name,
            description,
            images,
            quantity,
            price,
            category,
        });
        product = await product.save();
        res.status(200).json(product);
    } catch(e) {
        res.status(500).json({error: e.message});
    }
});

adminRouter.get('/admin/get-products', admin, async (req, res) => {
    try{
        const products = await Product.find({});
        res.status(200).json(products);
    } catch(e) {
        res.status(500).json({error: e.message});
    }
});

adminRouter.post('/admin/delete-product', admin, async (req, res) => {
    try{
        const {id} = req.body;
        let deletedProduct = await Product.findByIdAndDelete(id);
        res.status(200).json(deletedProduct);
    } catch(e) {
        res.status(500).json({error: e.message});
    }
});

module.exports = adminRouter;