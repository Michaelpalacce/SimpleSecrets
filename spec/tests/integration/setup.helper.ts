import server			from "../../../api/main/server/server";
import DatabaseHelpers	from "./helpers/DatabaseHelpers";

beforeAll(async () => {
	await server();
	await DatabaseHelpers.clearDb();
});

beforeEach( async () => {
	await DatabaseHelpers.clearDb();
})