/* eslint-disable @typescript-eslint/naming-convention */
module.exports = {
  apps: [
    {
      name: 'documentos-api',
      script: './index.js',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        DB_URL: 'mysql://root:mariadbpw@localhost:49153/documentos',
      },
      env_test: {
        DB_URL: 'mysql://root:mariadbpw@localhost:49153/documentos',
      },
      env_production: {
        DB_URL: 'mysql://root:mariadbpw@localhost:49153/documentos',
      },
    },
  ],
};
