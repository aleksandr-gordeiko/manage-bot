#!/usr/bin/env bash

gh_username=$1
repo_name=$2
ci_path=$3
ci_user=$4
github_pat=$5
workdir_common="/home/${ci_user}"

repo_link="https://${gh_username}:${github_pat}@github.com/${gh_username}/${repo_name}.git"

cd "scripts/node" || exit
cp "deploy.sh" "${workdir_common}/"
cp "systemd.service" "${workdir_common}/"

cd "${workdir_common}" || exit

systemctl stop "${repo_name}"
rm -rf "${repo_name}"
rm "${ci_path}/scripts/${repo_name}-master.sh"
rm "/etc/systemd/system/${repo_name}.service"

git clone "$repo_link"

workdir="${workdir_common}/${repo_name}"

sed -i -- "s:REPONAME:${repo_name}:g" deploy.sh
sed -i -- "s:WORKDIR:${workdir}:g" deploy.sh

sed -i -- "s:REPONAME:${repo_name}:g" systemd.service
sed -i -- "s:WORKDIR:${workdir}:g" systemd.service
sed -i -- "s:USER:${ci_user}:g" systemd.service

mv "deploy.sh" "${ci_path}/scripts/${repo_name}-master.sh"
chmod +x "${ci_path}/scripts/${repo_name}-master.sh"
mv "systemd.service" "/etc/systemd/system/${repo_name}.service"

cd "${workdir}" || exit
if [ -f "config.env.sample" ]; then
  cat "config.env.sample"
else
  echo "NOENV"
fi
