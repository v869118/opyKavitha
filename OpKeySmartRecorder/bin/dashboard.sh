if [ ! $OPKEY_HOME ] 
then
	export OPKEY_HOME=..
fi
if [ ! $OPKEY_USERDATA_DIR ]
then
	export OPKEY_USERDATA_DIR_TMP=$OPKEY_HOME/userdata
else	
	export OPKEY_USERDATA_DIR_TMP=$OPKEY_USERDATA_DIR
fi	

OPKEY_CLASS_PATH=$OPKEY_HOME/lib/opkey.jar:$OPKEY_HOME/extlib/rhino/js.jar:$OPKEY_HOME/extlib/apc/commons-codec-1.3.jar:$OPKEY_HOME/extlib/apc/commons-codec-1.3.jar:$OPKEY_HOME/extlib/jetty/9.2.16/jetty-server-9.2.16.v20160414.jar:$OPKEY_HOME/extlib/jetty/9.2.16/jetty-util-9.2.16.v20160414.jar:$OPKEY_HOME/extlib/jetty/9.2.16/servlet-api-3.1.jar:$OPKEY_HOME/extlib/oracle/org.json-0.jar:$OPKEY_HOME/extlib/jetty/9.2.16/jetty-http-9.2.16.v20160414.jar:$OPKEY_HOME/extlib/jetty/9.2.16/jetty-io-9.2.16.v20160414.jar
java -classpath $OPKEY_EXT_CLASS_PATH:$OPKEY_CLASS_PATH net.sf.opkey.ui.Dashboard "$OPKEY_HOME" "$OPKEY_USERDATA_DIR_TMP"
