import "jasmine";
import generateEncKey from "../../../../../../api/main/utils/encryption/encryption_key";

describe('encryptionKey', function () {
	it('should not generate a new encryption key if already generated', async function () {
		expect( await generateEncKey() ).toBe( await generateEncKey() );
	});
});