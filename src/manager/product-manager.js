const fs = require("fs").promises;

class ProductManager {

    static ultId = 0;
    constructor (path) {
        this.products = [];
        this.path = path;
    }
    async loadArray() {
        try {
            this.products = await this.readsFile();
        } catch (error) {
            console.log("Error al inicializar ProductManager");
        }
    }
    async addProduct (title, description, price, thumbnail, code, stock) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log("Todos los campos son obligatorios");
            return;
        }
        if (this.products.some(item => item.code === code)) {
            console.log("El código debe ser único");
            return;
        }
        const newProduct = {
            id : ++ProductManager.ultId,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }
        this.products.push(newProduct);

        await this.savesFile(this.products);
    }
    async getProducts(){
        const arrayProducts = await this.readsFile();
        return arrayProducts;
    }
    async getProductById (id) {
        const arrayProducts = await this.readsFile();
        const search = arrayProducts.find(item => item.id === id);
        if (!search) {
            return "Not Found";
        } else {
            console.log("Producto encontrado:");
            return search;
        }
    }

    async readsFile() {
        const answer = await fs.readFile(this.path, "utf-8");
        const arrayProducts = JSON.parse(answer);
        return arrayProducts;
    }
    async savesFile (arrayProducts) {
        await fs.writeFile(this.path, JSON.stringify(arrayProducts, null, 2));
    }

    async updateProduct(id, updatedProduct) {
        try {
            const arrayProducts = await this.readsFile(); 

            const index = arrayProducts.findIndex( item => item.id === id); 

            if(index !== -1) {
                arrayProducts[index] = {...arrayProducts[index], ...updatedProduct} ; 
                await this.savesFile(arrayProducts); 
                console.log("Producto actualizado"); 
            } else {
                console.log("No se encuentra el producto"); 
            }
        } catch (error) {
            console.log("Tenemos un error al actualizar productos"); 
        }
    }

    async deleteProduct(id) {
        try {
            const arrayProducts = await this.readsFile(); 

            const index = arrayProducts.findIndex( item => item.id === id); 

            if(index !== -1) {
                arrayProducts.splice(index, 1); 
                await this.savesFile(arrayProducts); 
                console.log("Producto eliminado"); 
            } else {
                console.log("No se encuentra el producto"); 
            }
        } catch (error) {
            console.log("Tenemos un error al eliminar productos"); 
        }
    }
};

//Common JS
module.exports = ProductManager;

//Con ESModules
// export default ProductManager;