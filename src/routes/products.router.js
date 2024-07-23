const express = require("express");
const ProductManager = require("../manager/product-manager.js");
const manager = new ProductManager("./src/data/products.json");
const router = express.Router();

router.get("/", async (req, res) => {
    const limit = req.query.limit;
    try {
        const arrayProducts = await manager.getProducts();
        if (limit) {
            res.send(arrayProducts.slice(0, limit));
        } else {
            res.send(arrayProducts);
        }
    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }
})


router.get("/:pid", async (req, res) => {
    let id = req.params.pid;
    try {
        const product = await manager.getProductById(parseInt(id));

        if (!product) {
            res.send("Producto no encontrado");
        } else {
            res.send(product);
        }
    } catch (error) {
        res.send("Error al buscar ese id en los productos");
    }
})



router.post("/", async (req, res) => {
    const newProduct = req.body;
    
    try {
        await manager.addProduct(newProduct); 

        res.status(201).send("Producto agregado exitosamente"); 
    } catch (error) {
        res.status(500).json({status: "error", message: error.message});
    }
})

router.put('/:pid', async (req, res) => {
    const id = req.params.pid;
    const updatedProduct = req.body;

    try {
        await manager.updateProduct(id, updatedProduct);
        res.status(200).send("Producto actualizado");
    } catch (error) {
        res.status(500).send("Error al actualizar el producto");
    }
});

router.delete('/:pid', async (req, res) => {
    const id = req.params.pid;

    try {
        await manager.deleteProduct(id);
        res.status(200).send("Producto eliminado");
    } catch (error) {
        res.status(500).send("Error al eliminar el producto");
    }
});

module.exports = router;