import "jasmine";
import {decrypt, encrypt} from "../../../../../../api/main/utils/encryption/encrypt";

describe('encrypt', function () {
	it('should encrypt with fingerprint', function () {
		const encryptedData	= encrypt( 'test' );

		expect( decrypt( encryptedData ) ).toBe( "test" );
	});

	it('should encrypt without fingerprint', function () {
		const encryptedData	= encrypt( 'test', false );

		expect( decrypt( encryptedData, false ) ).toBe( "test" );
	});
});
