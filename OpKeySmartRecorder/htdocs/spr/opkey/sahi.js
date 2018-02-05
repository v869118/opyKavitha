var sid="sahi_0.9579819513019174";
var _sr = null;

function SahiRecorder(){
	
}

SahiRecorder.prototype.controllerMode = function(){
	sendToServer("http://localhost:9999/_s_/dyn/Driver_setControllerMode?mode=opkey");
};

SahiRecorder.prototype.launchAndRecord = function(){
	var url = document.getElementById("record-url");
	var e = document.getElementById("record-browser");
	var browser = e.options[e.selectedIndex].value;
	sendToServer("http://localhost:9999/_s_/dyn/Driver_launchAndRecord?browser=" + browser + "&startUrl="  + encodeURIComponent(url.value));
};

SahiRecorder.prototype.getRecordedSteps = function(){
	sendToServer("http://localhost:9999/_s_/dyn/Driver_getRecordedSteps", "_sr.writeSteps");
};

SahiRecorder.prototype.writeSteps = function(result){
	document.getElementById("record-steps").value = "\"" + result + "\"";
};

SahiRecorder.prototype.getLastIdentified = function(){
	sendToServer("http://localhost:9999/_s_/dyn/Driver_getLastIdentifiedElement", "_sr.writeSteps");
};

SahiRecorder.prototype.setAnchor = function(){
	var parentEl = document.getElementById("parentEl").value;
	sendToServer("http://localhost:9999/_s_/dyn/Driver_setParentElementForRelation?step=" + encodeURIComponent(parentEl));
};

SahiRecorder.prototype.stopRecording = function(){
	sendToServer("http://localhost:9999/_s_/dyn/Driver_stopRecording");
};

SahiRecorder.prototype.killBrowser = function(){
	sendToServer("http://localhost:9999/_s_/dyn/Driver_kill");
};

function startRecording(){
	_sr = new SahiRecorder();
	_sr.controllerMode();
	setTimeout(function(){_sr.launchAndRecord()}, 1000);
};

function getRecordedSteps(){
	_sr.getRecordedSteps();
};

function stopRecording(){
	_sr.stopRecording();
	_sr.killBrowser();
};

function getLastIdentified(){
	_sr.getLastIdentified();
};

function setAnchor(){
	_sr.setAnchor();
};

function sendToServer(url, callbackFn) {
    /*try {
        var rand = (new Date()).getTime() + Math.floor(Math.random() * (10000));
        var http = createRequestObject();
        url = url + (url.indexOf("?") == -1 ? "?" : "&") + "t=" + rand;
        url = url + "&sahisid=" + encodeURIComponent(sid);
        var post = url.substring(url.indexOf("?") + 1);
        url = url.substring(0, url.indexOf("?"));
        http.open("POST", url, isAsync===true); //needed for IE
        http.send(post);
        return http.responseText;
    } catch(ex) {
        alert(ex)
    }*/
	try{
		var rand = (new Date()).getTime() + Math.floor(Math.random() * (10000));
		url = url + (url.indexOf("?") == -1 ? "?" : "&") + "t=" + rand;
        url = url + "&sahisid=" + encodeURIComponent(sid);
        loadDynJs("https://localhost:9998/?launchURL=" + formatURL(url, callbackFn));    
    } catch(e){}
};

function loadDynJs(filename) {
    var fileref = document.createElement('script');
    fileref.setAttribute("type", "text/javascript");
    fileref.setAttribute("src", filename);
    document.getElementsByTagName("head")[0].appendChild(fileref);
};

function formatURL(url, callbackFn){
    return encodeURIComponent(url + (url.indexOf("?") == -1 ? "?" : "&") + ((typeof callbackFn == "undefined") ? "" : "callback=" + callbackFn));
};


function createRequestObject() {
    var obj;
    if (window.XMLHttpRequest){
        // If IE7, Mozilla, Safari, etc: Use native object
        obj = new XMLHttpRequest();
    }else {
        if (window.ActiveXObject){
            // ...otherwise, use the ActiveX control for IE5.x and IE6
            obj = new ActiveXObject("Microsoft.XMLHTTP");
        }
    }
    return obj;
};