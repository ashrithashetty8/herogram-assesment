const express = require('express');

const authRoutes = require('./auth');
const titleRoutes = require('./titles');
const paintingRoutes = require('./paintings');
const referenceRoutes = require('./references');

const router = express.Router();

const defaultRoutes = [
    {
        path: '/api/auth',
        route: authRoutes,
    },
    {
        path: '/api/titles',
        route: titleRoutes,
    },
    {
        path: '/api/paintings',
        route: paintingRoutes,
    },
    {
        path: '/api/references',
        route: referenceRoutes,
    },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});


module.exports = router;