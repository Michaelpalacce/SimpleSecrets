"use strict";
import { Sequelize }	from "sequelize";
import Migration from "../models/Migration";

module.exports	= {
	async up( sequelize: Sequelize ) {
		await sequelize.sync();
	},
	async down( sequelize: Sequelize ) {}
};