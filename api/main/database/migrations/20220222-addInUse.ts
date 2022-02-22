'use strict';
import { Sequelize, DataTypes }	from "sequelize";
import { Secret }				from "../models/Secret";
import Migration				from "../models/Migration";

module.exports	= {
	async up ( sequelize: Sequelize, migrationName: string ) {
		const migration	= await Migration.findOne<Migration>({
			where: {
				name: migrationName
			}
		})
		if ( migration !== null )
			return;

		const queryInterface	= sequelize.getQueryInterface();
		const tableDefinition	= await queryInterface.describeTable(Secret.getTableName())

		if (tableDefinition.inUse)
			return;

		await queryInterface.addColumn(
			Secret.getTableName(),
			'inUse',
			{ type: DataTypes.BOOLEAN, defaultValue: false }
		);

		await Migration.create({
			name: migrationName,
		});
	},
	async down ( sequelize: Sequelize, migrationName: string ) {
		await sequelize.getQueryInterface().removeColumn(Secret.getTableName(), 'inUse');
		const migration	= await Migration.findOne<Migration>({
			where: {
				name: migrationName
			}
		})
		if ( migration === null )
			return;

		await migration.destroy();
	}
};