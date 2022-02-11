import { Secret }	from "../../main/persistence/connector";

/**
 * @brief	Deletes the entire Database. Use for testing purposes only
 *
 * @param	{EventRequest} event
 */
export async function deleteAll( event ) {
	const secrets	= await Secret.findAll();

	secrets.every( async ( secret ) => {
		await secret.destroy()
	})

	event.send();
}

/**
 * @brief	Deletes a single SimpleSecret from the database
 *
 * @details	If the SimpleSecret does not exist, nothing will be done
 *
 * @param	{EventRequest} event
 */
export async function deleteOne( event ) {
	const secret	= await Secret.findOne({
		where: {
			name: event.params.name,
			namespace: event.params.namespace,
		}
	});

	if ( secret )
		await secret.destroy();

	event.send();
}