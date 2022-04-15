"use strict";

// Dependencies
import App										from "event_request";
import { getAll, getAllInNamespace, getOne }	from "../models/get";

const app		= App();
const router	= app.Router();

router.get( "/simplesecrets", getAll );
router.get( "/simplesecrets/:namespace:/:name:", getOne );
router.get( "/simplesecrets/:namespace:", getAllInNamespace );

module.exports	= router;