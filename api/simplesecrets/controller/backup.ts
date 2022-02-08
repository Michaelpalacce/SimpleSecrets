'use strict';

// Dependencies
import App										from "event_request";
import Secret									from "../../main/persistence/connector";
import { createEncryptionKeySecretIfNotExists }	from "../../../utils/encryption_key";

const app										= App();
const router									= app.Router();

/**
 * @brief	Adds a '/api/simplesecrets' route with method GET
 */
router.get( '/simplesecrets/backup', async ( event ) => {
	event.send( {
		data: await Secret.findAll(),
		encryptionKey: process.env.ENCRYPTION_KEY
	} );
});

/**
 * @brief	Adds a '/api/simplesecrets' route with method GET
 */
router.post( '/simplesecrets/restore', async ( event ) => {
	const backedUpData	= event.body.data;
	const encryptionKey	= event.body.encryptionKey;

	for ( const data of backedUpData ) {
		delete data['id'];
		await new Secret( data ).save();
	}

	process.env.ENCRYPTION_KEY	= encryptionKey;
	await createEncryptionKeySecretIfNotExists( encryptionKey, true );

	event.send();
});

module.exports	= router;