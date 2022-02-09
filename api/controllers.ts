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
