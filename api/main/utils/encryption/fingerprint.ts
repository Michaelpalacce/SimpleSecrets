import { Fingerprint }		from "../../database/models/Fingerprint";
import { getRandomString }	from "./utils";
import logger				from "../logger";

export const FINGERPRINT_NAME	= "SimpleSecrets";

let fingerprint					= null;

/**
 * @brief	Ensure fingerprint exists
 *
 * @return	void
 */
export async function ensureFingerprintExists(): Promise<void>{
	let dbFingerprint	= await Fingerprint.findOne<Fingerprint>({
		where: {
			name: FINGERPRINT_NAME
		}
	});

	/* istanbul ignore next */
	if ( dbFingerprint === null ) {
		const data	= getRandomString( 32 );
		dbFingerprint	= await Fingerprint.create({
			data,
			name: FINGERPRINT_NAME
		});

		logger.log( "Fingerprint generated!" );
	}

	fingerprint	= dbFingerprint.data;
}

/**
 * @brief	Makes sure the fingerprint exists in the database and returns it
 *
 * @details	Creates it if needed
 */
export default async function (): Promise<string> {
	if ( fingerprint === null )
		await ensureFingerprintExists();

	return fingerprint;
}