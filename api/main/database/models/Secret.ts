import { Model } from "sequelize";

export class Secret extends Model {
	data: string;
	type: string;
	name: string;
	namespace: string;
	version: string;
	inUse?: boolean;
}