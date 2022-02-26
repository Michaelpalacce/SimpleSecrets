import { V1Secret }		from '@kubernetes/client-node';
import { apiClient }	from "../k8s/clients"
import http				from "http";

export default class SecretsManager {
	/**
	 * @brief	Gets an existing secret, or returns null in case of error
	 *
	 * @param	{String} name
	 * @param	{String} namespace
	 */
	static async getSecret( name: string, namespace: string ): Promise<{
		response: http.IncomingMessage;
		body: V1Secret;
	} | null> {
		return await apiClient.readNamespacedSecret( name, namespace ).catch( e => null );
	}

	/**
	 * @brief	Creates a new secret. Error handling is left for the callee
	 *
	 * @param	{String} namespace
	 * @param	{V1Secret} secret
	 */
	static async createNewSecret( namespace: string, secret: V1Secret ): Promise<{
		response: http.IncomingMessage;
		body: V1Secret;
	}> {
		return await apiClient.createNamespacedSecret( namespace, secret );
	}

	/**
	 * @brief	Delets a namespaced secret. Error handling is left for the callee
	 *
	 * @param	{String} name
	 * @param	{String} namespace
	 */
	static async deleteSecret( name: string, namespace: string ): Promise<{
		response: http.IncomingMessage;
		body: V1Secret;
	}> {
		return await apiClient.deleteNamespacedSecret( name, namespace );
	}
}