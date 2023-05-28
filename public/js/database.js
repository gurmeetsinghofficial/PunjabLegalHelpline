const mysql = require('mysql');
const util = require('util');

const dbName = process.env.DB_NAME || 'EcartWebsite';
const port = process.env.DB_PORT || 3306;
const userName = process.env.DB_USERNAME || 'root';
const pass = process.env.DB_PASS || '';
const host = process.env.DB_HOST || 'localhost';

const dbConfig = {
    host: host,
    user: userName,
    password: pass,
    database: dbName,
    port: port,
}

const dbpool = mysql.createPool(dbConfig);
const con = mysql.createConnection(dbConfig);
let dbConnectionRetryLimit = 5;
con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

const executeQuery = async function executeQuery(query) {
    await refreshDbConnection();
    const res = await util.promisify(dbpool.query).call(dbpool, query);
    return res;
};

const refreshDbConnection = async function refreshDbConnection() {
    return new Promise((resolve)=>{
            con.ping(async (err)=>{
                if(err) {
                    console.log('DB connection issue', err);
                    while(dbConnectionRetryLimit) {
                        try {
                            dbConnectionRetryLimit--;
                            con = mysql.createConnection(dbConfig);
                            dbConnectionRetryLimit=5;
                            break;
                        } catch (error) {
                            console.log(error);
                            await sleep(1000);
                        }
                    }
                } else {
                    resolve();
                }
            });
    });
}

const closeConnection = async function closeConnection() {
    con.closeConnection();
    console.log('connection closed');
}

con.on('close', async(err)=>{
    if(err) {
        console.log(err);
    } else {
        console.log('DB connection closed');
    }
})

con.on('error', async (err)=>{
    console.log(err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
        await refreshDbConnection();
    } else {
        throw err;
    }
})

module.exports.closeConnection = closeConnection;

module.exports.executeQuery = executeQuery;