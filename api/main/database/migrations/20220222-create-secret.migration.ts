"use strict";
import { Sequelize }	from "sequelize";
import Migration from "../models/Migration";

module.exports	= {
	async up( sequelize: Sequelize ) {
		await sequelize.sync();
	},
	async down( sequelize: Sequelize ) {
		await sequelize.getQueryInterface().dropTable("Secrets");
		await sequelize.getQueryInterface().dropTable("Migration");
	}
};