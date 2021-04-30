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


/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */


const getAllReservations = function(guest_id, limit = 10) {
  const values = [guest_id, limit];
  const sql = `
  SELECT * FROM reservations 
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id
  WHERE reservations.guest_id = $1
  AND reservations.end_date < now()::date 
  GROUP BY property_reviews.id, properties.id, reservations.id
  ORDER BY reservations.start_date 
  LIMIT $2;
  `;

  const promise = pool.query(sql, values)
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message)
    });

  return promise; 
};

exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */


const getAllProperties = (options, limit = 10) => {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  // 3
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  };

  if (options.owner_id) {
    if (queryParams.length) {
      queryParams.push(`%${options.owner_id}%`);
      queryString += `AND owner LIKE $${queryParams.length} `;
    } else {
      queryParams.push(`%${options.owner_id}%`);
      queryString += `WHERE owner LIKE $${queryParams.length} `;
    }
  };

  if (options.maximum_price_per_night){
    if (queryParams.length) {
      queryParams.push(Number((options.maximum_price_per_night) * 100));
      queryString += `AND cost_per_night >= $${queryParams.length} `;
    } else {
      queryParams.push(Number((options.maximum_price_per_night) * 100));
      queryString += `WHERE cost_per_night <= $${queryParams.length} `;
    }
  };

  if (options.minimum_price_per_night){
    if (queryParams.length) {
      queryParams.push(Number((options.maximum_price_per_night) * 100));
      queryString += `AND cost_per_night >= $${queryParams.length} `;
    } else {
      queryParams.push(Number((options.minimum_price_per_night) * 100));
      queryString += `WHERE cost_per_night <= $${queryParams.length} `;
    }
  };

  if (options.minimum_rating) {
     queryParams.push(Number(options.minimum_rating));
     queryString += ` HAVING avg(property_reviews.rating) >= $${queryParams.length} `;
  };

  // 4
  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5
  console.log(queryString, queryParams);

  // 6
  return pool.query(queryString, queryParams).then((res) => res.rows);
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
