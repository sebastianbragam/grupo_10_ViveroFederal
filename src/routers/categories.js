/* Importamos módulos */
const express = require('express');
const app = express();
const path = require('path');

/* Importamos módulos de ruteo */
const categoriesController = require('../controllers/categoriesController');

/* Importamos middlewares de chequeo de sesión */
const adminAuthMiddleware = require('../middlewares/adminAuthMiddleware');

/* Importamos y configuramos las validaciones */
const { body } = require('express-validator');

/* Validaciones del formulario de registración */
let createForm = [
    body('name').notEmpty().withMessage('El nombre no puede estar vacío.').bail()
        .isLength({ min: 2 }).withMessage('El nombre no puede tener un largo menor a 2.'),
    body('image').custom((value, { req }) => {
        if (req.file) {
            if (path.extname(req.file.filename) != '.jpg') {
                throw new Error('Se requiere un archivo de extensión .jpg.');
            }
        }
        return true;
    })
];

/* Validaciones del formulario de edición */
let editForm = [
    body('name').notEmpty().withMessage('El nombre no puede estar vacío.').bail()
        .isLength({ min: 2 }).withMessage('El nombre no puede tener un largo menor a 2.'),
    body('image').custom((value, { req }) => {
        if (req.file) {
            if (path.extname(req.file.filename) != '.jpg') {
                throw new Error('Se requiere un archivo de extensión .jpg.');
            }
        }
        return true;
    })
];

/* Importamos y configuramos Multer para las imágenes */
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../public/images/categories'));
    },
    filename: function (req, file, cb) {
        cb(null, `img-${path.parse(file.originalname).name}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const uploadFile = multer({ storage: storage });

/* Creamos el módulo y definimos las rutas para main */
let router = express.Router();

// Listado de categorías
router.get('/panel', adminAuthMiddleware, categoriesController.panel);

// Nueva categoría
router.get('/add', adminAuthMiddleware, categoriesController.add);
router.post('/add', adminAuthMiddleware, uploadFile.single('image'), createForm, categoriesController.store);


// Edición de categoría


module.exports = router;