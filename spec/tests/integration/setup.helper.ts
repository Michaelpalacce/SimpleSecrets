import server			from "../../../api/main/server/server";
import DatabaseHelpers	from "./helpers/DatabaseHelpers";
// import createEncKey		from "../../../api/main/utils/encryption/encryption_key";

beforeAll(async () => {
	// await createEncKey( 'testEncKey' );
	await server();
	await DatabaseHelpers.clearDb();
});

beforeEach( async () => {
	await DatabaseHelpers.clearDb();
})