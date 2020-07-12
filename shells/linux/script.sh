#!/bin/bash

# We'll have the user download git and clone the repository
# Then we'll tell the user to go to shells/linux and run ./script.sh

echo -e "Installing files..."
sudo apt-get update
sudo apt-get -y upgrade
sudo apt install -y nodejs npm git
cd groupBot && cd auxiliary

# now copy the ssh copy (figure this out)

echo "What is your GitHub username?"
read githubUsername
echo "Captured GitHub username: ${githubUsername}"

echo "What is the private repository's name (where your serviceAccountKey.json and config.json file are stored)?"
read repoName
echo "Captured repository's name: ${repoName}"

cd ../../../ && sudo chmod 777 auxiliary

cd auxiliary && git clone https://www.github.com/${githubUsername}/${repoName} settings

npm install
