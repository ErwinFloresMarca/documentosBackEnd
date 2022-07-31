PATH_PROYECT="/home/distritalpotosi/proyectoDocumentos/documentosBackEnd/"

#idif api
cd $PATH_PROYECT
git checkout master
git restore package-lock.json
git pull origin main
npm install
npm run build
npm run migrate
cd dist
pm2 start ecosystem.config.js --env test
