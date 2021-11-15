#!/usr/bin/env bash

gh_username=$1
repo_name=$2
ci_path=$3
ci_user=$4
workdir_common="/home/${ci_user}"

repo_link="https://github.com/${gh_username}/${repo_name}"

cd "node" || exit
cp "deploy.sh" "${workdir_common}/"
cp "systemd.service" "${workdir_common}/"

cd "${workdir_common}" || exit
git clone "$repo_link"

sed -i -- "s/REPONAME/${repo_name}/g; s/WORKDIR/${workdir_common}/${repo_name}/g" deploy.sh
sed -i -- "s/REPONAME/${repo_name}/g; s/WORKDIR/${workdir_common}/${repo_name}/g; s/USER/${ci_user}/g" systemd.service

mv "deploy.sh" "${ci_path}/scripts/${repo_name}-master.sh"
mv "systemd.service" "/etc/systemd/system/${repo_name}.service"

# systemctl enable "${repo_name}"
# systemctl start "${repo_name}"
