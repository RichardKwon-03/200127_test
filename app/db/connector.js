// var mysql = require('mysql');
var mongoose = require('mongoose');
const {readdirSync} = require('fs');
class Connector{

    constructor(config){
        if(!config){
            throw new Error('config is null or undefined');
        }
        this.config = config;
    }

    // getConnection_MySql(){
    //     return mysql.createConnection({
    //         host: this.config.host,
    //         port: this.config.port,
    //         user: this.config.user,
    //         password: this.config.password,
    //         database: this.config.database
    //     })
    // }
    async getConnection_Mongo(){
        let options = {
            useUnifiedTopology : true,
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            user: this.config.mongo.user,
            pass: this.config.mongo.pass
        };
        mongoose.connect(this.config.mongo.url, options);

        ['connecting', 'connected', 'open', 'disconnecting', 'disconnected', 'close', 'reconnected', 'error'].forEach(event => {
            mongoose.connection.on(event, (error) => {
                console.info(`[MongoDB event] '${event}'..`);
                if (error) throw new Error(`${error}`)
            })
        });

        /** transaction 환경에서 collection 자동 생성을 위한 model 호출 */
        for(const file of readdirSync(`${this.config.appRoot}/app/db/model/`)) {

            if(file.endsWith(".js")){
                let model = require(`./model/${file}`);

                for(let prop in model){
                    // console.log(prop)
                    await model[prop].createCollection();
                }
            }
        }

        return mongoose;
    }

}

module.exports = Connector;