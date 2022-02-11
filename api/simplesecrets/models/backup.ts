import { Secret }								from "../../main/persistence/connector";
import { createEncryptionKeySecretIfNotExists }	from "../../main/utils/encryption/encryption_key";

/**
 * @brief	Will return a backup of the secrets as well as the encryption key
 *
 * @param	{EventRequest} event
 */
export async function backup( event ) {
	event.send( {
		data: await Secret.findAll(),
		encryptionKey: process.env.ENCRYPTION_KEY
	} );
}

/**
 * @brief	You can supply the data returned by calling the backup api endpoint
 *
 * @param	{EventRequest} event
 */
export async function restore( event ) {
	const backedUpData	= event.body.data;
	const encryptionKey	= event.body.encryptionKey;

	for ( const data of backedUpData ) {
		delete data['id'];
		await new Secret( data ).save();
	}

	process.env.ENCRYPTION_KEY	= encryptionKey;
	await createEncryptionKeySecretIfNotExists( encryptionKey, true );

	event.send();
}