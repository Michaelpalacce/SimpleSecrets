'use strict';

// Dependencies
import App		from "event_request";
import Secret	from "../../main/persistence/connector";
const app		= App();
const router	= app.Router();

/**
 * @brief	Adds a '/api/simplesecrets' route with method GET
 */
router.get( '/simplesecrets/backup', async ( event ) => {
	console.log( 'HERE' );
	console.log( JSON.stringify( await Secret.findAll(), null, 2 ) );

	event.send( await Secret.findAll() );
});

module.exports	= router;