import {KubernetesObject} from "@kubernetes/client-node";

/**
 * @brief	Simple secrets spec
 *
 * @details	Only version is accepted. Version is also optional
 */
export interface SimpleSecretsSpec {
	version?: number;
}

/**
 * @brief	Not in use
 */
export interface SimpleSecretsStatus {
}

/**
 * @brief	Simple secrets object
 */
export default interface SimpleSecrets extends KubernetesObject {
	spec: SimpleSecretsSpec;
	status: SimpleSecretsStatus;
}