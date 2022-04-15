import { DataTypes, Sequelize }	from "sequelize";
import { parse }				from "path";
import { Dialect }				from "sequelize/types";
import { Secret }				from "./models/Secret";
import Migration				from "./models/Migration";
import logger					from "../utils/logger";
import { Fingerprint }			from "./models/Fingerprint";

const PROJECT_ROOT	= parse( require.main.filename ).dir;

let sequelize		= new Sequelize( {
		username: process.env.PROD_DB_USERNAME,
		password: process.env.PROD_DB_PASSWORD,
		database: process.env.PROD_DB_NAME,
		host: process.env.PROD_DB_HOSTNAME,
		port: parseInt( process.env.PROD_DB_PORT || "80" ),
		dialect: process.env.PROD_DB_DIALECT as Dialect || "sqlite",
		storage: process.env.DB_PATH || `${PROJECT_ROOT}/db.sqlite`,
		logging: false
	}
);

async function doMigration( migrationName: string ) {
	const migration	= await import( `./migrations/${migrationName}` );

	logger.log( `Performing migration : ${migrationName}` );

	await migration.up( sequelize, migrationName ).catch( async ( reason ) => {
		await migration.down( sequelize, migrationName );
		throw new Error( `Error while executing migration ${migrationName}. Reason: ${reason}` );
	});
}

export async function initDb() {
	Secret.init({
		data: DataTypes.TEXT,
		type: DataTypes.STRING,
		version: DataTypes.STRING,
		name: DataTypes.STRING,
		namespace: DataTypes.STRING,
		inUse: { type: DataTypes.BOOLEAN, defaultValue: false }
	}, { sequelize, modelName: "Secret" });

	Migration.init({
		name: DataTypes.STRING,
	}, { sequelize, modelName: "Migration" });

	Fingerprint.init({
		data: DataTypes.STRING,
		name: {
			type: DataTypes.STRING,
			unique: true
		}
	}, { sequelize, modelName: "Fingerprint" });

	try {
		await sequelize.authenticate();
		await logger.log( "Connection has been established successfully." );
	} catch (error) {
		await logger.error( `Unable to connect to the database: ${error}` );
	}

	const migrations	= ["20220222-create-secret.migration", "20220222-addInUse.migration", "20220316-fingerprint.migration"];

	for ( const migration of migrations )
		await doMigration( migration );
}

