'use strict';

// Dependencies
import App			from "event_request";
import Secret		from "../../main/persistence/connector";
import { decrypt }	from "../../main/encryptor/encrypt";
const app			= App();
const router		= app.Router();

/**
 * @brief	Adds a '/api/simplesecrets' route with method GET
 */
router.get( '/simplesecrets', async ( event ) => {
	event.send( await Secret.findAll() );
});

/**
 * @brief	Adds a '/api/simplesecrets/:namespace:/:name:' route with method GET
 */
router.get( '/simplesecrets/:namespace:/:name:', async ( event ) => {
	const secret	= await Secret.findOne({
		where: {
			name: event.params.name,
			namespace: event.params.namespace,
		}
	});

	secret.data	= JSON.parse( decrypt( secret.data ) );

	event.send( secret );
});

/**
 * @brief	Adds a '/api/simplesecrets/:namespace:' route with method GET
 */
router.get( '/simplesecrets/:namespace:', async ( event ) => {
	event.send( await Secret.findAll({
		where: {
			namespace: event.params.namespace
		}
	}) );
});

module.exports	= router;