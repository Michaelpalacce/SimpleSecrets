import {customObjectsApi} from "../../../../api/main/k8s/clients";
import SimpleSecretsOperator from "../../../../api/main/operator/SimpleSecretsOperator";
import {SimpleSecrets} from "../../../../api/main/operator/SimpleSecretsManager";

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
		const simpleSecretResponse	= await customObjectsApi.getNamespacedCustomObject( SimpleSecretsOperator.GROUP, SimpleSecretsOperator.VERSION, namespace, SimpleSecretsOperator.PLURAL, name ).catch( e => e );
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
		await customObjectsApi.deleteNamespacedCustomObject( SimpleSecretsOperator.GROUP, SimpleSecretsOperator.VERSION, namespace, SimpleSecretsOperator.PLURAL, name ).catch( e => {
			if ( e.statusCode !== 404 )
				throw e;
		});
	}

	/**
	 * @brief	Creates a new Simple Secret
	 *
	 * @param	{String} name
	 * @param	{String} namespace
	 */
	static async createSimpleSecret( name: string, namespace: string ): Promise<void> {
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

		await customObjectsApi.createNamespacedCustomObject( SimpleSecretsOperator.GROUP, SimpleSecretsOperator.VERSION, namespace, SimpleSecretsOperator.PLURAL, simpleSecret );
	}
}