const { 
    client, 
    getAllUsers, 
    createUser, 
    updateUser,
} = require('./index');

// new function, should attempt to create a few users
async function createInitialUsers() {
    try {
        console.log("Starting to create users...");

        const albert = await createUser({ username: 'albert', password: 'bertie99', name: 'Albert', location: 'Pittsburgh' });

        const sandra = await createUser({ username: 'sandra', password: '2sandy4me', name: 'Sandra', location: 'Clevland' });

        const glamgal = await createUser({ username: 'glamgal', password: 'soglam', name: 'Jimmy', location: 'Atlanta' });

        console.log("Finished creating users!");
    } catch (error) {
        console.error("Error creating users!");
        throw error;
    }
}

// this function should call a query which drops all tables from our database
async function dropTables() {
  try {
    console.log("Starting to drop tables...");

    await client.query(`
    DROP TABLE IF EXISTS posts;
    DROP TABLE IF EXISTS users;
    
    `);

    console.log("Finished dropping tables!");
  } catch (error) {
    throw error; // we pass the error up to the function that calls dropTables
    console.error("Error dropping tables!");
  }
}

// this function should call a query which creates all tables for our database 
async function createTables() {
  try {
    console.log("Starting to build tables...");

    await client.query(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username varchar(255) UNIQUE NOT NULL,
      password varchar(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL,
      active BOOLEAN DEFAULT true
      );
    `);

    await client.query(`
    CREATE TABLE posts (
      id SERIAL PRIMARY KEY,
      "authorId" INTEGER REFERENCES users(id) NOT NULL,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      active BOOLEAN DEFAULT true
      );
    `);

    console.log("Finished building tables!");
  } catch(error) {
    console.error("Error building tables!");
    throw error; 
  }
}

async function rebuildDb() {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
  } catch (error) {
    throw error;
  } 
}

async function testDB() {
  try {
    console.log("Starting to test database...");

    console.log("Calling getAllUsers")
    const users = await getAllUsers();
    console.log("getAllUsers:", users);

    console.log("Calling updateUser on users[0]")
    const updateUserResult = await updateUser(users[0].id, {
        name: "Newname Sogood",
        location: "Lesterville, KY"
    });
    console.log("Result:", updateUserResult);

    console.log("Finished database tests!");
  } catch (error) {
    console.error("Error testing database!");
    throw error;
  }
}

rebuildDb()
.then(testDB)
.catch(console.error)
.finally(() => client.end());