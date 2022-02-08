import SimpleSecretsOperator, { SimpleSecrets }	from "./simpleSecretsOperator";
import { customObjectsApi }						from "../k8s/clients";
import { PatchUtils }							from "@kubernetes/client-node";
import http										from "http";

/**
 * @brief	Class responsible for handling api calls for SimpleSecret CRDs
 */
export default class SimpleSecretsManager {
	/**
	 * @brief	Patches annotations
	 *
	 * @param	{SimpleSecrets} simpleSecret
	 * @param	{String} key
	 * @param	{String} value
	 *
	 * @return	Promise
	 */
	static async patchSimpleSecretAnnotation ( simpleSecret: SimpleSecrets, key: string, value: any ): Promise<{
		response: http.IncomingMessage;
		body: object;
	} | void> {
		const patch	= [
			{
				"op": "add",
				"path": `/metadata/annotations/${key}`,
				"value": value
			}
		];

		return await SimpleSecretsManager.patchSimpleSecret( simpleSecret, patch ).catch( console.log );
	}
	/**
	 * @brief	Patches annotations
	 *
	 * @param	{SimpleSecrets} simpleSecret
	 * @param	{Object} patch
	 *
	 * @return	Promise
	 */
	static async patchSimpleSecret ( simpleSecret: SimpleSecrets, patch: object ): Promise<{
		response: http.IncomingMessage;
		body: object;
	} | void> {
		const metadata	= simpleSecret.metadata;
		const namespace	= metadata.namespace;
		const name		= metadata.name;

		const options	= { headers: { "Content-type": PatchUtils.PATCH_FORMAT_JSON_PATCH } };

		return await customObjectsApi.patchNamespacedCustomObject( SimpleSecretsOperator.GROUP, SimpleSecretsOperator.VERSION, namespace, SimpleSecretsOperator.PLURAL, name, patch, undefined, undefined, undefined, options ).catch( console.log );
	}

	/**
	 * @brief	Patches the version annotation of the SimpleSecret
	 *
	 * @param	{SimpleSecrets} simpleSecret
	 * @param	{Number} version
	 *
	 * @return	Promise
	 */
	static async patchSimpleSecretVersionAnnotation( simpleSecret: SimpleSecrets, version: string ): Promise<{
		response: http.IncomingMessage;
		body: object;
	} | void> {
		return await SimpleSecretsManager.patchSimpleSecretAnnotation( simpleSecret, 'currentVersion', version ).catch( console.log );
	}

	/**
	 * @brief	Patches the version annotation of the SimpleSecret
	 *
	 * @param	{SimpleSecrets} simpleSecret
	 * @param	{Number} version
	 *
	 * @return	{Promise}
	 */
	static async patchSimpleSecretVersion( simpleSecret: SimpleSecrets, version: string ): Promise<{
		response: http.IncomingMessage;
		body: object;
	} | void> {
		console.log( 'PATCHING' );
		const patch	= [
			{
				"op": "add",
				"path": `/spec/version`,
				"value": version
			}
		];
		return await SimpleSecretsManager.patchSimpleSecret( simpleSecret, patch ).catch( console.log );
	}

	/**
	 * @brief	Gets a simple secret if it exists or null if it does not
	 *
	 * @param	{String} namespace
	 * @param	{String} name
	 *
	 * @return	{Promise}
	 */
	static async getSimpleSecret( namespace: string, name: string ): Promise<SimpleSecrets | null> {
		const simpleSecretResponse	= await customObjectsApi.getNamespacedCustomObject( SimpleSecretsOperator.GROUP, SimpleSecretsOperator.VERSION, namespace, SimpleSecretsOperator.PLURAL, name ).catch( e => e );
		if ( simpleSecretResponse.status !== 'Failure' ) {
			return simpleSecretResponse.body as SimpleSecrets;
		}

		return null;
	}
}