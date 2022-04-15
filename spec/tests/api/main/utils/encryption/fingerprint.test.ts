import "jasmine";
import generateFingerprint from "../../../../../../api/main/utils/encryption/fingerprint";

describe('fingerPrint', function () {
	it('should not generate a new fingerprint if already generated', async function () {
		expect( await generateFingerprint() ).toBe( await generateFingerprint() );
	});
});