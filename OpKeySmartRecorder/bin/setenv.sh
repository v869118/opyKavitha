#!/bin/bash

echo $1> $HOME/opkeyinstall.dat
echo Setting the port details
if [ ! -w "$1"/bin/start.sh ]
then

  sudo chmod u+w "$1"/bin/start.sh
fi
cd "$1"/bin
nohup sh ./start.sh > /dev/null 2>&1 &
osascript -e "do shell script \"security add-trusted-cert -d -r trustRoot -k '/Library/Keychains/System.keychain' '../certgen/X509CA/ca/OpKey.crt'\" with administrator privileges"
