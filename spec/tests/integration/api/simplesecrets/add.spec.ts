import "jasmine";
import SecretsHelper			from "../../helpers/SecretsHelper";
import { sendServerRequest }	from "../../helpers/utils";
import DatabaseHelpers from "../../helpers/DatabaseHelpers";

describe( "Adding New Secrets", () => {
	it('should add new secret when secret does not exist', async function () {
		// Variables
		const name		= "test";
		const namespace	= "test";

		// Remove If exists
		await SecretsHelper.ensureSecretIsMissing( name, namespace );

		const response	= await sendServerRequest( "/api/simplesecrets", "POST", {
			"namespace": "test",
			"name": "test",
			"type": "Opaque",
			"data": {
				"user": "testUser",
				"password": "testPass"
			}
		});

		const body	= JSON.parse( response.body.toString() );
		expect( response.statusCode ).toEqual( 200 );
		expect( body.version ).toBe( "1" );
		expect( body.type ).toBe( "Opaque" );
		expect( body.name ).toBe( name );
		expect( body.namespace ).toBe( namespace );
		expect( body.inUse ).toBeFalse();
		expect( typeof body.data ).toBe( "string" );
	});

	it('should add new secret version if secret exists', async function () {
		// Variables
		const name		= "test";
		const namespace	= "test";

		// Remove If exists
		await SecretsHelper.ensureSecretIsMissing( name, namespace );

		const firstVersion	= await sendServerRequest( "/api/simplesecrets", "POST", {
			"namespace": "test",
			"name": "test",
			"type": "Opaque",
			"data": {
				"user": "testUser",
				"password": "testPass"
			}
		});

		const secondVersion	= await sendServerRequest( "/api/simplesecrets", "POST", {
			"namespace": "test",
			"name": "test",
			"type": "Opaque",
			"data": {
				"user": "testUser123",
				"password": "testPass123"
			}
		});

		const firstBody		= JSON.parse( firstVersion.body.toString() );
		const secondBody	= JSON.parse( secondVersion.body.toString() );
		expect( firstBody.version ).toBe( "1" );
		expect( secondBody.version ).toBe( "2" );
		expect( firstBody.type ).toBe( "Opaque" );
		expect( secondBody.type ).toBe( "Opaque" );
		expect( firstBody.name ).toBe( name );
		expect( secondBody.name ).toBe( name );
		expect( firstBody.namespace ).toBe( namespace );
		expect( secondBody.namespace ).toBe( namespace );
		expect( firstBody.inUse ).toBeFalse();
		expect( secondBody.inUse ).toBeFalse();
		expect( firstBody.data ).not.toBe( secondBody.data );
	});
});