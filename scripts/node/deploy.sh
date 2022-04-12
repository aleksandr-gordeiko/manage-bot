#!/usr/bin/env bash

{
  systemctl stop REPONAME
  cd WORKDIR
  rm -rf node_modules
  git reset --hard
  git pull
  npm install --production
  npm run-script build
  systemctl start REPONAME
  curl 'localhost:61440?repository=REPONAME&status=deploy_success'
} || {
  curl 'localhost:61440?repository=REPONAME&status=deploy_fail'
}
