import "jasmine";
import {getRandomString} from "../../../../../../api/main/utils/encryption/utils";

describe('getRandom', function () {
	it('should return a random hex', function () {
		expect( getRandomString() ).not.toBe( getRandomString() );
	});

	it('should return a specific length', function () {
		expect( getRandomString( 16 ).length ).toBe( 16 );
	});
});