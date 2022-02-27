import {HttpError, V1Secret} from "@kubernetes/client-node";

export default class SecretMocks {
	public getV1Secret(
		name: string,
		namespace: string,
		type?: string,
		data?: {
			[key: string]: string;
		},
	): V1Secret {
		return {
			apiVersion: "v1",
			data: data || {},
			kind: "Secret",
			type: type || "Opaque",
			metadata: {
				name,
				namespace
			},
			stringData: undefined
		}
	}

	public getV1SecretErrorNotFoundBody( name: string = "test" ) {
		return {
			kind: 'Status',
			apiVersion: 'v1',
			metadata: {},
			status: 'Failure',
			message: `secrets "${name}" not found`,
			reason: 'NotFound',
			details: { name, kind: 'secrets' },
			code: 404
		}
	}
}