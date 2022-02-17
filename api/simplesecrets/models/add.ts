import { Secret}			from "../../main/persistence/connector";
import { decrypt, encrypt }	from "../../main/utils/encryption/encrypt";
import SimpleSecretsManager	from "../../main/operator/SimpleSecretsManager";

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

	namespace	= typeof namespace !== 'undefined' ? namespace : 'default';
	type		= typeof type !== 'undefined' ? type : '';
	name		= typeof name !== 'undefined' ? name : '';
	data		= typeof data !== 'undefined' ? data : '';

	namespace	= namespace.trim();
	type		= type.trim();
	name		= name.trim();
	data		= data.trim();

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
			name: name.toLowerCase()
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

	if ( simpleSecret !== null )
		if ( ! simpleSecret?.spec?.version )
			await SimpleSecretsManager.patchSimpleSecretVersionAnnotation( simpleSecret, `${newVersion}` ).catch( console.log );

	event.send( search )
}