import { V1Secret }		from '@kubernetes/client-node';
import { apiClient }	from "./clients"
import http				from "http";

export default class SecretsHelper {
	/**
	 * @brief	Deletes a namespaced secret.
	 *
	 * @details	Returns the error message in case of error
	 *
	 * @param	{String} name
	 * @param	{String} namespace
	 */
	static async ensureSecretIsMissing( name: string, namespace: string ): Promise<void> {
		await apiClient.deleteNamespacedSecret( name, namespace ).catch( e => e.body.message )
	}

	/**
	 * @brief	Creates a new secret.
	 *
	 * @details	Returns the error message in case of error
	 *
	 * @param	{String} namespace
	 * @param	{V1Secret} secret
	 */
	static async createNewSecret( namespace: string, secret: V1Secret ): Promise<{
		response: http.IncomingMessage;
		body: V1Secret;
	}> {
		return await apiClient.createNamespacedSecret( namespace, secret ).catch( e => e.body.message );
	}
}