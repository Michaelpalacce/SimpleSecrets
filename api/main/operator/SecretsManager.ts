import { V1Secret, V1Status }	from '@kubernetes/client-node';
import { apiClient }			from "../k8s/clients"
import http						from "http";

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

	/**
	 * @brief	Deletes a namespaced secret.
	 *
	 * @details	Returns the error message in case of error
	 *
	 * @param	{String} name
	 * @param	{String} namespace
	 */
	static async deleteSecret( name: string, namespace: string ): Promise<{
		response: http.IncomingMessage;
		body: V1Status;
	}> {
		return await apiClient.deleteNamespacedSecret( name, namespace ).catch( e => e.body.message );
	}
}