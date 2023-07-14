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
        url: 'www.haha.com'
      },
      {
        reviewId: 2,
        url: 'www.waha.com'
      },
      {
        reviewId: 3,
        url: 'www.baha.com'
      },
    ], {})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1,2,3] }
    }, {});
  }
};
