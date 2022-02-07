'use strict';

import App		from "event_request";
const app		= App();

const apiRouter	= app.Router();

apiRouter.add( require( './simplesecrets/controller/add' ) );
apiRouter.add( require( './simplesecrets/controller/backup' ) );
apiRouter.add( require( './simplesecrets/controller/get' ) );
apiRouter.add( require( './simplesecrets/controller/delete' ) );

// Backend
app.add( '/api', apiRouter );

// const PROJECT_ROOT	= path.parse( require.main.filename ).dir;
// const path		= require( 'path' );
// const fs		= require( 'fs' );
// // Serve dist
// app.apply( app.er_static, { paths: ['dist'] } );
// // Frontend
// app.get(( event )=>{
// 	fs.createReadStream( `${PROJECT_ROOT}/dist/index.html` ).pipe( event.response );
// });