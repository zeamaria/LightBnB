const properties = require('./json/properties.json');
const users = require('./json/users.json');

const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */

//  let user;
//  for (const userId in users) {
//    user = users[userId];
//    if (user.email.toLowerCase() === email.toLowerCase()) {
//      break;
//    } else {
//      user = null;
//    }
//  }return Promise.resolve(user);

const getUserWithEmail = function(email) {

  const sql = `SELECT * FROM users WHERE email = $1`;
  const promise = pool.query(sql, [email])

    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message)
    });

  return promise;
};

exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  const sql = `SELECT * FROM users WHERE id = $1`;
  const promise = pool.query(sql, [id])

    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message)
    });

  return promise;
}

exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */


const addUser =  function(user) {
  const values = [user.name, user.email, user.password]
  const sql = `
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;
  `;
  const promise = pool.query(sql, values)
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message)
    });

  return promise; 
}
exports.addUser = addUser;

// INSERT INTO 



/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return getAllProperties(null, 2);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */


const getAllProperties = (options, limit = 10) => {

  return pool
    .query(`SELECT * FROM properties LIMIT $1`, [limit])
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
  };

 exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
