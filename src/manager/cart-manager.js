const fs = require("fs").promises;

class CartManager {
    constructor(path) {
        this.path = path;
        this.carts = [];
        this.ultId = 0;

        this.loadCart();
    }

    async loadCart() {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            this.carts = JSON.parse(data);
            if (this.carts.length > 0) {
                this.ultId = Math.max(...this.carts.map(cart => cart.id));
            }
        } catch (error) {
            console.log("Error al cargar el carrito");
            await this.saveCart();
        }
    }

    async saveCart() {
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    }


    async crateCart() {
        const newCart = {
            id: ++this.ultId,
            products: []
        };

        this.carts.push(newCart);

        await this.saveCart();
        return newCart;
    }

    async getCartById(cartId) {
        try {
            const cartSearch = this.carts.find(cart => cart.id === cartId);

            if (!cartSearch) {
                throw new Error("No existe un carrito con ese id");
            }

            return cartSearch;

        } catch (error) {
            console.log("Error al obtener el carrito por id.");
            throw error;
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        const cart = await this.getCartById(cartId);
        const existsProduct = cart.products.find(p => p.product === productId);

        if (existsProduct) {
            existsProduct.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        await this.saveCart();
        return cart;
    }

}

module.exports = CartManager; 