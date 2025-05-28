// const sqlite3 = require('sqlite3').verbose();
// const http = require('http');
// const app = require('./app');
// // const initializeDefaultProducts = require('./src/utils/initializeProducts'); 

// // Create database connection
// const db = new sqlite3.Database('painting_generator.db', (err) => {
//     if (err) {
//         console.error('Error connecting to the database:', err.message);
//         process.exit(1); // Exit the application on database connection error
//     } else {
//         console.log('Connected to Database');
//         // Create an HTTP server after successfully connecting to the database
//         const server = http.createServer(app);
//         server.listen(3003, () => {
//             // initializeDefaultProducts();
//             console.log('Server is running on port 3003');
//         });
//     }
// });

const sqlite3 = require('sqlite3').verbose();
const http = require('http');
const app = require('./app');
const { Server } = require('socket.io');

// Create database connection
const db = new sqlite3.Database('painting_generator.db', (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        process.exit(1); // Exit the application on database connection error
    } else {
        console.log('Connected to Database');

        // Create the HTTP server once, after DB connection is successful
        const server = http.createServer(app);

        // Initialize Socket.IO on that same server
        const io = new Server(server, {
            cors: {
                origin: '*', // Allow CORS for development
            }
        });

        io.on('connection', (socket) => {
            console.log('Client connected:', socket.id);
            // You can add your socket logic here
        });

        // Start the server
        server.listen(3003, () => {
            console.log('Server is running on port 3003');
        });
    }
});
