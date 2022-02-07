// Framework Singleton instance
const app						= require( 'event_request' )();
import SimpleSecretsOperator	from "./api/main/operator/simpleSecretsOperator";
import logger					from "./utils/logger";

/**
 * @brief	Start the operator and give it a logger
 *
 * @async
 */
async function startOperator() {
	const operator	= new SimpleSecretsOperator( logger );

	await operator.start();
}

require( "./api/main/server/kernel" );

// Start Listening
app.listen( 80, async () => {
	await startOperator().catch( logger.error );

	logger.log( 'Server started' );
});
