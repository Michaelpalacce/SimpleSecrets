import { Secret }	from "../../../../api/main/database/models/Secret";
import Migration	from "../../../../api/main/database/models/Migration";

export default class DatabaseHelpers {
	/**
	 * @brief	Clears the database of all the possible objects.
	 */
	static async clearDb() {
		for ( const secret of await Secret.findAll() )
			await secret.destroy()

		for ( const migration of await Migration.findAll() )
			await migration.destroy()
	}
}