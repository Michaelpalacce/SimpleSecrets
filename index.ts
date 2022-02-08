// Framework Singleton instance

const app						= require( 'event_request' )();
import SimpleSecretsOperator	from "./api/main/operator/simpleSecretsOperator";
import logger					from "./utils/logger";
import { initDb }				from "./api/main/persistence/connector";
import getEncryptionKey			from "./utils/encryption_key";

/**
 * @brief	Initializes important components
 *
 * @details	Ensures We have an Encryption Key secret and sets it to an env variable
 * 			Start the operator and give it a logger.
 * 			Initializes the DB
 *
 * @async
 */
async function init() {
	process.env.ENCRYPTION_KEY	= await getEncryptionKey();
	await logger.info( `Encryption Key: ${process.env.ENCRYPTION_KEY}` );

	await initDb();
	const operator	= new SimpleSecretsOperator( logger );
	await operator.start();
}

require( "./api/main/server/kernel" );

const port	= process.env.APP_PORT || 80;

/**
 * @brief	Start server after initial steps
 */
init().then(() => {
	// Start Listening
	app.listen( port, async () => {
		logger.log( `Server started on port: ${port}` );
	});
})

