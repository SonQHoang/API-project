'use strict';

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    return queryInterface.bulkInsert(options,[
      {
        spotId: 1,
        url: "https://res.cloudinary.com/dgxpqnbwn/image/upload/v1691027906/Martin/jacek-dylag-ZHr2TzM1-hk-unsplash_zzfaej.jpg",
        preview: true
      },
      {
        spotId: 2,
        url: "https://res.cloudinary.com/dgxpqnbwn/image/upload/v1691027897/Martin/nancy-o-connor-6PLkgUeRvVk-unsplash_qsykmd.jpg",
        preview: true
      },
      {
        spotId: 3,
        url: "https://res.cloudinary.com/dgxpqnbwn/image/upload/v1691027904/Martin/toyamakanna-MraTwnzVAS0-unsplash_vo3scz.jpg",
        preview: true
      },
      {
        spotId: 4,
        url: "https://res.cloudinary.com/dgxpqnbwn/image/upload/v1691028058/fenderStrat/pxfuel_2_po6sw1.jpg",
        preview: true
      },
      {
        spotId: 5,
        url: "https://res.cloudinary.com/dgxpqnbwn/image/upload/v1691028082/fBass/AC6-Antique-Brown_rdvgti.jpg",
        preview: true
      },
    ], {})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1,2,3] }
    }, {});
  }
};
