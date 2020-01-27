process.env.NODE_ENV = process.env.NODE_ENV || 'DEV_LOCAL';

const envConfig = {
	// For development (local)
	DEV_LOCAL: {
		mongo: {
			url: 'mongodb://{primary},{secondary}/{dbName}?replicaSet={replication set Name}&authSource=admin',
			user: '{db user Id}',
			pass: '{db user password}'
		}
	}
};

const config = envConfig[process.env.NODE_ENV];
config.appRoot = require('app-root-path');
// console.log(config)
module.exports = config;