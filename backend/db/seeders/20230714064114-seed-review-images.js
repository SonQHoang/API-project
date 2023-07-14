'use strict';

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    return queryInterface.bulkInsert(options,[
      {
        reviewId: 1,
        url: "www.amazing.com",
      },
      {
        reviewId: 2,
        url: "www.wow.com",
      },
      {
        reviewId: 3,
        url: "www.crazy.com",
      },
      {
        reviewId: 4,
        url: "www.amazing.com",
      },
      {
        reviewId: 5,
        url: "www.wow.com",
      },
      {
        reviewId: 6,
        url: "www.crazy.com",
      },
    ], {})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: [1,2,3,4,5,6] }
    }, {});
  }
};
