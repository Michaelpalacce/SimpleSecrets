import { V1Secret } from "@kubernetes/client-node";
import SecretMocks from "./objects/SecretMocks";

export default class ObjectMocks {
	private static mocks	= {
		secretMocks: null
	}

	public static getSecretMocks(): SecretMocks {
		if ( ! this.mocks.secretMocks ) {
			this.mocks.secretMocks	= new SecretMocks();
		}

		return this.mocks.secretMocks;
	}
}
