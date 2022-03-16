import { createEncryptionKeySecretIfNotExists }	from "../../main/utils/encryption/encryption_key";
import { Secret }								from "../../main/database/models/Secret";
import {Fingerprint} from "../../main/database/models/Fingerprint";
import {FINGERPRINT_NAME} from "../../main/utils/encryption/fingerprint";

/**
 * @brief	Will return a backup of the secrets as well as the encryption key
 *
 * @param	{EventRequest} event
 */
export async function backup( event ) {
	event.send(
		{
			data: await Secret.findAll(),
			encryptionKey: process.env.ENCRYPTION_KEY,
			fingerprint: process.env.FINGERPRINT
		}
	);
}

/**
 * @brief	You can supply the data returned by calling the backup api endpoint
 *
 * @param	{EventRequest} event
 */
export async function restore( event ) {
	const { data, encryptionKey, fingerprint }	= event.body;

	const secrets	= await Secret.findAll();

	for ( const secret of secrets )
		await secret.destroy();

	for ( const secretData of data ) {
		delete secretData["id"];
		await new Secret( secretData ).save();
	}

	process.env.ENCRYPTION_KEY	= encryptionKey;
	process.env.FINGERPRINT		= fingerprint;

	await createEncryptionKeySecretIfNotExists( encryptionKey, true );
	const foundFingerprint	= await Fingerprint.findOne<Fingerprint>({
		where: {
			name: FINGERPRINT_NAME
		}
	});

	foundFingerprint.data	= fingerprint;
	await foundFingerprint.save();

	event.send();
}