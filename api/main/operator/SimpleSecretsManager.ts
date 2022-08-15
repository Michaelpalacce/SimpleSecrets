import { customObjectsApi }					from "../k8s/clients";
import { PatchUtils }						from "@kubernetes/client-node";
import http									from "http";
import { PatchDirectiveOperation, V1Patch }	from "../k8s/interfaces";
import logger								from "../utils/logger";
import SimpleSecrets						from "../interfaces/simpleSecret";
import { GROUP, PLURAL, VERSION }			from "./operatorConstants";



/**
 * @brief	Class responsible for handling api calls for SimpleSecret CRDs
 */
export default class SimpleSecretsManager {
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

		return await customObjectsApi.patchNamespacedCustomObject( GROUP, VERSION, namespace, PLURAL, name, patch, undefined, undefined, undefined, options );
	}

	/**
	 * @brief	Patches the version annotation of the SimpleSecret
	 *
	 * @details	This will add /metadata/annotations if they are not set already. If this is skipped, the patch will fail, so we do it
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
		const patch: V1Patch	= [
			{
				"op": PatchDirectiveOperation.ADD,
				"path": `/metadata/annotations/currentVersion`,
				value: version
			}
		];

		if ( ! simpleSecret.metadata.annotations ){
			patch.unshift(
				{
					op:PatchDirectiveOperation.ADD,
					path:"/metadata/annotations",
					value:{}
				}
			)
		}

		return await SimpleSecretsManager.patchSimpleSecret( simpleSecret, patch ).catch( logger.error );
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
		const simpleSecretResponse	= await customObjectsApi.getNamespacedCustomObject( GROUP, VERSION, namespace, PLURAL, name ).catch( e => e );
		if ( simpleSecretResponse.statusCode !== 404 ) {
			return simpleSecretResponse.body as SimpleSecrets;
		}

		return null;
	}
}
