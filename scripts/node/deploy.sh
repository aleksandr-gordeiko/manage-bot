#!/usr/bin/env bash

systemctl stop REPONAME
cd WORKDIR || exit
rm -rf node_modules
git reset --hard
git pull
npm install
npm run-script build
systemctl start REPONAME
curl 'DEPLOY_CURL'
