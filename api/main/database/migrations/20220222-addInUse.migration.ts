"use strict";
import { Sequelize, DataTypes }	from "sequelize";
import { Secret }				from "../models/Secret";
import Migration				from "../models/Migration";
import logger from "../../utils/logger";

module.exports	= {
	/**
	 * @brief	Add a new column inUse to Secrets
	 *
	 * @param	{Sequelize} sequelize
	 * @param	{String} migrationName
	 */
	async up ( sequelize: Sequelize, migrationName: string ): Promise<void> {
		const migration	= await Migration.findOne<Migration>({
			where: {
				name: migrationName
			}
		});
		if ( migration !== null )
			return;

		logger.log( "Migration addInUse will execute" );

		const queryInterface	= sequelize.getQueryInterface();
		const tableDefinition	= await queryInterface.describeTable( Secret.getTableName() );

		if ( tableDefinition.inUse ) {
			await Migration.create({
				name: migrationName,
			});
			return;
		}

		await queryInterface.addColumn(
			Secret.getTableName(),
			"inUse",
			{ type: DataTypes.BOOLEAN, defaultValue: false }
		);

		await Migration.create({
			name: migrationName,
		});
	},

	async down ( sequelize: Sequelize, migrationName: string ) {
		await sequelize.getQueryInterface().removeColumn( Secret.getTableName(), "inUse" );
		const migration	= await Migration.findOne<Migration>({
			where: {
				name: migrationName
			}
		});
		if ( migration === null )
			return;

		await migration.destroy();
	}
};