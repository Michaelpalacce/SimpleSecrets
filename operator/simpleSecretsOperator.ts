import Operator, {ResourceEventType, ResourceEvent, OperatorLogger} from '@dot-i/k8s-operator';
import { KubernetesObject }											from '@kubernetes/client-node';
import logger from "../utils/logger";

export interface SimpleSecrets extends KubernetesObject {
	spec: SimpleSecretsSpec;
	status: SimpleSecretsStatus;
}

export interface SimpleSecretsSpec {
	foo: string;
	bar?: number;
}

export interface SimpleSecretsStatus {
	observedGeneration?: number;
}

export default class SimpleSecretsOperator extends Operator {
	protected async init() {
		// NOTE: we pass the plural name of the resource
		await this.watchResource('simplesecrets.local', 'v1', 'simplesecrets', async ( e ) => {
			try {
				// if (e.type === ResourceEventType.Added || e.type === ResourceEventType.Modified) {
				// 	logger.log( e.type )
				// 	if ( ! await this.handleResourceFinalizer( e, 'simplesecrets.simplesecrets.local', ( event ) => this.resourceDeleted( event ) ) ) {
				// 		await this.resourceModified(e);
				// 	}
				// }
				switch ( e.type ) {
					case ResourceEventType.Added:
						await this.resourceAdded( e );
						break;

					case ResourceEventType.Deleted:
						logger.log( `Resource Deleted` );
						logger.log( JSON.stringify( e.object, null ) );

						await this.handleResourceFinalizer( e, 'simplesecrets.simplesecrets.local', ( event ) => this.resourceDeleted( event ) );
						break;

					case ResourceEventType.Modified:
						await this.resourceModified( e );
						break;
				}

			} catch (err) {
				logger.error( err );
			}
		});
	}

	private async resourceAdded(e: ResourceEvent) {
		const object = e.object as SimpleSecrets;
		const metadata = object.metadata;

		logger.log( `Resource Added` );
		logger.log( JSON.stringify( e.object, null ) );

	}

	private async resourceModified(e: ResourceEvent) {
		const object = e.object as SimpleSecrets;
		const metadata = object.metadata;

		logger.log( `Resource Modified` );
		logger.log( JSON.stringify( e.object, null ) );
	}

	private async resourceDeleted(e: ResourceEvent) {
		const object = e.object as SimpleSecrets;
		const metadata = object.metadata;

		logger.log( `Resource Deleted` );
		logger.log( JSON.stringify( e.object, null ) );
	}
}