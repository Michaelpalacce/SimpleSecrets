import { createHash }		from "crypto";
import { apiClient }		from "../../k8s/clients";
import logger				from "../logger";
import { V1Secret }			from "@kubernetes/client-node";
import { IncomingMessage }	from "http";

const VARIABLE_NAME			= "encryptionKey";
const SECRET_NAME			= "encryptionkey";
const SECRET_NAMESPACE		= "simplesecrets";

let encryptionKey			= "";

/**
 * @brief	Deletes the encryption key secret
 */
export async function deleteEncryptionKeySecret(): Promise<void> {
	await apiClient.deleteNamespacedSecret( SECRET_NAME, SECRET_NAMESPACE ).catch( e => {
		logger.error( e.body );
	} );
}

/**
 * @brief	Returns the secret encryption key or creates it and then returns it
 *
 * @details	If forceDelete is passed, the Secret will be recreated
 *
 * @param	{String} encryptionKey
 * @param	{Boolean} forceDelete
 */
export async function createEncryptionKeySecretIfNotExists( encryptionKey: string, forceDelete = false ): Promise<{
	body: V1Secret,
	response: IncomingMessage
}> {
	if ( forceDelete )
		await deleteEncryptionKeySecret();

	return await apiClient.readNamespacedSecret( SECRET_NAME, SECRET_NAMESPACE ).catch( async e => {
		await logger.warn( `Creating a new encryption key secret: ${encryptionKey}` );
		return await apiClient.createNamespacedSecret( SECRET_NAMESPACE, {
			apiVersion: "v1",
			kind: "Secret",
			metadata: {
				name: SECRET_NAME,
				namespace: SECRET_NAMESPACE,
			},
			type: "Opaque",
			stringData: {
				[VARIABLE_NAME]: encryptionKey
			}
		});
	});
}

/**
 * @brief	Ensures the encryption key secret is created in K8S and returns it
 *
 * @return	{String}
 */
export default async function (): Promise<string> {
	if ( ! encryptionKey ) {
		const fallbackEncryptionKey	= process.env.ENCRYPTION_KEY || createHash( "md5" ).update( Date.now().toString() ).digest( "hex" );
		const secret				= await createEncryptionKeySecretIfNotExists( fallbackEncryptionKey );

		encryptionKey				= Buffer.from( secret.body.data[VARIABLE_NAME], "base64" ).toString();
	}

	return encryptionKey;

}
