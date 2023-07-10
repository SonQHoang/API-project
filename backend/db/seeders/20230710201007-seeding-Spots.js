'use strict';

const { Spot } = require('../models')

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    await Spot.bulkCreate(options, [
      {
        ownerId: 1,
        address: "123 Disney Land",
        city: "San Francisco",
        state: "California",
        country: "United States of America",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "App Academy",
        description: "Place where web developers are created",
        price: 123
      },
      {
        ownerId: 1,
        address: "456 Disney Land",
        city: "San Jose",
        state: "California",
        country: "United States of America",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "Cap Academy",
        description: "Place where web developers are created",
        price: 456
      },
      {
        ownerId: 1,
        address: "789 Disney Land",
        city: "San Diego",
        state: "California",
        country: "United States of America",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "Zap Academy",
        description: "Place where web developers are created",
        price: 789
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['App Academy', 'Cap Academy', 'Zap Academy'] }
    }, {});
  }
};
