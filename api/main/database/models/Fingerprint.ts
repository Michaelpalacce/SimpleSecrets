import { Model } from "sequelize";

export class Fingerprint extends Model {
	data: string;
	name: string; // Unique
}