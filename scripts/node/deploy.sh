#!/usr/bin/env bash

systemctl stop REPONAME
cd WORKDIR || exit
rm -rf node_modules
git reset --hard
git pull
npm install
npm run-script build
systemctl start REPONAME
curl 'https://api.telegram.org/bot1906122682:AAEjmcwMhemo0D4lXkPUJls7DBGINTXVErM/sendMessage?chat_id=339015342&text=%E2%9C%85%20Chat%20Roles%20bot%20successfully%20deployed'
