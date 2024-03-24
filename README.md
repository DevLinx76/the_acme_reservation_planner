# Block 34 Workshop: The Acme Reservation Planner

## Overview
In this workshop, you will be building a RESTFUL API that interacts with a separate data layer file. This approach simulates real-world software development practices where separation of concerns is crucial for maintainability and scalability. This workshop focuses on creating a RESTful API for managing reservations, customers, and restaurants, applying lessons on join tables and modularization in a Node.js environment.

## Getting Started
- **Clone the repository** and navigate into the directory.
- **Install dependencies** with `npm`.
- **Set up PostgreSQL database** and configure environment variables for the database connection.
- **Initialize the database** with the provided schema.

## Directions
- You'll replicate the guided practice setup but tailored for a reservation system.
- **Create a new repository** named `the_acme_reservation_planner`.
- Inside this repository, create a `server` folder containing:
  - `index.js`: Your Express application and initialization functions.
  - `db.js`: Acts as your data layer, interfacing with the PostgreSQL database.

## Steps
1. **Setup project**:
   - Create a folder: `mkdir the_acme_reservation_planner && cd the_acme_reservation_planner`.
   - Create package.json: `npm init -y`.
   - Setup your git repo: `git init`.
   - Install packages: `npm i pg` for PostgreSQL support and `npm i express` for the web server.
   - Add a `.gitignore` file to exclude `node_modules` and `.env` from your repository.
   - Inside the `server` directory, create `index.js` and `db.js` files.
   - In `index.js`, set up and initialize your Express app.
   - In `db.js`, configure the PostgreSQL client connection.

## Data Layer Requirements (`server/db.js`)
Your data layer should export the following functionalities:
- `client`: A Node.js PostgreSQL client.
- `createTables`: Drops existing tables and creates new ones for your application.
- `createCustomer`: Inserts a new customer into the database and returns the record.
- `createRestaurant`: Inserts a new restaurant into the database and returns the record.
- `fetchCustomers`: Retrieves an array of all customers from the database.
- `fetchRestaurants`: Retrieves an array of all restaurants from the database.
- `createReservation`: Inserts a new reservation into the database and returns the record.
- `destroyReservation`: Removes a reservation from the database.

## API Endpoints (`server/index.js`)
Your Express application should handle the following routes:
- `GET /api/customers`: Returns an array of customers.
- `GET /api/restaurants`: Returns an array of restaurants.
- `GET /api/reservations`: Returns an array of reservations.
- `POST /api/customers/:id/reservations`: Takes a `restaurant_id`, `date`, and `party_count` in the request body and returns the created reservation with a status code of 201.
- `DELETE /api/customers/:customer_id/reservations/:id`: Deletes a specific reservation based on the reservation ID and customer ID provided in the URL, returns a 204 status code.

## Database Schema
- **Customer**
  - `id` (UUID): Primary Key.
  - `name` (STRING): Customer's name.
- **Restaurant**
  - `id` (UUID): Primary Key.
  - `name` (STRING): Restaurant's name.
- **Reservation**
  - `id` (UUID): Primary Key.
  - `date` (DATE NOT NULL): Reservation date.
  - `party_count` (INTEGER NOT NULL): Number of people for the reservation.
  - `restaurant_id` (UUID REFERENCES restaurants): Foreign key to the restaurant.
  - `customer_id` (UUID REFERENCES customers): Foreign key to the customer.

## Testing
Use tools like curl or POSTMAN to test the functionality of your API endpoints, ensuring that each one behaves as expected.

## Evaluation Criteria
- Properly configured and connected PostgreSQL client.
- Implementation of required `createTables` and entity creation methods (`createCustomer`, `createRestaurant`, etc.).
- Correctly fetching data (`fetchCustomers`, `fetchRestaurants`, etc.).
- Successful creation and deletion of reservations through the API.
- Accurate API responses and status codes as per the requirements.
