import axios, { AxiosResponse }	from "axios";
import SimpleSecrets			from "@/store/interfaces/simpleSecret";

/**
 * @brief	Communicator that is used to communicate with the simple secrets api
 */
export default class Communicator {
	constructor() {
	}

	/**
	 * @brief	Checks the health of the API by making a simple call and fails of error
	 */
	async checkHealth() {
		const response	= await this.getAllSecrets().catch( e => e );

		return response.status === 200;
	}

	/**
	 * Gets the latest package version
	 *
	 * @return	{Promise<Object>}
	 */
	async getLatestVersion() {
		return await axios.get( `/api/latest` ).catch( ( error ) => {
			return error.response;
		});
	}

	/**
	 * Gets the latest package version
	 *
	 * @return	{Promise<Object>}
	 */
	async getCurrentVersion() {
		return await axios.get( `/api/current` ).catch( ( error ) => {
			return error.response;
		});
	}

	/**
	 * @brief	Gets secrets for a specific namespace
	 *
	 * @param	{String} namespace
	 */
	async getSecretsForNamespace( namespace: string ): Promise<AxiosResponse<SimpleSecrets[]>> {
		const response	= await axios.get( `/api/simplesecrets/${namespace}` ).catch( ( error ) => {
			return error;
		});

		if ( response.message )
			throw response;

		return response;
	}

	/**
	 * @brief	Gets all secrets
	 */
	async getAllSecrets(): Promise<AxiosResponse<SimpleSecrets[]>> {
		const response	= await axios.get( `/api/simplesecrets` ).catch( ( error ) => {
			return error;
		});

		if ( response.message )
			throw response;

		return response;
	}

	/**
	 * @brief	Gets a specific secret
	 */
	async getSecret( namespace: string, name: string ): Promise<AxiosResponse<SimpleSecrets>> {
		const response	= await axios.get( `/api/simplesecrets/${namespace}/${name}` ).catch( ( error ) => {
			return error;
		});

		if ( response.message )
			throw response;

		return response;
	}

	/**
	 * @brief	Updates an existing secret
	 */
	async updateSecret( namespace: string, name: string, data: any ): Promise<AxiosResponse<SimpleSecrets>> {
		const response	= await axios.post( `/api/simplesecrets`, { name, namespace, data } ).catch( ( error ) => {
			return error;
		});

		if ( response.message )
			throw response;

		return response;
	}

	/**
	 * @brief	Creates a new secret
	 */
	async createSecret( secret: any ): Promise<AxiosResponse<SimpleSecrets>> {
		const response	= await axios.post( `/api/simplesecrets`, secret ).catch( ( error ) => {
			return error;
		});

		if ( response.message )
			throw response;

		return response;
	}

	/**
	 * @brief	Deletes an existing secret
	 */
	async deleteSecret( namespace: string, name: string, ): Promise<AxiosResponse<SimpleSecrets>> {
		const response	= await axios.delete( `/api/simplesecrets/${namespace}/${name}` ).catch( ( error ) => {
			return error;
		});

		if ( response.message )
			throw response;

		return response;
	}
}
