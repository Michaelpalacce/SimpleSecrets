import { decrypt, encrypt }	from "../../main/utils/encryption/encrypt";
import SimpleSecretsManager	from "../../main/operator/SimpleSecretsManager";
import { Secret }			from "../../main/database/models/Secret";
import SecretsManager from "../../main/operator/SecretsManager";

/**
 * @brief	Adds a new secret to the database
 *
 * @details	This will check if the secret exists already and add a new version if so.
 * 			If it does not exist it is created and assigned version one.
 * 			If it does exist it will also patch the SimpleSecret with annotation that will trigger a recreate of the secret
 * 				in case the SimpleSecret is created without a version specified, so we can always keep the latest version.
 *
 * @param	{EventRequest} event
 */
export default async function add( event ) {
	const body							= event.body;
	let { namespace, type, name, data }	= body;

	name		= (typeof name === 'string' ? name.trim() : '').toLowerCase();
	namespace	= (typeof namespace === 'string' ? namespace.trim() : 'default').toLowerCase();
	type		= typeof type === 'string' ? type.trim() : 'Opaque';

	const search	= await Secret.findOne({
		where: {
			name, namespace
		}
	});

	if ( ! search ) {
		const encryptedData	= encrypt( JSON.stringify( { 1: data } ) );

		const secret	= await Secret.create({
			data: encryptedData,
			version: 1,
			type,
			namespace,
			name: name,
			inUse: await SecretsManager.getSecret( name, namespace ) !== null
		});

		event.send( secret );
		return;
	}

	const decryptedData			= JSON.parse( decrypt( search.data ) );
	const newVersion			= parseInt( search.version ) + 1;

	decryptedData[newVersion]	= data;

	search.data					= encrypt( JSON.stringify( decryptedData ) );
	search.version				= newVersion.toString();

	await search.save();

	const simpleSecret	= await SimpleSecretsManager.getSimpleSecret( namespace, name );

	console.log( simpleSecret );
	if ( simpleSecret !== null )
		if ( ! simpleSecret?.spec?.version )
			await SimpleSecretsManager.patchSimpleSecretVersionAnnotation( simpleSecret, `${newVersion}` ).catch( console.log );

	event.send( search )
}