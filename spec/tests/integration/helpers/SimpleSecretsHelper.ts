import SimpleSecrets				from "../../../../api/main/interfaces/simpleSecret";
import { customObjectsApi }			from "./clients";
import { GROUP, PLURAL, VERSION }	from "../../../../api/main/operator/operatorConstants";

export default class SimpleSecretsHelper {
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

	/**
	 * @brief	Ensures a simple secret does not exist
	 *
	 * @param	{String} name
	 * @param	{String} namespace
	 */
	static async ensureSimpleSecretIsMissing(name: string, namespace: string ): Promise<void> {
		await customObjectsApi.deleteNamespacedCustomObject( GROUP, VERSION, namespace, PLURAL, name ).catch( e => {
			if ( e.statusCode !== 404 )
				throw e;
		});
	}

	/**
	 * @brief	Creates a new Simple Secret
	 *
	 * @param	{String} name
	 * @param	{String} namespace
	 * @param	{Number} version
	 */
	static async createSimpleSecret( name: string, namespace: string, version?: number ): Promise<void> {
		const simpleSecret	= {
			"apiVersion": "simplesecrets.local/v1",
			"kind": "SimpleSecret",
			"metadata": {
				name,
				namespace,
				annotations: {
					"test":"value" // Adding this cause otherwise there will be a patching error :)
				}
			}
		};

		if ( version )
			simpleSecret["spec"]	= { version };

		await customObjectsApi.createNamespacedCustomObject( GROUP, VERSION, namespace, PLURAL, simpleSecret );
	}
}