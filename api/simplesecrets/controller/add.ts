'use strict';

// Dependencies
import App		from "event_request";
import add		from "../models/add";

const app		= App();
const router	= app.Router();

router.post( '/simplesecrets', add );

module.exports	= router;