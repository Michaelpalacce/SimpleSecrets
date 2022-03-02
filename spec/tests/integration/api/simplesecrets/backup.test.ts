import "jasmine";
import SecretsHelper			from "../../helpers/SecretsHelper";
import { sendServerRequest }	from "../../helpers/utils";
import SimpleSecretsHelper		from "../../helpers/SimpleSecretsHelper";
import { decrypt }				from "../../../../../api/main/utils/encryption/encrypt";
import {createHash} from "crypto";

describe( "Backup Secrets", () => {
	it("should backup All secrets with no data", async function () {
		const response	= await sendServerRequest( "/api/simplesecrets/backup", "GET" );
		const body		= JSON.parse( response.body.toString() );

		const secret	= await SecretsHelper.getSecret( "encryptionkey", "simplesecrets" );

		expect( response.statusCode ).toEqual( 200 );
		expect( body.data ).toEqual( [] );
		expect( body.encryptionKey ).toEqual( atob( secret.body.data.encryptionKey ) );
	});

	it("should backup All secrets with data", async function () {
		const data	= {
			"user": "testUser",
			"password": "testPass"
		};
		await sendServerRequest( "/api/simplesecrets", "POST", {
			"namespace": "test",
			"name": "test",
			"type": "Opaque",
			data
		});

		const response	= await sendServerRequest( "/api/simplesecrets/backup", "GET" );
		const body		= JSON.parse( response.body.toString() );

		const secret	= await SecretsHelper.getSecret( "encryptionkey", "simplesecrets" );

		expect( response.statusCode ).toEqual( 200 );
		expect( body.data.length ).toBe( 1 );
		expect( body.data[0].name ).toBe( "test" );
		expect( body.data[0].namespace ).toBe( "test" );
		expect( body.data[0].version ).toBe( "1" );
		expect( body.data[0].data ).not.toBe( JSON.stringify( data ) );
		expect( body.encryptionKey ).toEqual( atob( secret.body.data.encryptionKey ) );
	});
});

describe( "Restore Secrets", () => {
	it("should restore all secrets and encryption key", async function () {
		// Get old encryption key to check later
		const oldEncryptionKeySecret	= await SecretsHelper.getSecret( "encryptionkey", "simplesecrets" );
		const oldEncryptionKey			= atob( oldEncryptionKeySecret.body.data.encryptionKey )

		const data	= {
			"user": "testUser",
			"password": "testPass"
		};

		// Save data
		await sendServerRequest( "/api/simplesecrets", "POST", {
			"namespace": "test",
			"name": "test",
			"type": "Opaque",
			data
		});

		// Backup all
		const backupResponse	= await sendServerRequest( "/api/simplesecrets/backup", "GET" );

		// Populate with new data ( should be missing later )
		await sendServerRequest( "/api/simplesecrets", "POST", {
			"namespace": "test",
			"name": "test",
			"type": "Opaque",
			data
		});

		await sendServerRequest( "/api/simplesecrets", "POST", {
			"namespace": "default",
			"name": "test",
			"type": "Opaque",
			data
		});

		// Remove Secret key ( will be replaced when we do restore )
		await SecretsHelper.ensureSecretIsMissing( "encryptionkey", "simplesecrets" );

		// Generate a new encryption key in it's place
		const newEncryptionKey			= createHash( "md5" ).update( Date.now().toString() ).digest( "hex" );
		const newEncryptionKeySecret	= {
			apiVersion: "v1",
			kind: "Secret",
			metadata: {
				name: "encryptionkey",
				namespace: "simplesecrets",
			},
			type: "Opaque",
			stringData: {
				encryptionKey: newEncryptionKey
			}
		};
		await SecretsHelper.createNewSecret( "simplesecrets", newEncryptionKeySecret );

		// Restore
		await sendServerRequest( "/api/simplesecrets/restore", "POST", JSON.parse( backupResponse.body.toString() ) );

		const getAllResponse		= await sendServerRequest( "/api/simplesecrets/backup", "GET" );
		const secret				= await SecretsHelper.getSecretAfterTime( "encryptionkey", "simplesecrets", 1000 );

		const currentEncryptionKey	= atob( secret.body.data.encryptionKey );

		const body					= JSON.parse( getAllResponse.body.toString() );
		expect( body.data.length ).toBe( 1 );
		expect( body.data[0].name ).toBe( "test" );
		expect( body.data[0].namespace ).toBe( "test" );
		expect( body.data[0].version ).toBe( "1" );
		expect( body.encryptionKey ).toEqual( currentEncryptionKey );
		expect( currentEncryptionKey ).toEqual( oldEncryptionKey );
	});
});