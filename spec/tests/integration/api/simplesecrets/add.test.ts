import "jasmine";
import SecretsHelper			from "../../helpers/SecretsHelper";
import { sendServerRequest }	from "../../helpers/utils";
import SimpleSecretsHelper		from "../../helpers/SimpleSecretsHelper";

describe( "Adding New Secrets", () => {
	it("should add new secret when secret does not exist", async function () {
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

	it("should add new secret when secret does not exist and simpleSecret with wrong version is created does not create Secret", async function () {
		// Variables
		const name		= "test";
		const namespace	= "test";

		// Remove If exists
		await SecretsHelper.ensureSecretIsMissing( name, namespace );
		await SimpleSecretsHelper.ensureSimpleSecretIsMissing( name, namespace );

		const response	= await sendServerRequest( "/api/simplesecrets", "POST", {
			namespace,
			name,
			"type": "Opaque",
			"data": {
				"user": "testUser",
				"password": "testPass"
			}
		});
		await SimpleSecretsHelper.createSimpleSecret( name, namespace, 5 );
		const secret	= await SecretsHelper.getSecretAfterTime( name, namespace );
		expect( secret ).toBeNull();

		const body	= JSON.parse( response.body.toString() );
		expect( response.statusCode ).toEqual( 200 );
		expect( body.version ).toBe( "1" );
		expect( body.type ).toBe( "Opaque" );
		expect( body.name ).toBe( name );
		expect( body.namespace ).toBe( namespace );
		expect( body.inUse ).toBeFalse();
		expect( typeof body.data ).toBe( "string" );
	});

	it("should add new secret with defaults", async function () {
		const response	= await sendServerRequest( "/api/simplesecrets", "POST", {
			"data": {
				"user": "testUser",
				"password": "testPass"
			}
		});

		const body	= JSON.parse( response.body.toString() );
		expect( response.statusCode ).toEqual( 200 );
		expect( body.version ).toBe( "1" );
		expect( body.type ).toBe( "Opaque" );
		expect( body.name ).toBe( "default" );
		expect( body.namespace ).toBe( "default" );
		expect( body.inUse ).toBeFalse();
		expect( typeof body.data ).toBe( "string" );
	});

	it("should add new secret version if secret exists", async function () {
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

	it("should add new secret version if secret exists", async function () {
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

	it("should add new secret version if secret exists and change existing secret", async function () {
		// Variables
		const name		= "test";
		const namespace	= "test";

		// Remove If exists
		await SecretsHelper.ensureSecretIsMissing( name, namespace );
		await SimpleSecretsHelper.ensureSimpleSecretIsMissing( name, namespace );

		const firstVersion	= await sendServerRequest( "/api/simplesecrets", "POST", {
			"namespace": "test",
			"name": "test",
			"type": "Opaque",
			"data": {
				"user": "testUser",
				"password": "testPass"
			}
		});

		await SimpleSecretsHelper.createSimpleSecret( name, namespace );
		const initialSecret	= await SecretsHelper.getSecretAfterTime( name, namespace, 5000 );

		const secondVersion	= await sendServerRequest( "/api/simplesecrets", "POST", {
			"namespace": "test",
			"name": "test",
			"type": "Opaque",
			"data": {
				"user": "testUser123",
				"password": "testPass123"
			}
		});

		const afterChangeSecret	= await SecretsHelper.getSecretAfterTime( name, namespace, 5000 );

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
		expect( secondBody.inUse ).toBeTrue();
		expect( firstBody.data ).not.toBe( secondBody.data );
		expect( initialSecret.body.data ).not.toEqual( afterChangeSecret.body.data );

		await SecretsHelper.ensureSecretIsMissing( name, namespace );
		await new Promise( resolve => setTimeout( resolve, 100 ) );
	}, 20000);

	it("should add new secret version if secret exists and change existing secret if version is set to 0", async function () {
		// Variables
		const name		= "test";
		const namespace	= "test";

		// Remove If exists
		await SecretsHelper.ensureSecretIsMissing( name, namespace );
		await SimpleSecretsHelper.ensureSimpleSecretIsMissing( name, namespace );

		const firstVersion	= await sendServerRequest( "/api/simplesecrets", "POST", {
			"namespace": "test",
			"name": "test",
			"type": "Opaque",
			"data": {
				"user": "testUser",
				"password": "testPass"
			}
		});

		await SimpleSecretsHelper.createSimpleSecret( name, namespace, 0 );
		const initialSecret	= await SecretsHelper.getSecretAfterTime( name, namespace, 5000 );

		const secondVersion	= await sendServerRequest( "/api/simplesecrets", "POST", {
			"namespace": "test",
			"name": "test",
			"type": "Opaque",
			"data": {
				"user": "testUser123",
				"password": "testPass123"
			}
		});

		const afterChangeSecret	= await SecretsHelper.getSecretAfterTime( name, namespace, 5000 );

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
		expect( secondBody.inUse ).toBeTrue();
		expect( firstBody.data ).not.toBe( secondBody.data );
		expect( initialSecret.body.data ).not.toEqual( afterChangeSecret.body.data );

		await SecretsHelper.ensureSecretIsMissing( name, namespace );
		await new Promise( resolve => setTimeout( resolve, 100 ) );
	}, 20000);

	it("should add new secret version if secret exists and not change existing secret if version is set", async function () {
		// Variables
		const name		= "test";
		const namespace	= "test";

		// Remove If exists
		await SecretsHelper.ensureSecretIsMissing( name, namespace );
		await SimpleSecretsHelper.ensureSimpleSecretIsMissing( name, namespace );

		const firstVersion	= await sendServerRequest( "/api/simplesecrets", "POST", {
			"namespace": "test",
			"name": "test",
			"type": "Opaque",
			"data": {
				"user": "testUser",
				"password": "testPass"
			}
		});

		await SimpleSecretsHelper.createSimpleSecret( name, namespace, 1 );
		const initialSecret	= await SecretsHelper.getSecretAfterTime( name, namespace );

		const secondVersion	= await sendServerRequest( "/api/simplesecrets", "POST", {
			"namespace": "test",
			"name": "test",
			"type": "Opaque",
			"data": {
				"user": "testUser123",
				"password": "testPass123"
			}
		});

		const afterChangeSecret	= await SecretsHelper.getSecretAfterTime( name, namespace );

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
		expect( secondBody.inUse ).toBeTrue();
		expect( firstBody.data ).not.toBe( secondBody.data );
		expect( initialSecret.body.data ).toEqual( afterChangeSecret.body.data );

		await SecretsHelper.ensureSecretIsMissing( name, namespace );
		await new Promise( resolve => setTimeout( resolve, 100 ) );
	}, 10000);
});