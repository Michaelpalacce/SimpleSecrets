"use strict";

import App					from "event_request";
import { createReadStream }	from "fs";
import { parse }			from "path";

const app					= App();
const PROJECT_ROOT			= parse( <string>require.main?.filename ).dir;

const apiRouter	= app.Router();

apiRouter.add( require( "./simplesecrets/controller/add" ) );
apiRouter.add( require( "./simplesecrets/controller/backup" ) );
apiRouter.add( require( "./simplesecrets/controller/get" ) );
apiRouter.add( require( "./simplesecrets/controller/delete" ) );

app.add( "/api", apiRouter );

// Serve Static Resources
app.apply( app.er_static,	{ paths	: ['dist'], cache: { cacheControl: 'public', expirationDirectives: { 'max-age': 3600 } } } );

// Frontend
app.get(( event: any )=>{
    event.setResponseHeader( 'Content-Type', 'text/html' );
    createReadStream( `${PROJECT_ROOT}/dist/index.html` ).pipe( event.response );
});