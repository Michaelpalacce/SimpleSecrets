'use strict';

// Dependencies
import App		from "event_request";
import Secret	from "../../main/persistence/connector";
import {encrypt} from "../../main/encryptor/encrypt";
const app		= App();
const router	= app.Router();

/**
 * @brief	Adds a '/api/simplesecrets' route with method POST
 *
 * @TODO	ADD VERSIONS
 */
router.post( '/simplesecrets', async ( event ) => {
	const body	= event.body;
	const { namespace, type, name, data }	= body;

	const search	= await Secret.findOne({
		where: {
			name, namespace
		}
	});

	const encryptedData	= encrypt( JSON.stringify( { 1: data } ) );

	if ( ! search ) {
		const secret	= await Secret.create({
			data: encryptedData,
			version: "1",
			type,
			namespace,
			name: name.toLowerCase()
		});

		event.send( secret );
		return;
	}

	event.send( search )
});

module.exports	= router;