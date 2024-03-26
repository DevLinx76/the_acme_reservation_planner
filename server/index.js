// server/index.js

// Define a middleware function to check if a user is logged in
const {
    client,
    createTables,
    createCustomer,
    createRestaurant,
    fetchCustomers,
    fetchRestaurants,
    createReservation,
    destroyReservation,   
  } = require('./db');

  // Import the express library
  const express = require('express');
  const app = express();
  app.use(express.json());
  
  //for deployment only
  const path = require('path');
  app.get('/', (req, res)=> res.sendFile(path.join(__dirname, '../client/dist/index.html')));
  app.use('./db', express.static(path.join(__dirname, '../client/dist/db'))); 
  

  // Routes for fetching customer information
  app.get('/api/customer', async(req, res, next)=> {
    try {
      res.send(await fetchCustomers());
    }
    catch(ex){
      next(ex);
    }
  });

  // Routes for fetching customer restaurants
 app.get('/api/restaurants', async(req, res, next)=> {
    try {
      res.send(await fetchRestaurants());
    }
    catch(ex){
      next(ex);
    }
  });

  // Routes for creating a reservation
app.post('/api/customers/:customer_id/reservations', async(req, res, next)=> {
    try {
      res.send(await createReservation({customer_id: req.params.customer_id, ...req.body}));
    }
    catch(ex){
      next(ex);
    }
  });

  // Routes for deleting a reservation
app.delete('/api/customers/:customer_id/reservations/:id', async(req, res, next)=> {
    try {
      res.send(await destroyReservation({customer_id: req.params.customer_id, id:req.params.id}));
    }
    catch(ex){
      next(ex);
    }
  });

  
  // Error handling
  app.use((err, req, res, next)=> {
    console.log(err);
    res.status(err.status || 500).send({ error: err.message ? err.message : err });
  });

  // Start the server
  const init = async()=> {
    await client.connect();
    console.log('Connected to the database!');
    await createTables();
    console.log('Tables created!');
    
    // Seed the database with some data
    const [devin, luke, mitch, restaurant1, restaurant2, restaurant3] = await Promise.all([
        createCustomer({name: 'devin'}),
        createCustomer({name: 'luke'}),
        createCustomer({name: 'mitch'}),
        createRestaurant({name: 'restaurant1'}),
        createRestaurant({name: 'restaurant2'}),
        createRestaurant({name: 'restaurant3'}),
        ]);           
    console.log(`devin has an id of ${devin.id}`);
    console.log(`mitch has an id of ${mitch.id}`);
    console.log(`luke has an id of ${luke.id}`);
    console.log(await fetchCustomers());
    console.log(await fetchRestaurants());
    
    // Create some reservations
    await Promise.all([
        createReservation({reservation_date: '2020-01-01', party_count: 2, restaurant_id: restaurant1.id, customer_id: devin.id}),
        createReservation({reservation_date: '2020-01-01', party_count: 2, restaurant_id: restaurant2.id, customer_id: luke.id}),
        createReservation({reservation_date: '2020-01-01', party_count: 2, restaurant_id: restaurant3.id, customer_id: mitch.id}),
    ]);
    const reservations = await fetchReservations();   
    console.log(reservations);
    await destroyReservation({id: reservations[0].id, customer_id: devin.id});
    console.log(await fetchReservations());

    
    // Define a middleware function to check if a user is logged in
    const port = process.env.PORT || 3000;
    app.listen(port, ()=> console.log('listening on port 3000'));
    
  };
  
  init();