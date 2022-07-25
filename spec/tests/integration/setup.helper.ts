import server			from "../../../api/main/server/server";
import DatabaseHelpers	from "./helpers/DatabaseHelpers";
import { apiClient }	from "./helpers/clients";

// @ts-ignore
beforeAll(async () => {
	await server();
	await DatabaseHelpers.clearDb();
	await apiClient.createNamespace( { metadata:{ name: "test" } } ).catch( e => {
		// Don't throw if already exists
		if ( e.statusCode !== 409 )
			throw e;
	});
});

// @ts-ignore
beforeEach( async () => {
	await DatabaseHelpers.clearDb();
})