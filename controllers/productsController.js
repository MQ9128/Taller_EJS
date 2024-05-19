const fs = require('fs');
const path = require('path');

function renderProducts(products) {
    return products.map(product => {
        return `
            <tr>
                <td>${product.product_name}</td>
                <td>${product.product_price}</td>
                <td>${product.product_quantity}</td>
                <td>${product.product_price * product.product_quantity}</td>
            </tr>
        `;
    }).join('');
}

exports.getProducts = (req, res, next) => {
    const filePath = path.join(__dirname, '../data/products.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return next(err);
        }

        let jsonData = JSON.parse(data);

        let products = jsonData.products; // Accede a la propiedad "products"

        // Verificar si se proporciona el parámetro min_price
        let minPrice = parseFloat(req.query.min_price);

        // Filtrar los productos si el parámetro min_price está presente y es válido
        if (!isNaN(minPrice)) {
            products = products.filter(product => product.product_price > minPrice);
        }

        // Si no se aplicó el filtro y se proporcionó min_price, mostrar todos los productos
        if (req.query.min_price && products.length === 0) {
            products = jsonData.products;
        }

        const renderedProducts = renderProducts(products);

        res.render('products', { renderedProducts });
    });
};
