"use strict";

// Dependencies
import App					from "event_request";
import { backup, restore }	from "../models/backup";

const app					= App();
const router				= app.Router();

router.get( "/simplesecrets/backup", backup );
router.post( "/simplesecrets/restore", restore );

module.exports	= router;