'use strict';

import App					from "event_request";
import { parse }			from "path";
import { createReadStream }	from "fs";
const app					= App();

const apiRouter	= app.Router();

apiRouter.add( require( './simplesecrets/controller/add' ) );
apiRouter.add( require( './simplesecrets/controller/backup' ) );
apiRouter.add( require( './simplesecrets/controller/get' ) );
apiRouter.add( require( './simplesecrets/controller/delete' ) );

app.add( '/api', apiRouter );
