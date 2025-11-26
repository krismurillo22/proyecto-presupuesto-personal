const ibmdb = require('ibm_db');


const config = {
  DATABASE: process.env.DB_NAME || 'APPDB',
  HOSTNAME: process.env.DB_HOST || 'db2',  
  PORT: parseInt(process.env.DB_PORT || '50000', 10),
  UID: process.env.DB_USER || 'db2inst1',
  PWD: process.env.DB_PASSWORD || 'pass123',
  PROTOCOL: 'TCPIP',
};

const connectionString = `
  DATABASE=${config.DATABASE};
  HOSTNAME=${config.HOSTNAME};
  PORT=${config.PORT};
  PROTOCOL=${config.PROTOCOL};
  UID=${config.UID};
  PWD=${config.PWD};
`.replace(/\s+/g, ''); 

function getConnection(callback) {
  ibmdb.open(connectionString, callback);
}

module.exports = {
  ibmdb,
  config,
  connectionString,
  getConnection,
};
