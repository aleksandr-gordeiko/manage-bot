#!/usr/bin/env bash

repo_name=$1
workdir=$2
lines=$3

if [ "$lines" != 0 ]; then
  cd "${workdir}" || exit
  for (( i = 4; i < ("$lines" + 4); i++ )); do
    echo "${!i}" >> config.env
  done
fi

sudo systemctl enable "${repo_name}"
sudo systemctl start "${repo_name}"
