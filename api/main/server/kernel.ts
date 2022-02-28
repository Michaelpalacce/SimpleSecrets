"use strict";

// Dependencies
const app		= require( "event_request" )();
import logger	from "../utils/logger";

app.apply( app.er_cors, {
	origin: "er_dynamic",
	headers: [
		"Access-Control-Allow-Headers",
		"Origin",
		"Accept",
		"X-Requested-With",
		"Cache-Control",
		"Content-Type",
		"Referer",
		"User-Agent",
		"Access-Control-Request-Method",
		"Access-Control-Request-Headers",
		"DNT",
		"sec-ch-ua",
		"sec-ch-ua-mobile"
	],
	exposedHeaders: [],
	credentials: true
});

// Parse body
app.apply( app.er_body_parser_form );
app.apply( app.er_body_parser_json );
app.apply( app.er_body_parser_raw );

// Add Timeout
app.apply( app.er_timeout,					{ timeout	: 60000 } );

// Add a logger
// app.apply( app.er_logger,					{ logger } );

require( "../../controllers" );

