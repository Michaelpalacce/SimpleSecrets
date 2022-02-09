'use strict';

// Dependencies
import App								from "event_request";
import { Secret }						from "../../main/persistence/connector";
import { getAllInNamespace, getOne }	from "../models/get";
const app								= App();
const router							= app.Router();

router.get( '/simplesecrets', async ( event ) => {
	event.send( await Secret.findAll() );
});
router.get( '/simplesecrets/:namespace:/:name:', getOne );
router.get( '/simplesecrets/:namespace:', getAllInNamespace );

module.exports	= router;