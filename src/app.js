
/* Importamos módulos */
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

/* Importamos módulos propios de ruteo */
const mainRoutes = require('../routers/main')
const productsRoutes = require('../routers/products')
const usersRoutes = require('../routers/users')

/* Declaramos carpeta static */
app.use(express.static('public'));

/* Levantamos server */
app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
});

/* Definimos rutas */
app.use('/', mainRoutes);
app.use('/products', productsRoutes);
app.use('/users', usersRoutes);

