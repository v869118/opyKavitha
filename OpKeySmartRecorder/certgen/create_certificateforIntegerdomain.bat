cd /D %6
set DOMAIN_NAME=%1
set FILE_NAME=%2
set DEST_PATH=%3
set KEYTOOL_PATH=%4
set KEY_PASSWORD=sahipassword
set STORE_PASSWORD=sahipassword
set PATH_TO_OPENSSL=%5
echo %DOMAIN_NAME%
echo %FILE_NAME%
echo %DEST_PATH%

set SAN=DNS

copy X509CA\opensslsan.cnf X509CA\certs\%FILE_NAME%.cnf
echo %SAN%=%DOMAIN_NAME% >> X509CA/certs/%FILE_NAME%.cnf
%PATH_TO_OPENSSL%\openssl req -config X509CA/certs/%FILE_NAME%.cnf -subj "/CN=%DOMAIN_NAME%/OU=OpKey/O=OpKey/L=Noida/ST=UP/C=IN" -newkey rsa:2048 -sha256 -keyout X509CA/certs/%FILE_NAME%.pem -out X509CA/certs/%FILE_NAME%.csr -days 3650 -passout pass:%KEY_PASSWORD%
%PATH_TO_OPENSSL%\openssl ca -config X509CA/openssl.cnf -days 3650 -in X509CA/certs/%FILE_NAME%.csr -out X509CA/certs/%FILE_NAME%.signed -batch -passin pass:%KEY_PASSWORD%
%PATH_TO_OPENSSL%\openssl x509 -in X509CA/certs/%FILE_NAME%.signed -out X509CA/certs/%FILE_NAME%.signed_pem -outform PEM
%PATH_TO_OPENSSL%\openssl pkcs12 -export -in X509CA/certs/%FILE_NAME%.signed_pem -inkey X509CA/certs/%FILE_NAME%.pem -out X509CA/certs/%FILE_NAME%.p12 -CAfile X509CA/ca/new_ca.pem -passin pass:%KEY_PASSWORD% -passout pass:%KEY_PASSWORD%
%KEYTOOL_PATH% -importkeystore -destkeystore X509CA/certs/%FILE_NAME% -srckeystore X509CA/certs/%FILE_NAME%.p12 -srcstoretype pkcs12 -keypass %KEY_PASSWORD%  -srcstorepass %STORE_PASSWORD% -deststorepass %STORE_PASSWORD%
copy X509CA\certs\%FILE_NAME% %DEST_PATH%
del X509CA\certs\%FILE_NAME%*
certutil -addstore ROOT X509CA\ca\new_ca.pem