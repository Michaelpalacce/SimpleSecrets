'use strict';

// Dependencies
import App		from "event_request";
import Secret	from "../../main/persistence/connector";
const app		= App();
const router	= app.Router();

/**
 * @brief	Adds a '/api/simplesecrets' route with method DELETE
 */
router.delete( '/simplesecrets', async ( event ) => {
	const secrets	= await Secret.findAll();

	secrets.every( async ( secret ) => {
		await secret.destroy()
	})

	event.send();
});

/**
 * @brief	Adds a '/api/simplesecrets/:namespace:/:name:' route with method DELETE
 */
router.delete( '/simplesecrets/:namespace:/:name:', async ( event ) => {
	const secret	= await Secret.findOne({
		where: {
			name: event.params.name,
			namespace: event.params.namespace,
		}
	});

	if ( secret )
		await secret.destroy();

	event.send();
});

module.exports	= router;