import "jasmine";
import SecretsManager	from "../../../../../api/main/operator/SecretsManager";
import { apiClient }	from "../../../../../api/main/k8s/clients";
import { V1Secret }		from "@kubernetes/client-node";
import ObjectMocks		from "../../../mocks/ObjectMocks";

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

	it("createNewSecret creates a new secret", async () => {
		const name				= "test";
		const namespace			= "test";
		const secretMocks		= ObjectMocks.getSecretMocks();

		const secret: V1Secret	= secretMocks.getV1Secret( name, namespace );

		spyOn( apiClient, "createNamespacedSecret" ).withArgs( namespace, secret ).and.returnValue( Promise.resolve( { response: null, body: secret } ) );
		const result	= await SecretsManager.createNewSecret( namespace, secret )
		expect( result ).not.toBeNull();
	});

	it("createNewSecret returns an error if error", async () => {
		const name				= "test";
		const namespace			= "test";
		const secretMocks		= ObjectMocks.getSecretMocks();

		const secret: V1Secret	= secretMocks.getV1Secret( name, namespace );

		spyOn( apiClient, "createNamespacedSecret" ).withArgs( namespace, secret ).and.returnValue( Promise.reject( { response: null, body: {
				message: "some error"
			} } )
		);
		const result	= await SecretsManager.createNewSecret( namespace, secret ).catch( msg => msg );

		expect( result ).not.toBeNull();
		expect( result ).toBe( "some error" );
	});

	it("deleteNamespacedSecret when secret exists", async () => {
		const name				= "test";
		const namespace			= "test";

		spyOn( apiClient, "deleteNamespacedSecret" ).withArgs( name, namespace ).and.returnValue( Promise.resolve( { response: null, body: {
				status: "Success"
			} } )
		);
		const result	= await SecretsManager.deleteSecret( name, namespace ).catch( msg => msg );

		expect( result ).not.toBeNull();
		expect( result.body.status ).toBe( "Success" );
	});

	it("deleteNamespacedSecret when secret does not exist", async () => {
		const name		= "test";
		const namespace	= "test";

		spyOn( apiClient, "deleteNamespacedSecret" ).withArgs( name, namespace ).and.returnValue( Promise.reject( { response: null, body: {
				message: `secrets "${name}" not found`
			} } )
		);
		const result	= await SecretsManager.deleteSecret( name, namespace ).catch( msg => msg );

		expect( result ).not.toBeNull();
		expect( result ).toBe( `secrets "${name}" not found` );
	});
});