require('dotenv').config();
const mysql = require('mysql');
const util = require('util');

const dbConfig = {
    host: 'localhost',
    connectionTimeout: 60 * 60 * 1000,
    acquireTimeout: 60 * 60 * 1000,
    user: 'root',
    password:'',
    database: 'legalBeagle',
    port: 3306,
};

let mysqlRetryConnectionLimit = 10;

let dbSingle = mysql.createConnection(dbConfig);

let dbPool = mysql.createPool(dbConfig);

const sleep = async function sleep(ms) {
    console.log(`sleep function called for ${ms/1000} seconds`);
    return new Promise((resolve) => new setTimeout(resolve,ms));
}

module.exports.sleep = sleep;

dbSingle.on('close', async (err) => {
    if(err) {
        console.log(`error - error`);
    } else {
        console.log('Mysql connection closed');
    }
    await refreshMysqlConnection();
});

dbSingle.on('error', async (err) => {
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('PROTOCOL_CONNECTION_LOST');
    } else {
        console.log('Some other error');
    }
    await refreshMysqlConnection();
});

const executeQuerySync = async function executeQuerySync(query) {
    await refreshMysqlConnection();
    const res = await util.promisify(dbPool.query).call(dbPool, query);
    return res;
}

module.exports.executeQuerySync = executeQuerySync;

async function refreshMysqlConnection () {
    return new Promise((resolve, reject) => {
        dbSingle.ping(async (err) => {
            if(err) {
                console.log(err);
                while(mysqlRetryConnectionLimit) {
                    try {
                        mysqlRetryConnectionLimit-=1;
                        console.log('retrying mysql connection');
                        dbSingle = mysql.createConnection(dbConfig);
                        mysqlRetryConnectionLimit = 10;
                        break;
                    } catch (error) {
                        console.log(error);
                        await sleep(5000); // waiting for 5 seconds to retry mysql connection
                    }
                }
            } else {
                resolve();
            }
        });
    });
}