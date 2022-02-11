import Operator, { ResourceEventType, ResourceEvent }	from '@dot-i/k8s-operator';
import { V1Secret }										from '@kubernetes/client-node';
import logger, { OperatorLogger }						from "../utils/logger";
import { createHash }									from "crypto"
import { Secret }										from "../persistence/connector";
import { decrypt }										from "../utils/encryption/encrypt";
import { SimpleSecrets }								from "./SimpleSecretsManager";
import SecretsManager									from "./SecretsManager";

/**
 * @brief	Holds logic related to operating on SimpleSecret CRDs
 */
export default class SimpleSecretsOperator extends Operator {
	static GROUP: string		= 'simplesecrets.local';
	static VERSION: string		= 'v1';
	static PLURAL: string		= 'simplesecrets';

	private ANNOTATION: string	= 'simplesecrets.hash';
	private encryptionKey: string;

	constructor( logger: OperatorLogger ) {
		super( logger );

		this.encryptionKey	= process.env.ENCRYPTION_KEY;
	}

	protected async init() : Promise<void> {
		// NOTE: we pass the plural name of the resource
		await this.watchResource( SimpleSecretsOperator.GROUP, SimpleSecretsOperator.VERSION, SimpleSecretsOperator.PLURAL, async ( e ) => {
			try {
				switch ( e.type ) {
					case ResourceEventType.Modified:
					case ResourceEventType.Added:
						await this.resourceAdded( e );
						break;

					case ResourceEventType.Deleted:
						await this.resourceDeleted( e )
						break;
				}
			} catch (err) {
				logger.error( err );
			}
		});
	}

	/**
	 * @brief	Called when a resource is added/modified
	 *
	 * @param	{ResourceEvent} e
	 *
	 * @private
	 */
	private async resourceAdded( e: ResourceEvent ): Promise<void> {
		const object	= e.object as SimpleSecrets;
		const metadata	= object.metadata;
		const hash		= this.calculateHash( object );
		const result	= await SecretsManager.getSecret( metadata.name, metadata.namespace );

		// Not found, create it
		if ( ! result )
			return await this.createNewSecret( object, hash );

		logger.warn( `Secret ${metadata.name} in ${metadata.namespace} already exists` );

		const secret	= result.body;

		// New version of Secret, delete it and recreate
		if ( ! this.compareHashForSecret( secret, hash ) )
			return await this.recreateSecret( object, hash );

		logger.warn( `Secret ${metadata.name} in ${metadata.namespace} hash values match` );
	}

	/**
	 * @brief	Deletes the Associated Secret
	 *
	 * @param	{ResourceEvent} e
	 *
	 * @private
	 */
	private async resourceDeleted( e: ResourceEvent ): Promise<void> {
		const metadata	= e.meta;
		await this.deleteSecret( metadata.name, metadata.namespace );
	}

	/**
	 * Compares that the given hash matches the one set in the string
	 *
	 * @param	{String} secret
	 * @param	{String} hash
	 * @private
	 *
	 * @return	{Boolean}
	 */
	private compareHashForSecret( secret: V1Secret, hash: string ) : boolean {
		return secret.metadata.annotations[this.ANNOTATION] === hash;
	}

	/**
	 * @brief	Deletes the old secret and creates a new one
	 *
	 * @param	{SimpleSecrets} object
	 * @param	{String} hash
	 *
	 * @private
	 */
	private async recreateSecret( object: SimpleSecrets, hash: string = '' ): Promise<void> {
		logger.info( "Hash mismatch, recreating secret!" );
		const metadata	= object.metadata;

		await this.deleteSecret( metadata.name, metadata.namespace );
		await this.createNewSecret( object, hash );
	}

	/**
	 * @brief	Creates a new secret in k8s
	 *
	 * @details	If hash is not provided, it will be calculated
	 *
	 * @param	{SimpleSecrets} object
	 * @param	{String} hash
	 *
	 * @private
	 */
	private async createNewSecret( object: SimpleSecrets, hash: string = '' ): Promise<void> {
		const metadata	= object.metadata;
		const namespace	= metadata.namespace;
		const name		= metadata.name;
		const dbSecret	= await Secret.findOne({
			where: {
				namespace, name
			}
		});

		if ( ! dbSecret ) {
			logger.error( `Could not find Simples Secret ${name} in ${namespace} in the DATABASE` );
			return;
		}

		const dbData	= JSON.parse( decrypt( dbSecret.data ) );
		const version	= typeof object.spec?.version !== 'undefined' ? object.spec.version : dbSecret.version;

		logger.info( `Creating new secret ${name} in ${namespace}` );

		if ( ! dbData[version] ) {
			logger.error( `Secret ${name} in ${namespace} does not have version ${version}`)
			return;
		}

		const secret: V1Secret	= {
			apiVersion: "v1",
			kind: 'Secret',
			metadata: {
				name: name,
				namespace: namespace,
				annotations: {
					[this.ANNOTATION]: hash === '' ? this.calculateHash( object ) : hash
				}
			},
			type: dbSecret.type,
			stringData: dbData[version]
		};

		await SecretsManager.createNewSecret( namespace, secret ).catch( e => {
			logger.error( `Could not create secret, reason: ${JSON.stringify( e.body )}` );
		});
	}

	/**
	 * @brief	Deletes the secret from k8s
	 *
	 * @param	{String} name
	 * @param	{String} namespace
	 *
	 * @private
	 */
	private async deleteSecret( name: string, namespace: string ): Promise<void> {
		logger.info( `Deleting Secret ${name} in ${namespace}` );
		await SecretsManager.deleteSecret( name, namespace ).catch( e => {
			logger.error( `Could not delete secret, reason: ${JSON.stringify( e.body )}` );
		});
	}

	/**
	 * @brief	Creates a SHA256 hex hash from the SimpleSecret
	 *
	 * @param	{SimpleSecrets} object
	 *
	 * @private
	 *
	 * @return	{String}
	 */
	private calculateHash( object: SimpleSecrets ): string {
		return createHash( 'sha256' ).update( JSON.stringify( object ) ).digest( 'hex' );
	}
}