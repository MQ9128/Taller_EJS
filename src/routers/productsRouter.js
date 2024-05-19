const router = require('express').Router();
const productsController = require('../../controllers/productsController'); 

router.get('/', productsController.getProducts);

module.exports = router;