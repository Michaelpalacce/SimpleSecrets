import { IncomingMessage, request }	from "http";

interface IncomingMessageWithBody extends IncomingMessage {
	body: any;
}

/**
 * @brief	Sends a request to the server and returns a Promise
 *
 * @param	{String} path
 * @param	{String} [method='GET']
 * @param	{*} [data='']
 * @param	{Object} [headers={}]
 *
 * @return	Promise
 */
export async function sendServerRequest( path, method = 'GET', data = {}, headers = {}): Promise<IncomingMessageWithBody> {
	return new Promise(( resolve,reject ) => {
		const predefinedHeaders	= {
			'Content-Type': 'application/json',
		};

		headers	= { ...predefinedHeaders, ...headers };

		const options	= {
			hostname	: 'localhost',
			port: 8080,
			path,
			method,
			headers
		};

		const req	= request( options, ( res: IncomingMessageWithBody ) => {
			const bodyParts	= [];
			res.on( 'data',( chunk ) => {
				bodyParts.push( chunk );
			});

			res.on( 'end',() => {
				res.body	= Buffer.concat( bodyParts );

				return resolve( res );
			});
		});

		req.on('error', ( e ) => {
			reject( e );
		});

		req.write( JSON.stringify( data ) );
		req.end();
	});
}