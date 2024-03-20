// server/db.js

const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/the_acme_reservation_planner_db');
const uuid = require('uuid');

// Create tables
const createTables = async()=> {
  const SQL = `
    DROP TABLE IF EXISTS customers;
    DROP TABLE IF EXISTS restaurants;

    CREATE TABLE customer(
        id UUID PRIMARY KEY,
        name VARCHAR(100)
    );
    CREATE TABLE restaurant(        
        id UUID PRIMARY KEY,
        name VARCHAR(100)
    );
    CREATE TABLE reservation(
        id UUID PRIMARY KEY,
        reservation_date DATE NOT NULL,
        party_count INTEGER NOT NULL,
        reservation_id UUID REFERENCES restaurants table NOT NULL,
        customer_id UUID REFERENCES customers table NOT NULL
    );
  `;
  await client.query(SQL);
};

// Create a customer
const createCustomer = async({name})=> {
  const SQL = 'INSERT INTO customers(id, name) values($1, $2) returning *';
  return (await client.query(SQL, [uuid.v4(), name])).rows[0];
};

// Create a restaurant
const createRestaurant = async({name})=> {
  const SQL = 'INSERT INTO restaurants(id, name) values($1, $2) returning *';
  return (await client.query(SQL, [uuid.v4(), name])).rows[0];
};

// Fetch all customers
const fetchCustomers = async()=> {
  return (await client.query('SELECT * FROM customers')).rows;
};

// Fetch all restaurants
const fetchRestaurants = async()=> {
  return (await client.query('SELECT * FROM restaurants')).rows;
};

// Create a reservation
const createReservation = async({reservation_date, party_count, reservation_id, customer_id})=> {
  const SQL = 'INSERT INTO reservation(id, reservation_date, party_count, reservation_id, customer_id) values($1, $2, $3, $4, $5) returning *';
  return (await client.query(SQL, [uuid.v4(), reservation_date, party_count, reservation_id, customer_id])).rows[0];
};

// Destroy a reservation
const destroyReservation = async({id})=> {
  const SQL = 'DELETE FROM reservation WHERE id = $1';
  return (await client.query(SQL, [id])).rows[0];
};


module.exports = {
  client,
  createTables,
  createCustomer,
  createRestaurant,
  fetchCustomers,
  fetchRestaurants,
  createReservation,
  destroyReservation,
};