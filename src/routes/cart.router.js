const express = require("express");
const router = express.Router();
const CartManager = require("../manager/cart-manager");
const cartManager = new CartManager("./src/data/cart.json");


router.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.crateCart();
        res.json(newCart);
    } catch (error) {
        res.status(500).send("Error del servidor.");
    }
})


router.get("/:cid", async (req, res) => {
    const cartID = parseInt(req.params.cid);

    try {
        const cartSearch = await cartManager.getCartById(cartID);
        res.json(cartSearch.products);
    } catch (error) {
        res.status(500).send("Error del servidor al buscar un carrito loco");
    }
})


router.post("/:cid/products/:pid", async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        if (isNaN(cartId)) {
            return res.status(400).send("ID invalido");
        }

        const updatedCart = await cartManager.addProductToCart(cartId, productId, quantity);

        if (!updatedCart) {
            return res.status(404).send("Producto no encontrado en el carrito");
        }

        res.json(updatedCart.products);
    } catch (error) {
        console.error("Error al ingresar un producto al carrito:", error);
        res.status(500).send("Error al ingresar un producto al carrito");
    }
});


module.exports = router;