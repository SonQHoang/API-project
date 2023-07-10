"use strict";

const { ReviewImage } = require('../models')

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {

  async up (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    await ReviewImage.bulkCreate([
      {
        reviewId: 1,
        url: 'https://www.yosemite.com/wp-content/uploads/2023/04/Vernal-Fall-Yosemite-Mariposa-Things-To-Do-Slide-.jpg',
      },
      {
        reviewId: 2,
        url: 'https://images.squarespace-cdn.com/content/v1/5a5986b2cf81e095e172ce87/1623294729670-P42H344SV2A4ZOTBKMCZ/flyingdawnmarie-yosemite-mist-trail-12.jpg',
      },
      {
        reviewId: 3,
        url: 'https://www.nps.gov/yose/planyourvisit/images/PB061149-gp-people-20141103-jtrust-web_2.jpg?maxwidth=1300&maxheight=1300&autorotate=false',
      },
    ])

  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: [1,2,3] }
    }, {});
  }
};
