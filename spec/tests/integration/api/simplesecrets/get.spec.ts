import "jasmine";
import SecretsHelper			from "../../helpers/SecretsHelper";
import { sendServerRequest }	from "../../helpers/utils";
import SimpleSecretsHelper from "../../helpers/SimpleSecretsHelper";
import {decrypt, encrypt} from "../../../../../api/main/utils/encryption/encrypt";

describe( "Get Secrets", () => {
	it("should getAll secrets", async function () {
		const response	= await sendServerRequest( "/api/simplesecrets", "GET" );

		const body	= JSON.parse( response.body.toString() );
		expect( response.statusCode ).toEqual( 200 );
		expect( body ).toEqual( [] );
	});
	it("should getAll in namespace", async function () {
		const response	= await sendServerRequest( "/api/simplesecrets/test", "GET" );

		const body	= JSON.parse( response.body.toString() );
		expect( response.statusCode ).toEqual( 200 );
		expect( body ).toEqual( [] );
	});

	it("should getAll secrets with Secret", async function () {
		const name		= "test";
		const namespace	= "test";
		const data		= {
			"user": "testUser123",
			"password": "testPass123"
		};

		// Remove If exists
		await SecretsHelper.ensureSecretIsMissing( name, namespace );
		await SimpleSecretsHelper.ensureSimpleSecretIsMissing( name, namespace );

		await sendServerRequest( "/api/simplesecrets", "POST", {
			namespace,
			name,
			"type": "Opaque",
			data
		});

		const response	= await sendServerRequest( "/api/simplesecrets", "GET" );

		const body	= JSON.parse( response.body.toString() );
		expect( response.statusCode ).toEqual( 200 );
		expect( Array.isArray( body ) ).toBeTrue();
		expect( body.length ).toBe( 1 );
		expect( body[0].name ).toBe( name );
		expect( body[0].namespace ).toBe( namespace );
		expect( decrypt( body[0].data ) ).toEqual( JSON.stringify( { 1: data } ) );
	});

	it("should getAll secrets in namespace", async function () {
		const name		= "test";
		const namespace	= "test";
		const data		= {
			"user": "testUser123",
			"password": "testPass123"
		};

		// Remove If exists
		await SecretsHelper.ensureSecretIsMissing( name, namespace );
		await SimpleSecretsHelper.ensureSimpleSecretIsMissing( name, namespace );

		await sendServerRequest( "/api/simplesecrets", "POST", {
			namespace,
			name,
			"type": "Opaque",
			data
		});

		const response	= await sendServerRequest( "/api/simplesecrets/test", "GET" );

		const body	= JSON.parse( response.body.toString() );
		expect( response.statusCode ).toEqual( 200 );
		expect( Array.isArray( body ) ).toBeTrue();
		expect( body.length ).toBe( 1 );
		expect( body[0].name ).toBe( name );
		expect( body[0].namespace ).toBe( namespace );
		expect( decrypt( body[0].data ) ).toEqual( JSON.stringify( { 1: data } ) );
	});

	it("should getAll secrets in namespace", async function () {
		const name		= "test";
		const namespace	= "test";
		const data		= {
			"user": "testUser123",
			"password": "testPass123"
		};

		// Remove If exists
		await SecretsHelper.ensureSecretIsMissing( name, namespace );
		await SimpleSecretsHelper.ensureSimpleSecretIsMissing( name, namespace );

		await sendServerRequest( "/api/simplesecrets", "POST", {
			namespace,
			name,
			"type": "Opaque",
			data
		});

		const response	= await sendServerRequest( "/api/simplesecrets/test", "GET" );

		const body	= JSON.parse( response.body.toString() );
		expect( response.statusCode ).toEqual( 200 );
		expect( Array.isArray( body ) ).toBeTrue();
		expect( body.length ).toBe( 1 );
		expect( body[0].name ).toBe( name );
		expect( body[0].namespace ).toBe( namespace );
		expect( decrypt( body[0].data ) ).toEqual( JSON.stringify( { 1: data } ) );
	});

	it("should get specific secret", async function () {
		const name		= "test";
		const namespace	= "test";
		const data		= {
			"user": "testUser123",
			"password": "testPass123"
		};

		// Remove If exists
		await SecretsHelper.ensureSecretIsMissing( name, namespace );
		await SimpleSecretsHelper.ensureSimpleSecretIsMissing( name, namespace );

		await sendServerRequest( "/api/simplesecrets", "POST", {
			namespace,
			name,
			"type": "Opaque",
			data
		});

		const response	= await sendServerRequest( "/api/simplesecrets/test/test", "GET" );

		const body	= JSON.parse( response.body.toString() );
		expect( response.statusCode ).toEqual( 200 );
		expect( Array.isArray( body ) ).toBeFalse();
		expect( body.name ).toBe( name );
		expect( body.namespace ).toBe( namespace );
		expect( body.data ).toEqual( { 1: data } );
	});


	it("should get specific secret returns all versions", async function () {
		const name		= "test";
		const namespace	= "test";
		const data		= {
			"user": "testUser123",
			"password": "testPass123"
		};
		const dataTwo		= {
			"user": "testUser",
			"password": "testPass"
		};

		// Remove If exists
		await SecretsHelper.ensureSecretIsMissing( name, namespace );
		await SimpleSecretsHelper.ensureSimpleSecretIsMissing( name, namespace );

		await sendServerRequest( "/api/simplesecrets", "POST", {
			namespace,
			name,
			"type": "Opaque",
			data
		});

		await sendServerRequest( "/api/simplesecrets", "POST", {
			namespace,
			name,
			"type": "Opaque",
			data: dataTwo
		});

		const response	= await sendServerRequest( "/api/simplesecrets/test/test", "GET" );

		const body	= JSON.parse( response.body.toString() );
		expect( response.statusCode ).toEqual( 200 );
		expect( Array.isArray( body ) ).toBeFalse();
		expect( body.name ).toBe( name );
		expect( body.namespace ).toBe( namespace );
		expect( body.version ).toBe( "2" );
		expect( body.data ).toEqual( { 1: data, 2: dataTwo } );
	});

	it("should getAll secrets in namespace if not exist", async function () {
		const response	= await sendServerRequest( "/api/simplesecrets/wrong", "GET" );

		const body	= JSON.parse( response.body.toString() );
		expect( response.statusCode ).toEqual( 200 );
		expect( Array.isArray( body ) ).toBeTrue();
		expect( body.length ).toBe( 0 );
	});
});