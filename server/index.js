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
      res.send(await fetchCustomer());
    }
    catch(ex){
      next(ex);
    }
  });

  // Routes for fetching customer restaurants
 app.get('/api/restaurants', async(req, res, next)=> {
    try {
      res.send(await fetchRestaurants(req.params.id));
    }
    catch(ex){
      next(ex);
    }
  });

  // Routes for creating a reservation
app.post('/api/customers/:id/reservations', async(req, res, next)=> {
    try {
      res.send(await createReservation(req.params.id, req.body));
    }
    catch(ex){
      next(ex);
    }
  });

  // Routes for deleting a reservation
app.delete('/api/customers/:customer_id/reservations/:id', async(req, res, next)=> {
    try {
      res.send(await destroyReservation(req.params.id));
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
    const [devin, luke, mitch] = await Promise.all([
        createCustomer({name: 'Devin'}),
        createCustomer({name: 'Luke'}),
        createCustomer({name: 'Mitch'}),
        createRestaurant({name: 'Restaurant1'}),
        createRestaurant({name: 'Restaurant2'}),
        createRestaurant({name: 'Restaurant3'}),
        ]);        
    console.log('Seeded the database!');
    console.log(`devin has an id of ${devin.id}`);
    console.log(`mitch has an id of ${mitch.id}`);
    console.log(`luke has an id of ${luke.id}`);
    console.log(`restaurant1 has an id of ${restaurant1.id}`);
    console.log(`restaurant2 has an id of ${restaurant2.id}`);
    console.log(`restaurant3 has an id of ${restaurant3.id}`);
    
    // Create some reservations
    await Promise.all([
        createReservation({reservation_date: '2020-01-01', party_count: 2, reservation_id: restaurant1.id, customer_id: devin.id}),
        createReservation({reservation_date: '2020-01-01', party_count: 2, reservation_id: restaurant2.id, customer_id: luke.id}),
        createReservation({reservation_date: '2020-01-01', party_count: 2, reservation_id: restaurant3.id, customer_id: mitch.id}),
    ]);
    console.log('Created some reservations!');

    
    // Define a middleware function to check if a user is logged in
    app.listen(3000, ()=> console.log('Listening on port 3000'));
    
  };
  
  init();