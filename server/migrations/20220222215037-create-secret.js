'use strict';
const { initDb }	= require("../../api/main/database/connector");

module.exports	= {
	async up(queryInterface, Sequelize) {
		await initDb();
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('Secrets');
	}
};