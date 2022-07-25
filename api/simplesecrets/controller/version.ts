'use strict';

// Dependencies
import App			from "event_request";
const axios			= require("axios");
const { version }	= require( '../../../package.json' );

const app		= App();
const router	= app.Router();
/**
 * @brief	Adds a '/api/latest' route with method GET
 *
 * @details	Required Parameters: NONE
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
router.get( '/latest', async ( event ) => {
	const response	= await axios.get( 'https://api.github.com/repos/Michaelpalacce/Simplesecrets/tags' ).catch( ( error ) => {
		return error.response;
	});

	if ( response.status !== 200 ) {
		await event.sendError({
			code: 'app.general.version.error',
			message: "Error while fetching latest version"
		});
		return;
	}

	event.send( response.data[0].name );
});

/**
 * @brief	Adds a '/api/current' route with method GET
 *
 * @details	Required Parameters: NONE
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
router.get( '/current', async ( event ) => {
	event.send( version );
});

module.exports	= router;