import "jasmine";
import SecretsHelper			from "../../helpers/SecretsHelper";
import { sendServerRequest }	from "../../helpers/utils";
import SimpleSecretsHelper		from "../../helpers/SimpleSecretsHelper";
import { decrypt }				from "../../../../../api/main/utils/encryption/encrypt";

describe( "Delete Secrets", () => {
	it("should delete a specific secret", async function () {
		const name		= "test";
		const namespace	= "test";
		const data		= {
			"user": "testUser123",
			"password": "testPass123"
		};

		await sendServerRequest( "/api/simplesecrets", "POST", {
			namespace,
			name,
			"type": "Opaque",
			data
		});
		await sendServerRequest( "/api/simplesecrets", "POST", {
			namespace: "default",
			name,
			"type": "Opaque",
			data
		});

		let getAllResponse	= await sendServerRequest( "/api/simplesecrets", "GET" );

		let body	= JSON.parse( getAllResponse.body.toString() );
		expect( getAllResponse.statusCode ).toEqual( 200 );
		expect( Array.isArray( body ) ).toBeTrue();
		expect( body.length ).toBe( 2 );

		await sendServerRequest( "/api/simplesecrets/test/test", "DELETE" );

		getAllResponse	= await sendServerRequest( "/api/simplesecrets", "GET" );

		body	= JSON.parse( getAllResponse.body.toString() );
		expect( getAllResponse.statusCode ).toEqual( 200 );
		expect( Array.isArray( body ) ).toBeTrue();
		expect( body.length ).toBe( 1 );
		expect( body[0].name ).toBe( name );
		expect( body[0].namespace ).toBe( "default" );
	});

	it("should delete a specific secret when not exists", async function () {
		const response	= await sendServerRequest( "/api/simplesecrets/test/test", "DELETE" );

		expect( response.statusCode ).toEqual( 200 );
	});
});