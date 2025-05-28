# 🚀 RESTful API for Products and Reviews  

A RESTful API built using **Node.js, Express, SQLite, and Sequelize** to manage products and their reviews.  

## 📌 Technologies Used  
- **Node.js** - Server-side runtime  
- **Express.js** - Web framework for building APIs  
- **SQLite** - Lightweight database  
- **Sequelize** - ORM for database interaction  
- **Joi** - Input validation  
- **Postman** - API testing  

---

## 💒 Project Structure  
```
-- postman-collection  # API Endpoints Collection (for testing)
src\
 |-- controllers\      # Handles incoming requests (Controller layer)
 |-- joi-validation\   # Input validation using Joi
 |-- middlewares\      # Custom Express middlewares
 |-- models\           # Database models (Data layer)
 |-- routes\           # API routes
 |-- sample-data\      # Sample JSON data for initial setup
 |-- services\         # Business logic (Service layer)
 |-- utils\            # Utility functions and error handling
-- app.js              # Express app configuration
-- index.js            # Application entry point
-- package.json        # Project dependencies and scripts
```