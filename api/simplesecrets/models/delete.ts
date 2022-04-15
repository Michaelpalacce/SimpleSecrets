import { Secret }	from "../../main/database/models/Secret";

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