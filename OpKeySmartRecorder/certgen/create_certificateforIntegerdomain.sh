cd $5
export DOMAIN_NAME=$1
export FILE_NAME=$2
export DEST_PATH=$3
export KEYTOOL_PATH=$4
export KEY_PASSWORD=sahipassword
export STORE_PASSWORD=sahipassword

echo $DOMAIN_NAME >> "$5/ssl.log" 2>&1
echo $FILE_NAME >> "$5/ssl.log" 2>&1
echo $DEST_PATH >> "$5/ssl.log" 2>&1

if echo $DOMAIN_NAME | egrep -q '^[.0-9]+$'; then
    export SAN=IP
else
    export SAN=DNS
fi

cp X509CA/opensslsan.cnf X509CA/certs/$FILE_NAME.cnf
echo $SAN=$DOMAIN_NAME >> X509CA/certs/$FILE_NAME.cnf

openssl req -config X509CA/certs/$FILE_NAME.cnf -subj "/CN=$DOMAIN_NAME/OU=OpKey/O=OpKey/L=Noida/ST=UP/C=IN" -newkey rsa:2048 -sha256 -keyout X509CA/certs/$FILE_NAME.pem -out X509CA/certs/$FILE_NAME.csr -days 3650 -passout pass:$KEY_PASSWORD >> "$5/ssl.log" 2>&1
openssl ca -config X509CA/openssl.cnf -days 3650 -in X509CA/certs/$FILE_NAME.csr -out X509CA/certs/$FILE_NAME.signed -batch -passin pass:$KEY_PASSWORD >> "$5/ssl.log" 2>&1
openssl x509 -in X509CA/certs/$FILE_NAME.signed -out X509CA/certs/$FILE_NAME.signed_pem -outform PEM >> "$5/ssl.log" 2>&1
openssl pkcs12 -export -in X509CA/certs/$FILE_NAME.signed_pem -inkey X509CA/certs/$FILE_NAME.pem -out X509CA/certs/$FILE_NAME.p12 -CAfile X509CA/ca/new_ca.pem -passin pass:$KEY_PASSWORD -passout pass:$KEY_PASSWORD >> "$5/ssl.log" 2>&1
$KEYTOOL_PATH -importkeystore -destkeystore X509CA/certs/$FILE_NAME -srckeystore X509CA/certs/$FILE_NAME.p12 -srcstoretype pkcs12 -keypass $KEY_PASSWORD  -srcstorepass $STORE_PASSWORD -deststorepass $STORE_PASSWORD >> "$5/ssl.log" 2>&1

cp X509CA/certs/$FILE_NAME $DEST_PATH >> "$5/ssl.log" 2>&1
rm X509CA/certs/$FILE_NAME* >> "$5/ssl.log" 2>&1
