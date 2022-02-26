import "jasmine";
import SecretsManager			from "../../../../../api/main/operator/SecretsManager";
import { apiClient }			from "../../../../../api/main/k8s/clients";
import { V1Secret, HttpError }	from "@kubernetes/client-node";
import ObjectMocks				from "../../../helpers/ObjectMocks";
import http from "http";


describe("SecretsManager", () => {
	it("getSecret should return an existing secret", async () => {
		const name						= "test";
		const namespace					= "test";
		const secretObject: V1Secret	= ObjectMocks.getSecretMocks().getV1Secret( name, namespace );
		const body						= {
			response:	null,
			body:		secretObject
		};
		spyOn( apiClient, "readNamespacedSecret" ).withArgs( name, namespace ).and.returnValue( Promise.resolve( body ) );
		const secret	= await SecretsManager.getSecret( name, namespace );
		expect( secret ).not.toBeNull();
		expect( secret.body ).not.toBeNull();
		expect( secret.body ).toBe( secretObject );
	});

	it("getSecret should returns null if not found", async () => {
		const name						= "test";
		const namespace					= "notfound";
		const secretMocks				= ObjectMocks.getSecretMocks();
		const secretObject: V1Secret	= secretMocks.getV1Secret( name, namespace );
		const error						= secretMocks.getV1SecretErrorNotFoundBody( name );
		const body						= {
			response:	null,
			body:		error,
			statusCode:	404,
			name: "",
			message: ""
		};

		spyOn( apiClient, "readNamespacedSecret" ).withArgs( name, namespace ).and.returnValue( Promise.reject( body ) );
		const secret	= await SecretsManager.getSecret( name, namespace );
		expect( secret ).toBeNull();
	});
});