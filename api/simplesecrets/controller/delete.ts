"use strict";

// Dependencies
import App				from "event_request";
import { deleteOne }	from "../models/delete";

const app		= App();
const router	= app.Router();

router.delete( "/simplesecrets/:namespace:/:name:", deleteOne );

module.exports	= router;