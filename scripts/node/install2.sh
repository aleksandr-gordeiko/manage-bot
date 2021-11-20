#!/usr/bin/env bash

repo_name=$1
workdir=$2
vars=$3

if [ "$vars" != 0 ]; then
  cd "${workdir}" || exit
  for (( i = 4; i < ("$vars" + 4); i++ )); do
    echo "${!i}" >> config.env
  done
fi

# sudo systemctl enable "${repo_name}"
# sudo systemctl start "${repo_name}"
