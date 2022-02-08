'use strict';

// Dependencies
import App					from "event_request";
import Secret				from "../../main/persistence/connector";
import { decrypt, encrypt }	from "../../main/encryptor/encrypt";
import SimpleSecretsManager	from "../../main/operator/SimpleSecretsManager";

const app					= App();
const router				= app.Router();



/**
 * @brief	Adds a '/api/simplesecrets' route with method POST
 */
router.post( '/simplesecrets', async ( event ) => {
	const body								= event.body;
	const { namespace, type, name, data }	= body;

	const search	= await Secret.findOne({
		where: {
			name, namespace
		}
	});

	if ( ! search ) {
		const encryptedData	= encrypt( JSON.stringify( { 1: data } ) );

		const secret	= await Secret.create({
			data: encryptedData,
			version: 1,
			type,
			namespace,
			name: name.toLowerCase()
		});

		event.send( secret );
		return;
	}

	const decryptedData			= JSON.parse( decrypt( search.data ) );
	const newVersion			= parseInt( search.version ) + 1;

	decryptedData[newVersion]	= data;

	search.data					= encrypt( JSON.stringify( decryptedData ) );
	search.version				= newVersion.toString();

	await search.save();

	const simpleSecret	= await SimpleSecretsManager.getSimpleSecret( namespace, name );

	if ( simpleSecret !== null )
		if ( ! simpleSecret?.spec?.version )
			await SimpleSecretsManager.patchSimpleSecretVersionAnnotation( simpleSecret, `${newVersion}` ).catch( console.log );

	event.send( search )
});

module.exports	= router;