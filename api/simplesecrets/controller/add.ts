'use strict';

// Dependencies
import App		from "event_request";
import Secret	from "../../main/persistence/connector";
const app		= App();
const router	= app.Router();

/**
 * @brief	Adds a '/api/simplesecrets' route with method POST
 */
router.post( '/simplesecrets', async ( event ) => {
	const body	= event.body;
	const { namespace, type, name, data }	= body;

	const secret	= await Secret.create({
		data: JSON.stringify( { 1: data } ),
		version: "1",
		type,
		namespace,
		name: name.toLowerCase()
	})

	event.send( secret );
});

module.exports	= router;