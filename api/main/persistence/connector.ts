import { Sequelize, Model, DataTypes }	from 'sequelize';
import { parse }						from 'path';

const PROJECT_ROOT	= parse( require.main.filename ).dir;

let sequelize;
const connectionString	= process.env.DB_CONNECTION_STRING;

if ( ! connectionString )
	sequelize	= new Sequelize({
		dialect: 'sqlite',
		storage: process.env.DB_PATH || `${PROJECT_ROOT}/db.sqlite`
	});
else
	sequelize	= new Sequelize( connectionString );

export default class Secret extends Model {
	data: string;
	type: string;
	name: string;
	namespace: string;
	version: string;
}

export async function initDb() {
	Secret.init({
		data: DataTypes.TEXT,
		type: DataTypes.STRING,
		version: DataTypes.STRING,
		name: DataTypes.STRING,
		namespace: DataTypes.STRING,
	}, { sequelize, modelName: 'Secret' });

	await sequelize.sync();
	try {
		await sequelize.authenticate();
		console.log('Connection has been established successfully.');
	} catch (error) {
		console.error('Unable to connect to the database:', error);
	}
}