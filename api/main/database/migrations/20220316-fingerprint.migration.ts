"use strict";
import { Sequelize }		from "sequelize";
import { Secret }			from "../models/Secret";
import Migration			from "../models/Migration";
import logger				from "../../utils/logger";
import { Fingerprint }		from "../models/Fingerprint";
import { decrypt, encrypt }	from "../../utils/encryption/encrypt";
import getFingerprint		from "../../utils/encryption/fingerprint";

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

		logger.log( "Migration fingerprint will execute" );

		const secrets	= await Secret.findAll();

		// Generate a Fingerprint here in case of migration and not a new database
		if ( secrets.length > 0 ) {
			logger.warn( "Migration from an older version detected, creating a fingerprint" );
			process.env.FINGERPRINT		= await getFingerprint();
		}

		for ( const secret of secrets ) {
			// Get the encryption key from the env and use it to decrypt the data if any
			// Encrypt it with the new strategy then
			secret.data	= encrypt( decrypt( secret.data, false ) );
			await secret.save();
		}

		await Migration.create({
			name: migrationName,
		});
	},

	async down ( sequelize: Sequelize, migrationName: string ) {
		const fingerprints	= await Fingerprint.findAll();

		for ( const fingerprint of fingerprints ) {
			await fingerprint.destroy();
		}
	}
};