"use strict";

import App		from "event_request";
const app		= App();

const apiRouter	= app.Router();

// We cannot test this....
/* istanbul ignore next */
if ( ! process.env.INSECURE ){
	apiRouter.add( ( event ) => {
		if ( ! event.request.socket.encrypted ){
			throw { message: "Cannot access over insecure protocol. Please use HTTPS", code: "app.security.insecure" };
		}

		event.next();
	});
}

apiRouter.add( require( "./simplesecrets/controller/add" ) );
apiRouter.add( require( "./simplesecrets/controller/backup" ) );
apiRouter.add( require( "./simplesecrets/controller/get" ) );
apiRouter.add( require( "./simplesecrets/controller/delete" ) );

app.add( "/api", apiRouter );
