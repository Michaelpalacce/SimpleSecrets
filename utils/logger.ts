import { Logging }						from "event_request";
const { Loggur, LOG_LEVELS, Console }	= Logging;

export interface OperatorLogger {
	log(message: string): void;
	info(message: string): void;
	debug(message: string): void;
	warn(message: string): void;
	error(message: string): void;
}

const logLevels		= {
	error	: 100,
	warn	: 200,
	info	: 300,
	debug	: 400
};

// Create a custom Logger
const logger	= Loggur.createLogger({
	serverName : 'SimpleSecretsOperator', // The name of the logger
	logLevel : logLevels.debug, // The logLevel for which the logger should be fired
	logLevels : logLevels, // The logLevel for which the logger should be fired
	capture : false, // Do not capture thrown errors
	transports : [
		new Console( {
			logLevel : LOG_LEVELS.notice,
		} ), // Console logger that logs everything below notice
	]
}) as OperatorLogger;

Loggur.addLogger( 'SimpleSecretsOperator', logger );

export default logger;