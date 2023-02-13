
/* Importamos módulos */
const express = require('express');
const app = express();
const path = require('path');

/* Importamos módulos de ruteo */
const usersController = require('../controllers/usersController');

/* Importamos middlewares de chequeo de sesión */
const authMiddleware = require('../middlewares/authMiddleware');
const guestMiddleware = require('../middlewares/guestMiddleware');
const adminAuthMiddleware = require('../middlewares/adminAuthMiddleware');

/* Importamos y configuramos las validaciones */
const { body } = require('express-validator');

/* Validaciones del formulario de registración */
let registerForm = [
	body('firstName').notEmpty().withMessage('El nombre no puede estar vacío.').bail()
		.isLength({ min: 2 }).withMessage('El nombre no puede tener un largo menor a 2.'),
	body('lastName').notEmpty().withMessage('El apellido no puede estar vacío.').bail()
		.isLength({ min: 2 }).withMessage('El apellido no puede tener un largo menor a 2.'),
	body('email').notEmpty().withMessage('El email no puede estar vacío.').bail()
		.isEmail().withMessage('Ingrese un correo válido.'),
	body('password').notEmpty().withMessage('Debe ingresar una contraseña.').bail()
		.isLength({ min: 8 }).withMessage('La contraseña debe contener por lo menos 8 caracteres.'),
	body('passwordConfirmation').custom((value, { req }) => {
		if (value != req.body.password) {
			throw new Error('Las contraseñas no coinciden.');
		}
		return true;
	}),
	body('avatar').custom((value, { req }) => {
		if (req.file) {
			if (path.extname(req.file.filename) != '.jpg') {
				throw new Error('Se requiere un archivo de extensión .jpg.');
			}
		}
		return true;
	})
];

/* Validaciones del formulario de login */
let loginForm = [
	body('email').notEmpty().withMessage('El email no puede estar vacío.').bail()
		.isEmail().withMessage('Ingrese un correo válido.'),
	body('password').notEmpty().withMessage('Debe ingresar una contraseña.')
];

/* Importamos y configuramos Multer para las imágenes */
const multer = require('multer');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, '../../public/images/users'));
	},
	filename: function (req, file, cb) {
		cb(null, `img-${path.parse(file.originalname).name}-${Date.now()}${path.extname(file.originalname)}`);
	}
});

const uploadFile = multer({ storage: storage });

/* Creamos el módulo y definimos las rutas para main */
let router = express.Router();

// Login
router.get('/login', authMiddleware, usersController.index);
router.post('/login', loginForm, usersController.login);

// Registro
router.post('/register', uploadFile.single('avatar'), registerForm, usersController.register);
router.get('/profile', guestMiddleware, usersController.profile);

// Cerrar sesión
router.post('/logout', usersController.logout);

// Panel de usuarios
router.get('/panel', adminAuthMiddleware, usersController.panel);

module.exports = router;