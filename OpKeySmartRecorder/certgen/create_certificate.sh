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

$KEYTOOL_PATH -genkey -ext SAN=dns:$DOMAIN_NAME -alias $DOMAIN_NAME -keypass $KEY_PASSWORD -storepass $STORE_PASSWORD -keyalg RSA -keystore X509CA/certs/$FILE_NAME -dname "CN=$DOMAIN_NAME, OU=OpKey, O=OpKey, L=Noida, S=UP, C=IN" -validity 3650 >> "$5/ssl.log" 2>&1
$KEYTOOL_PATH -certreq -ext SAN=dns:$DOMAIN_NAME -alias $DOMAIN_NAME -file X509CA/certs/$FILE_NAME.csr -keypass $KEY_PASSWORD -keystore X509CA/certs/$FILE_NAME -storepass $STORE_PASSWORD >> "$5/ssl.log" 2>&1
openssl ca -config X509CA/openssl.cnf -days 3650 -in X509CA/certs/$FILE_NAME.csr -out X509CA/certs/$FILE_NAME.signed -batch -passin pass:$KEY_PASSWORD >> "$5/ssl.log" 2>&1
openssl x509 -in X509CA/certs/$FILE_NAME.signed -out X509CA/certs/$FILE_NAME.signed_pem -outform PEM >> "$5/ssl.log" 2>&1
cp X509CA/certs/$FILE_NAME X509CA/certs/$FILE_NAME.orig  >> "$5/ssl.log" 2>&1
$KEYTOOL_PATH -list -ext SAN=dns:$DOMAIN_NAME -keystore X509CA/certs/$FILE_NAME -storepass $STORE_PASSWORD >> "$5/ssl.log" 2>&1
$KEYTOOL_PATH -noprompt -ext SAN=dns:$DOMAIN_NAME -import -alias sahi_root -keypass $KEY_PASSWORD -file X509CA/ca/new_ca.pem -keystore X509CA/certs/$FILE_NAME -storepass $STORE_PASSWORD >> "$5/ssl.log" 2>&1
$KEYTOOL_PATH -noprompt -ext SAN=dns:$DOMAIN_NAME -import -alias $DOMAIN_NAME -keypass $KEY_PASSWORD -file X509CA/certs/$FILE_NAME.signed_pem -keystore X509CA/certs/$FILE_NAME -storepass $STORE_PASSWORD >> "$5/ssl.log" 2>&1
cp X509CA/certs/$FILE_NAME $DEST_PATH  >> "$5/ssl.log" 2>&1
rm X509CA/certs/$FILE_NAME*
