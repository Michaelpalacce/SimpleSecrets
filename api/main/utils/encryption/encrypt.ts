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
function getKey() {
	return Buffer.from( process.env.ENCRYPTION_KEY );
}

/**
 * @param	{String} toEncrypt - The clear text message to be encrypted
 *
 * The caller of this function has the responsibility to clear
 * the Buffer after the encryption to prevent the message text
 * and the key from lingering in the memory
 */
export function encrypt ( toEncrypt: string ): string {
	const messageText	= Buffer.from( toEncrypt );
	const iv			= getIV();
	// @ts-ignore
	const cipher		= createCipheriv(
		ALGORITHM.BLOCK_CIPHER,
		getKey(),
		iv,
		{ "authTagLength": ALGORITHM.AUTH_TAG_BYTE_LEN }
	);
	let encryptedMessage	= cipher.update( messageText );
	encryptedMessage		= Buffer.concat([encryptedMessage, cipher.final()]);

	return Buffer.concat([iv, encryptedMessage, cipher.getAuthTag()]).toString( "base64" );
}

/**
 *
 * @param	{String} toDecrypt - Cipher text
 *
 * The caller of this function has the responsibility to clear
 * the Buffer after the decryption to prevent the message text
 * and the key from lingering in the memory
 */
export function decrypt ( toDecrypt: string ) : string {
	const ciphertext		= Buffer.from( toDecrypt, "base64" );
	const authTag			= ciphertext.slice(-16);
	const iv				= ciphertext.slice(0, ALGORITHM.IV_BYTE_LEN);
	const encryptedMessage	= ciphertext.slice(ALGORITHM.IV_BYTE_LEN, -16);
	// @ts-ignore
	const decipher			= createDecipheriv(
		ALGORITHM.BLOCK_CIPHER,
		getKey(),
		iv,
		{ "authTagLength": ALGORITHM.AUTH_TAG_BYTE_LEN }
	);
	decipher.setAuthTag( authTag );
	let messageText	= decipher.update(encryptedMessage);
	messageText		= Buffer.concat([messageText, decipher.final()]);
	return messageText.toString();
}
