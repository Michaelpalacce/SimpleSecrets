'use strict';

const {Secret} = require("../../api/main/database/connector");
module.exports = {
	async up (queryInterface, Sequelize) {
		await queryInterface.addColumn( Secret.getTableName(), 'inUse', { type: Boolean, defaultValue: false } );
	},

	async down (queryInterface, Sequelize) {
		await queryInterface.removeColumn( Secret.getTableName(), 'inUse' );
	}
};
