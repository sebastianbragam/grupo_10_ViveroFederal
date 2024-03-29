
/* Importamos módulos */
const express = require('express');
const app = express();
const path = require('path');

/* Importamos módulos de ruteo */
const productsController = require('../controllers/productsController');

/* Importamos middlewares de chequeo de sesión */
const adminAuthMiddleware = require('../middlewares/adminAuthMiddleware');
const guestMiddleware = require('../middlewares/guestMiddleware');

/* Importamos y configuramos las validaciones */
const { body } = require('express-validator');

/* Validaciones del formulario de creación de productos */
let validateCreateForm = [
    body('name').notEmpty().withMessage('El nombre no puede estar vacío.').bail()
        .isLength({ min: 5 }).withMessage('El nombre no puede tener un largo menor a 5.'),
    body('price').notEmpty().withMessage('El precio no puede estar vacío.').bail()
        .isFloat({ gt: 0 }).withMessage('El precio debe ser un número positivo.'),
    body('discount').notEmpty().withMessage('El descuento no puede estar vacío.').bail()
        .isFloat({ ge: 0, lt: 100 }).withMessage('El descuento debe ser un número entre 0 y 100.'),
    body('category_id').notEmpty().withMessage('Debe seleccionar una categoría.'),
    body('description').notEmpty().withMessage('La descripción no puede estar vacia.').bail()
        .isLength({ min: 20 }).withMessage('La descripción no puede tener un largo menor a 20.'),
    body('image').custom((value, { req }) => {
        if (req.file) {
            if (path.extname(req.file.filename) != '.jpg'
                && path.extname(req.file.filename) != '.jpeg'
                && path.extname(req.file.filename) != '.png'
                && path.extname(req.file.filename) != '.gif') {
                throw new Error('Se requiere un archivo de alguna de las siguientes extensiones: jpg, jpeg, png o gif.');
            }
        } else {
            throw new Error('Se requiere una imagen.');
        }
        return true;
    })
];

/* Validaciones del formulario de edición de productos */
let validateEditForm = [
    body('name').notEmpty().withMessage('El nombre no puede estar vacío.').bail()
        .isLength({ min: 5 }).withMessage('El nombre no puede tener un largo menor a 5.'),
    body('price').notEmpty().withMessage('El precio no puede estar vacío.').bail()
        .isFloat({ gt: 0 }).withMessage('El precio debe ser un número positivo.'),
    body('discount').notEmpty().withMessage('El descuento no puede estar vacío.').bail()
        .isFloat({ ge: 0, lt: 100 }).withMessage('El descuento debe ser un número entre 0 y 100.'),
    body('category_id').notEmpty().withMessage('Debe seleccionar una categoría.'),
    body('description').notEmpty().withMessage('La descripción no puede estar vacia.').bail()
        .isLength({ min: 20 }).withMessage('La descripción no puede tener un largo menor a 20.'),
    body('image').custom((value, { req }) => {
        if (req.file) {
            if (path.extname(req.file.filename) != '.jpg'
                && path.extname(req.file.filename) != '.jpeg'
                && path.extname(req.file.filename) != '.png'
                && path.extname(req.file.filename) != '.gif') {
                throw new Error('Se requiere un archivo de alguna de las siguientes extensiones: jpg, jpeg, png o gif.');
            }
        }
        return true;
    })
];

/* Importamos y configuramos Multer para las imágenes */
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../public/images/products'));
    },
    filename: function (req, file, cb) {
        cb(null, `img-${path.parse(file.originalname).name}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const uploadFile = multer({ storage: storage });

/* Creamos el módulo y definimos las rutas para main */
let router = express.Router();

// Listar productos
router.get('/', productsController.index);

// Buscar productos
router.post('/search', productsController.search);

// Detalle de producto
router.get('/detail/:id', productsController.detail);

// Panel de productos
router.get('/panel', adminAuthMiddleware, productsController.panel);
router.post('/panel/search', adminAuthMiddleware, productsController.panelSearch);

// Crear producto
router.get('/add', adminAuthMiddleware, productsController.create);
router.post('/add', adminAuthMiddleware, uploadFile.single('image'), validateCreateForm, productsController.store);

// Editar producto
router.get('/edit/:id', adminAuthMiddleware, productsController.edit);
router.put('/edit/:id', adminAuthMiddleware, uploadFile.single('image'), validateEditForm, productsController.update);

// Deshabilitar producto
router.delete('/delete/:id', adminAuthMiddleware, productsController.disable);

// Habilitar el producto
router.put('/enable/:id', adminAuthMiddleware, productsController.enable);

// Carrito de compras
router.get('/productCart', guestMiddleware, productsController.cart);

// Agregar al carrito
router.post('/productCart/add/:id', guestMiddleware, productsController.cartAdd);

// Sacar del carrito
router.delete('/productCart/remove/:id', guestMiddleware, productsController.cartRemove);

// Favoritos
router.get('/favorites', guestMiddleware, productsController.favorites);

// Agregar a favoritos
router.post('/favorites/add/:id', guestMiddleware, productsController.favoritesAdd);

// Quitar de favoritos
router.delete('/favorites/remove/:id', guestMiddleware, productsController.favoritesRemove);


module.exports = router;