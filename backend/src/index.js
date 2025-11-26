const express = require('express');


const { runSchema } = require('./schema');
const { runTriggers } = require('./db_init/triggers');
const { runProcedures } = require('./db_init/procedures');
const { runFunctions } = require('./db_init/functions');
const { runSeed } = require('./db_init/seed');

const { getConnection } = require('./dbconfig');

const mainRoutes = require('./mainroutes');

const app = express();
const PORT = 8000;

app.use(express.json());

app.use('/api', mainRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Backend Node funcionando 🚀' });
});

app.get('/test-db', (req, res) => {
  console.log('Probando conexión a DB2 desde /test-db ...');

  getConnection((err, conn) => {
    if (err) {
      console.error('❌ Error conectando a DB2:', err.message || err);
      return res.status(500).json({
        ok: false,
        message: 'Error conectando a DB2',
        error: err.message || err,
      });
    }

    console.log('✅ Conexión a DB2 exitosa, ejecutando schema, triggers, procedures, functions y seed...');

    runSchema(conn)
      .then(() => runTriggers(conn))
      .then(() => runProcedures(conn))
      .then(() => runFunctions(conn))
      .then(() => runSeed(conn)) 
      .then(() => {
        conn.close(() => {
          console.log('Conexión cerrada después de schema + triggers + procedures + functions + seed');
        });

        return res.json({
          ok: true,
          message: 'DB2 OK: schema, triggers, procedures, functions y seed ejecutados ✅',
        });
      })
      .catch((e) => {
        console.error('⚠️ Error ejecutando schema/triggers/procedures/functions/seed:', e.message || e);
        conn.close(() => {
          console.log('Conexión cerrada por error en inicialización DB');
        });

        return res.status(500).json({
          ok: false,
          message: 'Error ejecutando schema/triggers/procedures/functions/seed en DB2',
          error: e.message || e,
        });
      });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
