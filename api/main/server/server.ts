// Framework Singleton instance

const app						= require( "event_request" )();
import Operator					from "@dot-i/k8s-operator";
import SimpleSecretsOperator	from "../operator/SimpleSecretsOperator";
import logger					from "../utils/logger";
import { initDb }				from "../database/connector";
import getEncryptionKey			from "../utils/encryption/encryption_key";

let operator: Operator;
let server: { close():void; };
const port	= process.env.APP_PORT || 8080;

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
	await logger.info( `Starting initialization` );
	process.env.ENCRYPTION_KEY	= await getEncryptionKey();
	await logger.info( `Encryption Key: ${process.env.ENCRYPTION_KEY}` );

	await initDb();

	if ( ! operator ) {
		operator	= new SimpleSecretsOperator( logger );
		await operator.start();
	}
}

require( "./kernel" );


export default async function () {
	/**
	 * @brief	Start server after initial steps
	 */
	await init();
	await logger.log( `Finished with Initialization` );
	await logger.log( `Starting on port: ${port}` );

	server	= app.listen( port, async () => {
		await logger.log( `Server started on port: ${port}` );
	});
}
