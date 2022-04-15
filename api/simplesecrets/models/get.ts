import { Secret }		from "../../main/database/models/Secret";
import { decrypt }		from "../../main/utils/encryption/encrypt";

/**
 * @brief	Sanitizes the secrets array by removing specific properties
 *
 * @param	{Secret[]} secrets
 */
function removeDataFromSecrets( secrets: Secret[] ): Secret[] {
	return secrets.map<Secret>(( value: Secret ) => {
		value.data	= undefined;

		return value;
	});
}

/**
 * @brief	Gets a single SimpleSecret from the Database
 *
 * @param	{EventRequest} event
 */
export async function getOne( event ): Promise<void> {
	const name		= event.params.name;
	const namespace	= event.params.namespace;
	const secret	= await Secret.findOne({ where: { name, namespace } });

	if ( ! secret )
		return await event.next({
			message: `Secret ${name} not found in namespace: ( ${namespace} )`,
			code: "app.general.simplesecret.notFound",
			status: 404
		});

	secret.data	= JSON.parse( decrypt( secret.data ) );

	event.send( secret );
}

/**
 * @brief	Gets all the secrets in the database for a given namespace
 *
 * @param	{EventRequest} event
 */
export async function getAllInNamespace( event ): Promise<void> {
	let secrets	= await Secret.findAll<Secret>({
		where: {
			namespace: event.params.namespace
		}
	});

	event.send( removeDataFromSecrets( secrets ) );
}

/**
 * @brief	Gets all the secrets in the databases for all namespaces
 *
 * @param	{EventRequest} event
 */
export async function getAll( event ): Promise<void> {
	event.send( removeDataFromSecrets( await Secret.findAll() ) );
}
