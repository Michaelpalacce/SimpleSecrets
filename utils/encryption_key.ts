import { createHash }	from "crypto";
import { apiClient }	from "../api/main/k8s/clients";
const VARIABLE_NAME		= "encryptionKey";
const SECRET_NAME		= "encryptionkey";
const SECRET_NAMESPACE	= "simplesecrets";

let encryptionKey	= "";

/**
 * @brief	Ensures the encryption key secret is created in K8S and returns it
 *
 * @return	{String}
 */
export default async function (): Promise<string> {
	if ( ! encryptionKey ) {
		let secret	= await apiClient.readNamespacedSecret( SECRET_NAME, SECRET_NAMESPACE ).catch( async e => {
			let encryptionKey	= createHash( 'md5' ).update( Date.now().toString() ).digest( 'hex' );
			return await apiClient.createNamespacedSecret(SECRET_NAMESPACE, {
				apiVersion: "v1",
				kind: 'Secret',
				metadata: {
					name: SECRET_NAME,
					namespace: SECRET_NAMESPACE,
				},
				type: 'Opaque',
				stringData: {
					[VARIABLE_NAME]: encryptionKey
				}
			});
		});

		encryptionKey	= Buffer.from( secret.body.data[VARIABLE_NAME], 'base64' ).toString();
	}

	return encryptionKey;

}
