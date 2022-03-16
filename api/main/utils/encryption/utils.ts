import { randomBytes } from "crypto";

/**
 * @brief	Get a random string given a length
 *
 * @details	We divide by two since toString( "hex" ) doubles the bytes
 *
 * @param	{Number} length
 */
export function getRandomString( length: number = 32 ): string {
	return randomBytes( length / 2 ).toString( "hex" );
}
