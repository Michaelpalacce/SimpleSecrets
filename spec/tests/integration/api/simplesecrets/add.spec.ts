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
		expect( body.version ).toBe( 1 );
		expect( body.type ).toBe( "Opaque" );
		expect( body.name ).toBe( name );
		expect( body.namespace ).toBe( namespace );
		expect( body.inUse ).toBeFalse();
		expect( typeof body.data ).toBe( "string" );
	});
});