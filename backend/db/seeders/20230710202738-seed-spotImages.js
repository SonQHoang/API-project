'use strict';

const { SpotImage } = require('../models')

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    await SpotImage.bulkCreate(options,[
      {
        spotId: 1,
        url: 'https://www.yosemite.com/wp-content/uploads/2023/04/Vernal-Fall-Yosemite-Mariposa-Things-To-Do-Slide-.jpg',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://images.squarespace-cdn.com/content/v1/5a5986b2cf81e095e172ce87/1623294729670-P42H344SV2A4ZOTBKMCZ/flyingdawnmarie-yosemite-mist-trail-12.jpg',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://www.nps.gov/yose/planyourvisit/images/PB061149-gp-people-20141103-jtrust-web_2.jpg?maxwidth=1300&maxheight=1300&autorotate=false',
        preview: true
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1,2,3] }
    }, {});
  }
};
