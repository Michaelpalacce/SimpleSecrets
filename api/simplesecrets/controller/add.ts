'use strict';

// Dependencies
import App		from "event_request";
import db		from "../../main/operator/testDb";
const app		= App();
const router	= app.Router();

/**
 * @brief	Adds a '/api/simplesecrets' route with method POST
 */
router.post( '/simplesecrets', async ( event ) => {
	console.log( event.body );
	const body	= event.body;
	const { namespace, type, name, data }	= body;

	db[namespace][name.toLowerCase()]	= {
		type,
		data
	};

	console.log( db );
	event.send( "OK" );
});

module.exports	= router;