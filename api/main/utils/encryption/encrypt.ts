import { randomBytes, createCipheriv, createDecipheriv }	from "crypto";

const ALGORITHM = {
	/**
	 * GCM is an authenticated encryption mode that
	 * not only provides confidentiality but also
	 * provides integrity in a secured way
	 * */
	BLOCK_CIPHER: "aes-256-gcm",

	/**
	 * NIST recommends 96 bits or 12 bytes IV for GCM
	 * to promote interoperability, efficiency, and
	 * simplicity of design
	 */
	IV_BYTE_LEN: 12,

	/**
	 * 128 bit auth tag is recommended for GCM
	 */
	AUTH_TAG_BYTE_LEN: 16,
};

const getIV	= () => randomBytes( ALGORITHM.IV_BYTE_LEN );

/**
 * @brief	Separated in a function because on start we don"t have env variable ENCRYPTION_KEY
 *
 * @return	{Buffer}
 */
function getKey() { return Buffer.from( process.env.ENCRYPTION_KEY ); }

/**
 * @brief	Gets the fingerprint from the database. This is used as a secondary method of authentication
 *
 * @return	{Buffer}
 */
function getFingerprint(): Buffer { return Buffer.from( process.env.FINGERPRINT ); }

/**
 * @param	{String} toEncrypt - The clear text message to be encrypted
 * @param	{Buffer} key - Encryption key
 */
function _encrypt( toEncrypt: string, key: Buffer = getKey() ): string {
	const messageText	= Buffer.from( toEncrypt );
	const iv			= getIV();
	// @ts-ignore
	const cipher		= createCipheriv(
		ALGORITHM.BLOCK_CIPHER,
		key,
		iv,
		{ "authTagLength": ALGORITHM.AUTH_TAG_BYTE_LEN }
	);
	let encryptedMessage	= cipher.update( messageText );
	encryptedMessage		= Buffer.concat( [encryptedMessage, cipher.final()] );

	return Buffer.concat( [iv, encryptedMessage, cipher.getAuthTag()] ).toString( "base64" );
}

/**
 *
 * @param	{String} toDecrypt - Cipher text
 * @param	{Buffer} key - Key to use
 */
function _decrypt( toDecrypt:string, key: Buffer = getKey() ): string {
	const ciphertext		= Buffer.from( toDecrypt, "base64" );
	const authTag			= ciphertext.slice( -16 );
	const iv				= ciphertext.slice( 0, ALGORITHM.IV_BYTE_LEN );
	const encryptedMessage	= ciphertext.slice( ALGORITHM.IV_BYTE_LEN, -16 );
	// @ts-ignore
	const decipher			= createDecipheriv(
		ALGORITHM.BLOCK_CIPHER,
		key,
		iv,
		{ "authTagLength": ALGORITHM.AUTH_TAG_BYTE_LEN }
	);
	decipher.setAuthTag( authTag );
	let messageText	= decipher.update(encryptedMessage);
	messageText		= Buffer.concat([messageText, decipher.final()]);

	return messageText.toString();
}

/**
 * @param	{String} toEncrypt - The clear text message to be encrypted
 * @param	{Boolean} includeFingerprint - Should use the fingerprint from the Database for encryption?
 *
 * The caller of this function has the responsibility to clear
 * the Buffer after the encryption to prevent the message text
 * and the key from lingering in the memory
 */
export function encrypt ( toEncrypt: string, includeFingerprint: boolean = true ): string {
	let message;
	if ( includeFingerprint ) {
		message	= _encrypt( toEncrypt, getFingerprint() );
	}

	message	= _encrypt( includeFingerprint ? message : toEncrypt );

	return message;
}

/**
 *
 * @param	{String} toDecrypt - Cipher text
 * @param	{Boolean} includeFingerprint - Should we double decrypt using the fingerprint from the database
 *
 * The caller of this function has the responsibility to clear
 * the Buffer after the decryption to prevent the message text
 * and the key from lingering in the memory
 */
export function decrypt ( toDecrypt: string, includeFingerprint: boolean = true ) : string {
	// First use the Encryption Key
	let message	= _decrypt( toDecrypt );

	if ( includeFingerprint ){
		message	= _decrypt( message, getFingerprint() );
	}

	return message;
}
