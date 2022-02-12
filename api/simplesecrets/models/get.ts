import { Secret }	from "../../main/persistence/connector";
import { decrypt }	from "../../main/utils/encryption/encrypt";

/**
 * @brief	Gets a single SimpleSecret from the Database
 *
 * @details	For now it decrypts the data ( for testing purposes ) but should be removed in the future
 *
 * @TODO	READ @details
 *
 * @param	{EventRequest} event
 */
export async function getOne( event ) {
	const secret	= await Secret.findOne({
		where: {
			name: event.params.name,
			namespace: event.params.namespace,
		}
	});

	if ( ! secret )
		return await event.send();

	secret.data	= JSON.parse( decrypt( secret.data ) );

	event.send( secret );
}

/**
 * @brief	Gets all the secrets in the database for a given namespace
 *
 * @param	{EventRequest} event
 */
export async function getAllInNamespace( event ) {
	event.send( await Secret.findAll({
		where: {
			namespace: event.params.namespace
		}
	}) );
}