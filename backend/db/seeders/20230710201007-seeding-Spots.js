'use strict';

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options,[
      {
        ownerId: 1,
        address: "510 Sycamore Street",
        city: "Nazareth",
        state: "Pennsylvania",
        country: "United States of America",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "Martin Guitars",
        description: "Where legendary music is born",
        price: 5525
      },
      {
        ownerId: 1,
        address: "1980 Gillespie Way",
        city: "El Cajon",
        state: "California",
        country: "United States of America",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "Taylor Guitars",
        description: "Solid place to begin learning guitar",
        price: 2550
      },
      {
        ownerId: 1,
        address: "1974 Gillespie Way",
        city: "El Cajon",
        state: "California",
        country: "United States of America",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "Taylor Guitar Travel",
        description: "Learn from Bob Taylor himself",
        price: 1800
      },
      {
        ownerId: 1,
        address: "2548 Fender Avenue",
        city: "Fullerton",
        state: "California",
        country: "United States of America",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "Fender Guitars",
        description: "Where innovation began",
        price: 1500
      },
      {
        ownerId: 1,
        address: "16 McKinstry Street",
        city: "Hamilton",
        state: "Ontario",
        country: "Canada",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "F Bass, Inc",
        description: "Bringing the funk and the style",
        price: 12000
      }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['App Academy', 'Cap Academy', 'Zap Academy', 'Clap Academy'] }
    }, {});
  }
};
