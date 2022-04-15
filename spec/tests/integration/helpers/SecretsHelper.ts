import { V1Secret }		from "@kubernetes/client-node";
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
	 * @brief	Gets an existing secret, or returns null in case of error
	 *
	 * @details	Wait a bit in case where sync delays may happen
	 *
	 * @param	{String} name
	 * @param	{String} namespace
	 * @param	{Number} time
	 */
	static async getSecretAfterTime( name: string, namespace: string, time: number = 500 ): Promise<{
		response: http.IncomingMessage;
		body: V1Secret;
	} | null> {
		await new Promise( resolve => setTimeout( resolve, time ) );

		return await apiClient.readNamespacedSecret( name, namespace ).catch( e => {
			return null;
		} );
	}

	/**
	 * @brief	Attempts to get a secret with retries
	 *
	 * @param	{String} name
	 * @param	{String} namespace
	 * @param	{Number} retries
	 * @param	{Number} retryTimeout
	 */
	static getSecretWithRetry( name: string, namespace: string, retries: number = 10, retryTimeout: number = 500 ):Promise<{
		response: http.IncomingMessage;
		body: V1Secret;
	} | null> {
		return new Promise(async ( resolve, reject ) => {
			let i = 0;

			while ( i++ < retries ) {
				const secret	= SecretsHelper.getSecret( name, namespace );
				if ( secret )
					return resolve( secret );

				await new Promise(resolve => setTimeout(resolve, retryTimeout));
			}

			reject( "Retries exhausted" );
		});
	}
}