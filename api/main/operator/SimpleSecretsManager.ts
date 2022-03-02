import SimpleSecretsOperator				from "./SimpleSecretsOperator";
import { customObjectsApi }					from "../k8s/clients";
import { KubernetesObject, PatchUtils }		from "@kubernetes/client-node";
import http									from "http";
import { PatchDirectiveOperation, V1Patch }	from "../k8s/interfaces";
import logger								from "../utils/logger";

export interface SimpleSecretsSpec {
	version: number;
}

export interface SimpleSecretsStatus {
}

export interface SimpleSecrets extends KubernetesObject {
	spec: SimpleSecretsSpec;
	status: SimpleSecretsStatus;
}

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
	 * @return	{Promise}
	 */
	static async patchSimpleSecretAnnotation ( simpleSecret: SimpleSecrets, key: string, value: string ): Promise<{
		response: http.IncomingMessage;
		body: object;
	} | void> {
		const patch	= [
			{
				"op": PatchDirectiveOperation.ADD,
				"path": `/metadata/annotations/${key}`,
				value
			}
		];

		return await SimpleSecretsManager.patchSimpleSecret( simpleSecret, patch ).catch( logger.error );
	}
	/**
	 * @brief	Patches annotations
	 *
	 * @param	{SimpleSecrets} simpleSecret
	 * @param	{V1Patch} patch
	 *
	 * @return	{Promise}
	 */
	static async patchSimpleSecret ( simpleSecret: SimpleSecrets, patch: V1Patch ): Promise<{
		response: http.IncomingMessage;
		body: object;
	} | void> {
		const metadata	= simpleSecret.metadata;
		const namespace	= metadata.namespace;
		const name		= metadata.name;

		const options	= { headers: { "Content-type": PatchUtils.PATCH_FORMAT_JSON_PATCH } };

		return await customObjectsApi.patchNamespacedCustomObject( SimpleSecretsOperator.GROUP, SimpleSecretsOperator.VERSION, namespace, SimpleSecretsOperator.PLURAL, name, patch, undefined, undefined, undefined, options );
	}

	/**
	 * @brief	Patches the version annotation of the SimpleSecret
	 *
	 * @param	{SimpleSecrets} simpleSecret
	 * @param	{Number} version
	 *
	 * @return	{Promise}
	 */
	static async patchSimpleSecretVersionAnnotation( simpleSecret: SimpleSecrets, version: string ): Promise<{
		response: http.IncomingMessage;
		body: object;
	} | void> {
		return await SimpleSecretsManager.patchSimpleSecretAnnotation( simpleSecret, "currentVersion", version ).catch( logger.error );
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
		if ( simpleSecretResponse.statusCode !== 404 ) {
			return simpleSecretResponse.body as SimpleSecrets;
		}

		return null;
	}
}
