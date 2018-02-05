/** -- Java Recorder Start -- **/

if (_opkey.controllerMode == "java") {
	_opkey.controllerURL = "/_s_/spr/controllertw.htm";
	_opkey.controllerHeight = 250;
	_opkey.controllerWidth = 420;
	_opkey.recorderClass = "StepWiseRecorder";
	Opkey.prototype.getExpectPromptScript = function(s, retVal) {
		return "browser." + this.getPopupDomainPrefixes() + "expectPrompt("
				+ this.quotedEscapeValue(s) + ", "
				+ this.quotedEscapeValue(retVal) + ")";
	} 
	
	Opkey.prototype.getExpectConfirmScript = function(s, retVal) {
		return "browser." + this.getPopupDomainPrefixes() + "expectConfirm("
				+ this.quotedEscapeValue(s) + ", " + retVal + ")";
	}
	Opkey.prototype.getNavigateToScript = function(url) {
		return "browser." + this.getPopupDomainPrefixes() + "navigateTo("
				+ this.quotedEscapeValue(url) + ");"
	}
	Opkey.prototype.getScript = function(infoAr, el, evType, e) {
		var info = infoAr[0];
		var accessor = this.escapeDollar(this.getAccessor1(info));
		if (accessor == null)
			return null;
		if (accessor.indexOf("_") == 0)
			accessor = accessor.substring(1);
		var ev = info.event;
		var value = info.value;
		var type = info.type;
		var popup = this.getPopupName();

		var cmd = null;
		if (value == null)
			value = "";
		// handle F12 and contextmenu
		if (evType == "keydown") {
			if (e && e.keyCode >= 112 && e.keyCode <= 123 && !e.charCode) {
				cmd = accessor + ".keyPress(\"[" + e.keyCode + "," + 0
						+ "]\");";
			}
			if (!cmd)
				return null;
		} else {
			if (ev == "_click") {
				if (evType && evType.toLowerCase() == "contextmenu") {
					cmd = accessor + ".rightClick();";
				} else
					cmd = accessor + ".click();";
			} else if (ev == "_setValue") {
				cmd = accessor + ".setValue(" + this.quotedEscapeValue(value)
						+ ");";
			} else if (ev == "_setSelected") {
				cmd = accessor + ".choose(" + this.quotedEscapeValue(value)
						+ ");";
			} else if (ev == "_setFile") {
				cmd = accessor + ".setFile(" + this.quotedEscapeValue(value)
						+ ");";
			}
		}
		cmd = this.addPopupDomainPrefixes(cmd);
		cmd = "browser." + cmd;
		return cmd;
	};
	Opkey.prototype.escapeDollar = function(s) {
		return s;
		if (s == null)
			return null;
		return s.replace(/[$]/g, "\\$");
	};
	Opkey.prototype.getAccessor1 = function(info) {
		if (info == null)
			return null;
		if ("" == ("" + info.shortHand) || info.shortHand == null)
			return null;
		var accessor = info.type + "(" + this.escapeForScript(info.shortHand)
				+ ")";
		if (accessor.indexOf("_") == 0)
			accessor = accessor.substring(1);
		return accessor;
	};
	_opkey.language = {
		ASSERT_EXISTS : "assertTrue(<accessor>.exists());",
		ASSERT_VISIBLE : "assertTrue(<accessor>.isVisible());",
		ASSERT_EQUAL_TEXT : "assertEquals(<value>, <accessor>.text());",
		ASSERT_CONTAINS_TEXT : "assertTrue(<accessor>.text().contains(<value>));",
		ASSERT_EQUAL_VALUE : "assertEquals(<value>, <accessor>.value());",
		ASSERT_SELECTION : "assertEquals(<value>, <accessor>.selectedText());",
		ASSERT_CHECKED : "assertTrue(<accessor>.checked());",
		ASSERT_NOT_CHECKED : "assertFalse(<accessor>.checked());",
		POPUP : "popup(<window_name>).",
		DOMAIN : "domain(<domain>)."
	};
}
/** -- Java Recorder End -- **/

/** -- OpKey Recorder Start -- **/
if (_opkey.controllerMode == "opkey") {

	/* Selenium locatorBuilders start */
	//var test = JSON.stringify("/_s_/spr/ext/selenium/locatorBuilders.js")
	eval(_opkey.sendToServer("/_s_/spr/ext/selenium/locatorBuilders.js"));
	var Log = function() {
	};
	Log.info = Log.warn = Log.prototype.exception = Log.prototype.error = Log.prototype.debug = function(
			s) {
	};
	
	DummyBot = function() {
		this.locationStrategies = []
	};
	DummyBot.prototype.findElement = function(locator) {
		return _opkey._bySeleniumLocator(locator);
	}
	LocatorBuilders.prototype.pageBot = function() {
		return new DummyBot();
	};
	/* Selenium locatorBuilders end */

	_opkey.controllerURL = "/_s_/spr/opkeycontroller.htm";
	_opkey.controllerHeight = 250;
	_opkey.controllerWidth = 420;
	_opkey.recorderClass = "StepWiseRecorder";
	Opkey.prototype.getExpectPromptScript = function(s, retVal) {
		return this.toJSON([ this.getStepObj("expectPrompt", this
				.quotedEscapeValue(s), this.quotedEscapeValue(retVal)) ]);
	}
	Opkey.prototype.getExpectConfirmScript = function(s, retVal) {
		return this.toJSON([ this.getStepObj("expectConfirm", this
				.quotedEscapeValue(s), retVal) ]);
	}

	Opkey.prototype.getNavigateToScript = function(url){
		return this.toJSON([this.getStepObj("navigateTo", "", this.quotedEscapeValue(url)), this.getStepObj("navigateTo", "", this.quotedEscapeValue(url), "selenium")]);
	}	
	Opkey.prototype.getStepObj = function(accessor, accessorType, accessorArr){
		try{
		if(accessorType!="index"){
		accessorArr[accessorType.replace(/\\"/g, '')] = accessor.replace(/\\"/g, '').replace(/\"/g, ""); 
		}
		else{
		accessorArr[accessorType] = accessor; 	
		}
		}
		catch(e){
			accessorArr[accessorType] = accessor; 
		}
	}

	Opkey.prototype.escapeNullValue = function(value) {
		return (value) ? value : '';
	}

	Opkey.prototype._getFinalFramesList = function() {
		var finalAr = new Object();
		var secAr = new Object();
		for (var i = 0; i < this._framesList.length; i++) {
			var str = "finalAr";
			for (var j = 0; j <= i; j++) {
				str += "[\"parent\"]"
			}
			////console.log(str);
			eval(str + "=new Object()");
			eval(str + "=" + FJSON.stringify(this._framesList[i]));
		}
		return finalAr["parent"];
	}

	Opkey.prototype._getFrames = function(win) {
		if (typeof index == "undefined")
			index = 0;
		var _opkey = this;
		var currentFrame = (_opkey.currentIframeDetails) ? _opkey.currentIframeDetails : {"parentTitle" : _opkey.getTitle(), "parentURL" : _opkey.getURL()};
		try {
			if (win.self === win.top) {
				var opkeywindowid=null;
				//if(_opkey.windowidentiferontitle==null){
					opkeywindowid=_opkey.sendToServer("/_s_/dyn/Driver_getFocusedWindowID?");
					if(opkeywindowid==""){
						opkeywindowid=_opkey.windowidentiferontitle;
					}
				//}
			//	else{
				//	opkeywindowid=_opkey.windowidentiferontitle;
				//}
				try {
					var title=currentFrame.parentTitle.replace(/\"/g, "&#x0022;").replace("'","&#x0027;");
					if(title==""){
						title=" "
					}
					this._framesList.push({
						"type" : "HTML PAGE",
						"tag" : "html",
                        "index" : "0",
						"titleindex" : _opkey.sendToServer("/_s_/dyn/Driver_getPageTitleIndex?id="+opkeywindowid+"&title="+encodeURIComponent(currentFrame.parentTitle.replace(/\"/g, "&#x0022;").replace("'","&#x0027;"))),
						"title" : title,
						"url" : currentFrame.parentURL.replace(/{/g, '').replace(/}/g, '').replace(/\"/g, "&#x0022;")
					});
				} catch (e) {
					//_opkey._debug(e)
				}
			} else {
				try {
					var currentFrame=null;
					try{
					currentFrame = win.frameElement;
					if(currentFrame == null){
						currentFrame = _opkey.currentIframeDetails;
					}
					}catch(e){
						currentFrame = _opkey.currentIframeDetails;
					}
                     var frameindex=0;		
					 try{
				var arrframes=win.parent.document.getElementsByTagName(currentFrame.nodeName)
					for(var i=0;i<arrframes.length;i++){
						var iframenode=arrframes[i]
						if(iframenode==currentFrame){
						frameindex=i
						break
						}
					}
}catch(e){}
					var htmltitle=""
					try{
						htmltitle=_opkey.getTitle();
						if(htmltitle==""){
						htmltitle=currentFrame.contentDocument.title
						}
					}catch(e){
						htmltitle=currentFrame.parentTitle
					}
					if (currentFrame != null && currentFrame.name!="mywindow") {
						var framesrc="";
						try{
						framesrc=currentFrame.getAttribute("src");
						}catch(e){
							framesrc=currentFrame.src;
						}
						if(frameindex==0){
													this._framesList.push({
							"type" : "Frame",
							"tag" : "iframe",
							"src" : _opkey.escapeNullValue(framesrc),
							"index" : "0",
							"id" : _opkey.escapeNullValue(currentFrame.id),
							"name" : _opkey.escapeNullValue(currentFrame.name),
							"title": htmltitle
						});
						}
						else{
						this._framesList.push({
							"type" : "Frame",
							"tag" : "iframe",
							"src" : _opkey.escapeNullValue(framesrc),
							"index" : frameindex,
							"id" : _opkey.escapeNullValue(currentFrame.id),
							"name" : _opkey.escapeNullValue(currentFrame.name),
							"title": htmltitle
						});
						}
						//console.log(currentFrame.src)
					}
				} catch (e) {
					//_opkey._debug(e)
				}
				_opkey._getFrames(win.parent);
			}
		}
		catch (e) {
			//_opkey._debug(e)
		}
	}
	
	Opkey.prototype.escapeNullValue = function(value) {
		return (value) ? value : '';
	}

	Opkey.prototype.arrayContains = function(a, obj) {
		var i = a.length;

		while (i--) {
			if (a[i] === obj) {
				return true;

			}
		}
		return false;
	}
	Opkey.prototype.arrayIndexOf = function(a, obj) {
		var i = a.length;
		while (i--) {
			if (a[i] === obj) {
				return i;
			}
		}
		return -1;
	}
	Opkey.prototype.triggerEvent = function (target, evtType) {
		////this._debug("target" + target);
		if(target.nodeName != "INPUT"){
				if(this.lastMouseDownEl != null && this.lastMouseDownEl.nodeName != "INPUT"){
					evtType.preventDefault();
					//return;
				}	
			}
		if ("createEvent" in document) {
			////this._debug("createevents")
			var event = target.ownerDocument.createEvent("HTMLEvents");
			event.initEvent(evtType, false, true);
			target.dispatchEvent(event);
		}
		else {
			try{
			target.fireEvent(evtType);
			}catch(e){}
		}
	}
	Opkey.prototype.getURL = function() {
		return this.top().location.href;
	}
	
			Opkey.prototype.getCustomeKeywordScript = function (action, el,datavalue) {
			if(action=="setValue" || action=="_setValue"){ 	
			if(datavalue==""){
				return;
			}
			datavalue=datavalue.replace(/\"/g, '').replace(/\[/g,'&squareopen').replace(/\]/g,'&squareclose')
			}
			
			if(el.type=="password"){
				action="TypeSecureText";
			}
 		//if(document.domain != "rediff.com" && e.type == "blur") return; 
 		var popupName = this.getPopupName(); 
 		//this._debug("evType" + evType + "   :el:  " + el ); 
 		var toSendAr = new Object(); 
 		 			 
 			toSendAr["action"] = action; 
 			var dataArguments = { 
 					"type" : "string", 
 					"data" : datavalue
 		//	"data" : encodeURIComponent(this.escapeNullValue(value))
 			} 
 			//toSendAr["popupName"] = popupName.replace(/\"/g, "&quote;"); 
 			
			var elementProperties = new Object(); 
 			var previousAccessorType = [];
 			var visitedAccessorType = 0;
 			var checkstatus=""
				if(el.innerText!=null){
				this.getStepObj(el.innerText, "sahiText", elementProperties); 
			}
 			this.getStepObj(el.tagName, "tag", elementProperties); 
 			if(typeof el.type != "undefined") 
 			this.getStepObj(el.type, "type", elementProperties); 
 			// Selenium accessors start 
 			var locators = this.getSeleniumAccessors(el); 
 			for (var i=0; i<locators.length; i++){ 
 				try{ 
			if(locators[i][1]!="name"){
 					this.getStepObj(locators[i][0], locators[i][1], elementProperties); 
				}
 				} catch(e){} 
 			} 
						try{
		var backgroundcolorofelement=window.getComputedStyle(el, null).getPropertyValue("background-color")
        var colorofelement=window.getComputedStyle(el, null).getPropertyValue("color")

	
		elementProperties["background-color"] = backgroundcolorofelement;
		elementProperties["color"] = colorofelement;
		var rect = el.getBoundingClientRect();
         elementProperties["width"]=(rect.right - rect.left)
         elementProperties["height"]=(rect.bottom - rect.top)
         elementProperties["x"]=rect.left
         elementProperties["y"]=rect.top
 			var imagebase64=_opkey.sendToServer('/_s_/dyn/Driver_getRealtimeObjectImage?width='+rect.width+'&height='+rect.height);
		elementProperties["ObjectImage"] = imagebase64;
		}catch(e){
			var imagebase64=_opkey.sendToServer('/_s_/dyn/Driver_getRealtimeObjectImage?width='+'0'+'&height='+'0');
		elementProperties["ObjectImage"] = imagebase64;
		}
				var logicalname=el.nodeName;
			try{
				logicalname=_opkey.getLogicalNameOfObject(el,elementProperties["sahiText"])
				if(typeof logicalname==="object"){
					logicalname=el.nodeName
				}
				}catch(e){}
		if(logicalname.length>25){
			logicalname=logicalname.substring(0, 25);
		}
	this.getStepObj(logicalname, "logicalname", elementProperties);
		try{
			
			if(el.nodeName=="INPUT" || el.nodeName=="TEXTAREA"){
				if(el.maxLength!=-1){
					elementProperties["length"]=el.maxLength
				}
				if(el.placeholder){
					elementProperties["placeholder"]=el.placeholder
				}
			}
			if(el.nodeName=="LI"){
				var parent=el.parentNode;
				var childnodes=parent.childNodes
				for(var k=0;k<childnodes.length;k++){
					if(childnodes[k]==el){
						elementProperties["itemIndex"]=k
						break;
					}
				}
			}
			if(el.nodeName=="UL" || el.nodeName=="SELECT"){
				var count=el.childnodes.length
				elementProperties["itemCount"]=count
			}
		}catch(e){}
 			// Selenium accessors end 
			
					var recordingmode=_opkey.sendToServer("/_s_/dyn/Driver_getRecordingMode");
		if(recordingmode=="SALESFORCE"){
		try{
		var label=_opkey.getMatchingLabelWithTextBoxNDropDown(el);
		if(label){
			elementProperties["label:text"]=label.textContent;
			var labellocators = this.getSeleniumAccessors(label); 
 			for (var li=0; li<labellocators.length; li++){
			  elementProperties["label:"+labellocators[li][1]]=labellocators[li][0]
			}
		}
		if(el.placeholder){
			elementProperties["label:placeholder"] = el.placeholder;
		}
		if(el.aria-label){
			elementProperties["label:arialabel"] = el.el.aria-label;
		}
			}catch(e){
				}
		}
		if(elementProperties["label:text"]){
			elementProperties["logicalname"]=elementProperties["label:text"]
		}
		else if(elementProperties["label:placeholder"]){
			elementProperties["logicalname"]=elementProperties["label:placeholder"]
		}
		else if(elementProperties["label:arialabel"]){
			elementProperties["logicalname"]=elementProperties["label:arialabel"]
		}
			
 			this._framesList = new Array(); 
			this._tempframesList = new Array();
			var htmltitle;
			var titleindex;
 			var doc = el.ownerDocument; 
 			var win = doc.defaultView || doc.parentWindow; 
 			this._getFrames(win);
				        for(var i=0;i<this._framesList.length;i++){
				var parentobject=this._framesList[i]
				if(parentobject["tag"]=="html"){
					htmltitle=parentobject["title"]
					toSendAr["popupName"]=htmltitle;
					titleindex=parentobject["titleindex"]
				}
			}
            for(var j=0;j<this._framesList.length;j++){
				var parentobject=this._framesList[j]
					parentobject["title"]=htmltitle;
					parentobject["titleindex"]=titleindex;
					this._tempframesList.push(parentobject)
			}
            this._framesList=this._tempframesList	
 						var parentobject=this._getFinalFramesList();
			if(parentobject==null){
				var opkeywindowid=null;
				opkeywindowid=_opkey.sendToServer("/_s_/dyn/Driver_getFocusedWindowID?");
				if(opkeywindowid==""){
				opkeywindowid=_opkey.windowidentiferontitle;
				}
				var probject=new Object();
				probject["tag"]="HTML";
				probject["type"]="html page";
				probject["title"]=_opkey.getTitle().replace(/{/g, '').replace(/}/g, '');
				probject["url"]=_opkey.getURL().replace(/{/g, '').replace(/}/g, '').replace(/\"/g, "&#x0022;");;
				probject["titleindex"]=_opkey.sendToServer("/_s_/dyn/Driver_getPageTitleIndex?id="+opkeywindowid+"&title="+encodeURIComponent(_opkey.getTitle().replace(/\"/g, "&#x0022;").replace("'","&#x0027;")));
				parentobject=probject;
			}
 			elementProperties["parent"] = parentobject;
 			if(el.nodeName=="TD" || el.nodeName=="TR"){
				while (el.parentNode) {
              	if(el.nodeName=="TABLE"){
			var tableobject=new Object()
			tableobject["tag"]=el.nodeName
			tableobject["type"]="table"
			tableobject["id"]=el.id
			tableobject["name"]=el.name
			tableobject["class"]=el.className
			elementProperties["parent"] = tableobject
			break;
					}
					el = el.parentNode;
                   }
			}

	
 			toSendAr["arguments"] = [elementProperties, dataArguments];
			

 		 var retdata=FJSON.stringify(toSendAr)
		 				var tempscript=null;
	try{
		tempscript=retdata;
		var tempobject=toSendAr;
		tempobject.arguments[0].ObjectImage=null;
		tempobject.arguments[0]["parent"]=null;
		for(var key in tempobject.arguments[0]){
			if(tempobject.arguments[0][key]){
			tempobject.arguments[0][key]=removeindex(tempobject.arguments[0][key]);
			}
		}
		if(tempobject["action"]=="click"){
		tempobject.arguments[1]["data"]=null;
		}
		tempscript=JSON.stringify(tempobject)

	}catch(e){
		tempscript=null;
	}

	if(tempscript!=null){
	if (this.hasEventBeenRecorded(tempscript)) {
		return; //IE
	}
	}
	else{
	if (this.hasEventBeenRecorded(retdata)) {
		return; //IE
	}
	}
 		 for(var k=0;k<1000;k++){
 		 retdata = retdata.toString().replace('\\"','"')
 		 retdata = retdata.toString().replace('arguments":"[{','arguments":[{')
 		 retdata = retdata.toString().replace(']"}',']}')
	 }
 		 //console.log(retdata)
 		 this.sendToServer('/_s_/dyn/' + 'StepWiseRecorder_record?step=' + encodeURIComponent(retdata), false);
		 
 	} 
	
	
	Opkey.prototype.getCustomeKeywordScriptReturnedData = function (action, el,datavalue) { 
			if(datavalue==""){
				return;
			}

			if(el.type=="password"){
				action="TypeSecureText";
			}
 		//if(document.domain != "rediff.com" && e.type == "blur") return; 
 		var popupName = this.getPopupName(); 
 		//this._debug("evType" + evType + "   :el:  " + el ); 
 		var toSendAr = new Object(); 
 		 			 
 			toSendAr["action"] = action; 
 			var dataArguments = { 
 					"type" : "string", 
 					"data" : datavalue
 		//	"data" : encodeURIComponent(this.escapeNullValue(value))
 			} 
 			//toSendAr["popupName"] = popupName.replace(/\"/g, "&quote;"); 
 			
			var elementProperties = new Object(); 
 			var previousAccessorType = [];
 			var visitedAccessorType = 0;
 			var checkstatus=""
				if(el.innerText!=null){
				this.getStepObj(el.innerText, "sahiText", elementProperties); 
			}
 			this.getStepObj(el.tagName, "tag", elementProperties); 
 			if(typeof el.type != "undefined") 
 			this.getStepObj(el.type, "type", elementProperties); 
 			// Selenium accessors start 
 			var locators = this.getSeleniumAccessors(el); 
 			for (var i=0; i<locators.length; i++){ 
 				try{ 
			if(locators[i][1]!="name"){
 					this.getStepObj(locators[i][0], locators[i][1], elementProperties); 
				}
 				} catch(e){} 
 			} 
						try{
		var backgroundcolorofelement=window.getComputedStyle(el, null).getPropertyValue("background-color")
        var colorofelement=window.getComputedStyle(el, null).getPropertyValue("color")

	
		elementProperties["background-color"] = backgroundcolorofelement;
		elementProperties["color"] = colorofelement;
		var rect = el.getBoundingClientRect();
         elementProperties["width"]=(rect.right - rect.left)
         elementProperties["height"]=(rect.bottom - rect.top)
         elementProperties["x"]=rect.left
         elementProperties["y"]=rect.top
 			var imagebase64=_opkey.sendToServer('/_s_/dyn/Driver_getRealtimeObjectImage?width='+rect.width+'&height='+rect.height);
		elementProperties["ObjectImage"] = imagebase64;
		}catch(e){}
				var logicalname=el.nodeName;
			try{
				logicalname=_opkey.getLogicalNameOfObject(el,elementProperties["sahiText"])
				if(typeof logicalname==="object"){
					logicalname=el.nodeName
				}
				}catch(e){}
		if(logicalname.length>25){
			logicalname=logicalname.substring(0, 25);
		}
	this.getStepObj(logicalname, "logicalname", elementProperties);
		try{
			
			if(el.nodeName=="INPUT" || el.nodeName=="TEXTAREA"){
				if(el.maxLength!=-1){
					elementProperties["length"]=el.maxLength
				}
				if(el.placeholder){
					elementProperties["placeholder"]=el.placeholder
				}
			}
			if(el.nodeName=="LI"){
				var parent=el.parentNode;
				var childnodes=parent.childNodes
				for(var k=0;k<childnodes.length;k++){
					if(childnodes[k]==el){
						elementProperties["itemIndex"]=k
						break;
					}
				}
			}
			if(el.nodeName=="UL" || el.nodeName=="SELECT"){
				var count=el.childnodes.length
				elementProperties["itemCount"]=count
			}
		}catch(e){}
 			// Selenium accessors end 
			
					var recordingmode=_opkey.sendToServer("/_s_/dyn/Driver_getRecordingMode");
		if(recordingmode=="SALESFORCE"){
		try{
		var label=_opkey.getMatchingLabelWithTextBoxNDropDown(el);
		if(label){
			elementProperties["label:text"]=label.textContent;
			var labellocators = this.getSeleniumAccessors(label); 
 			for (var li=0; li<labellocators.length; li++){
			  elementProperties["label:"+labellocators[li][1]]=labellocators[li][0]
			}
		}
		if(el.placeholder){
			elementProperties["label:placeholder"] = el.placeholder;
		}
		if(el.aria-label){
			elementProperties["label:arialabel"] = el.el.aria-label;
		}
			}catch(e){
				}
		}
		if(elementProperties["label:text"]){
			elementProperties["logicalname"]=elementProperties["label:text"]
		}
		else if(elementProperties["label:placeholder"]){
			elementProperties["logicalname"]=elementProperties["label:placeholder"]
		}
		else if(elementProperties["label:arialabel"]){
			elementProperties["logicalname"]=elementProperties["label:arialabel"]
		}
			
 			this._framesList = new Array(); 
			this._tempframesList = new Array();
			var htmltitle;
			var titleindex;
 			var doc = el.ownerDocument; 
 			var win = doc.defaultView || doc.parentWindow; 
 			this._getFrames(win);
				        for(var i=0;i<this._framesList.length;i++){
				var parentobject=this._framesList[i]
				if(parentobject["tag"]=="html"){
					htmltitle=parentobject["title"]
					toSendAr["popupName"]=htmltitle;
					titleindex=parentobject["titleindex"]
				}
			}
            for(var j=0;j<this._framesList.length;j++){
				var parentobject=this._framesList[j]
					parentobject["title"]=htmltitle;
					parentobject["titleindex"]=titleindex;
					this._tempframesList.push(parentobject)
			}
            this._framesList=this._tempframesList	
 						var parentobject=this._getFinalFramesList();
			if(parentobject==null){
				var opkeywindowid=null;
				opkeywindowid=_opkey.sendToServer("/_s_/dyn/Driver_getFocusedWindowID?");
				if(opkeywindowid==""){
				opkeywindowid=_opkey.windowidentiferontitle;
				}
				var probject=new Object();
				probject["tag"]="HTML";
				probject["type"]="html page";
				probject["title"]=_opkey.getTitle().replace(/{/g, '').replace(/}/g, '');
				probject["url"]=_opkey.getURL().replace(/{/g, '').replace(/}/g, '').replace(/\"/g, "&#x0022;");;
				probject["titleindex"]=_opkey.sendToServer("/_s_/dyn/Driver_getPageTitleIndex?id="+opkeywindowid+"&title="+encodeURIComponent(_opkey.getTitle().replace(/\"/g, "&#x0022;").replace("'","&#x0027;")));
				parentobject=probject;
			}
 			elementProperties["parent"] = parentobject;
 			if(el.nodeName=="TD" || el.nodeName=="TR"){
				while (el.parentNode) {
              	if(el.nodeName=="TABLE"){
			var tableobject=new Object()
			tableobject["tag"]=el.nodeName
			tableobject["type"]="table"
			tableobject["id"]=el.id
			tableobject["name"]=el.name
			tableobject["class"]=el.className
			elementProperties["parent"] = tableobject
			break;
					}
					el = el.parentNode;
                   }
			}

	
 			toSendAr["arguments"] = [elementProperties, dataArguments];
			

 		 var retdata=FJSON.stringify(toSendAr)
		 				var tempscript=null;
	try{
		tempscript=retdata;
		var tempobject=toSendAr;
		tempobject.arguments[0].ObjectImage=null;
		tempobject.arguments[0]["parent"]=null;
		for(var key in tempobject.arguments[0]){
			if(tempobject.arguments[0][key]){
			tempobject.arguments[0][key]=removeindex(tempobject.arguments[0][key]);
			}
		}
		if(tempobject["action"]=="click"){
		tempobject.arguments[1]["data"]=null;
		}
		tempscript=JSON.stringify(tempobject)

	}catch(e){
		tempscript=null;
	}

	if(tempscript!=null){
	if (this.hasEventBeenRecorded(tempscript)) {
		return; //IE
	}
	}
	else{
	if (this.hasEventBeenRecorded(retdata)) {
		return; //IE
	}
	}
 		 for(var k=0;k<1000;k++){
 		 retdata = retdata.toString().replace('\\"','"')
 		 retdata = retdata.toString().replace('arguments":"[{','arguments":[{')
 		 retdata = retdata.toString().replace(']"}',']}')
	 }
 		 //console.log(retdata)
 		 //this.sendToServer('/_s_/dyn/' + 'StepWiseRecorder_record?step=' + encodeURIComponent(retdata), false);
		 return retdata;
 	} 
	
	Opkey.prototype.getLogicalNameOfObject=function(el,innertext){
		if(innertext!=null){
			if(innertext!="" && innertext!=" "){
				try{
				return removeindex(parseAlternateProperty(innertext,0))
				}catch(e){}
			}
		}
		
		if(el.name){
			return el.name;
		}
		if(el.id){
			return el.id;
		}
		if(el.className && !el instanceof SVGElement){
			return el.className;
		}
		if(el.alt){
			return el.alt;
		}
		if(el.title){
			return el.title;
		}
		if(el.href){
			return el.href;
		}
		if(el.src){
			return el.src;
		}
		if(el.nodeName){
			return el.nodeName;
		}
	};
	
	
	/* for checking previous sibling */
Opkey.prototype.checkPreviousSibling=function(el,lbl_element,id_Attr_Value){
	var prevSib = el.previousSibling;
		while(prevSib!=null){
		    if(prevSib.nodeType==1){
			var lbl_tag_name = prevSib.tagName;
			if(lbl_element=="LABEL")
				break;
			else{
			if(lbl_tag_name=='LABEL'){
			    if(prevSib.getAttribute){
				var attr_value = prevSib.getAttribute("for");
				if(attr_value!=null){
				if(attr_value==id_Attr_Value){
				    lbl_element = prevSib;
				    break;
				}
				}
			    }
			}
			}
		    }
		    prevSib = prevSib.previousSibling;
		}
	return lbl_element;
};

/* for checking next sibling */
Opkey.prototype.checkNextSibling=function(el,lbl_element,id_Attr_Value){
	var nextSib = el.nextSibling;
		while(nextSib!=null){
		    if(nextSib.nodeType==1){
			var lbl_tag_name = nextSib.tagName;
			if(lbl_element=="LABEL")
				break;
			else{
			if(lbl_tag_name=='LABEL'){
			    if(nextSib.getAttribute){
				var attr_value = nextSib.getAttribute("for");
				if(attr_value!=null){
				if(attr_value==id_Attr_Value){
				    lbl_element = nextSib;
				    break;
				}
				}
			    }
			}
			}
		    }
		    nextSib = nextSib.nextSibling;
		}
	return lbl_element;
};

/* for checking Parent node */
Opkey.prototype.checkParentNode=function(el,lbl_element,id_Attr_Value){
	var iterationrate=0;
	var par_node = el.parentNode;
		while(par_node!=null){
		    //start
			if(iterationrate==5){
				break;
			}
			iterationrate++;
			var allchilds=par_node.getElementsByTagName("*");
			for(var k=0;k<allchilds.length;k++){
			if(allchilds[k].nodeType==1){
			var lbl_tag_name = allchilds[k].tagName;
			if(lbl_element=="LABEL")
				break;
			else{
			if(lbl_tag_name=='LABEL'){
			    if(allchilds[k].getAttribute){
				var attr_value = allchilds[k].getAttribute("for");
				if(attr_value!=null){
				if(attr_value==id_Attr_Value){
					console.log(attr_value);
					console.log(id_Attr_Value);
				    lbl_element = allchilds[k];
				    break;
				}
				}
			    }
			}
			}
		    }
			}
			//end;
		    par_node = par_node.parentNode;
		}
	return lbl_element;
};

/* for checking child node */
Opkey.prototype.checkChildNode=function(el,lbl_element,id_Attr_Value){
	//var child = el.childNodes?el.childNodes:el.children;
	var child=el.getElementsByTagName("*");
	for(var j=0;j<child.length;j++){
		//while(child!=null){
		    if(child[j].nodeType==1){
			var lbl_tag_name = child[j].tagName;
			if(lbl_element=="LABEL")
				break;
			else{
			if(lbl_tag_name=='LABEL'){
			    if(child[j].getAttribute){
				var attr_value = child[j].getAttribute("for");
				if(attr_value!=null){
				if(attr_value==id_Attr_Value){
				    lbl_element = child;
				    break;
				}
				}
			    }
			}
			}
		    }
		  //  child = child.children;
		}
	return lbl_element;
};


/* main function */
Opkey.prototype.getMatchingLabelWithTextBoxNDropDown=function(el){
	var lbl_element = "",lbl_tagname = "",lbl_text = "",id_Attr_Value = "",name_Attr_Value = "",class_Attr_Value = "";
	var clicked_elem = el;
	var tagname = el.tagName;
	var type_of_element = el.getAttribute("type");
	//if((tagname=='INPUT' && (type_of_element.toLowerCase()=='text'||type_of_element.toLowerCase()=='textarea'||type_of_element.toLowerCase()=='phone'||type_of_element.toLowerCase()=='number'||type_of_element.toLowerCase()=='email'||type_of_element.toLowerCase()=='range'))||(tagname=='SELECT')){
	    if(el.getAttribute("id")!=""||el.getAttribute("id")!=null||el.getAttribute("name")!=""||el.getAttribute("name")!=null||el.getAttribute("class")!=""||el.getAttribute("class")!=null){
			id_Attr_Value = el.getAttribute("id");
			name_Attr_Value = el.getAttribute("name");
			class_Attr_Value = el.getAttribute("class");
	    }
	    if(el.previousSibling){
			lbl_element = this.checkPreviousSibling(el,lbl_element,id_Attr_Value);
	    }
	    if(lbl_element==""||lbl_element==null){
			if(el.nextSibling){
				lbl_element = this.checkNextSibling(el,lbl_element,id_Attr_Value);
	    	}
			if(lbl_element==""||lbl_element==null){
				if(el.parentNode){
					lbl_element = this.checkParentNode(el,lbl_element,id_Attr_Value);
				}
				if(lbl_element==""||lbl_element==null){
					if(el.childNodes||el.children){
						lbl_element = this.checkChildNode(el,lbl_element,id_Attr_Value);
					}
	    	    }
	    	}
	    }
	
	if(lbl_element==""){
	    if(type_of_element==""||type_of_element==null){
		if((id_Attr_Value=="") && (name_Attr_Value=="") && (class_Attr_Value==""))
			return null;
		else if((id_Attr_Value=="") && (name_Attr_Value==""))
			return null;
		else if((id_Attr_Value=="") && (class_Attr_Value==""))
			return null;
		else
			return null;
	    }
	    else
			return null;
	}
	else{
	    if(type_of_element==""||type_of_element==null)
			return lbl_element;
	    else
			return lbl_element;
	}
};
	
	
	var date1=new Date();
	var timer1=date1.getTime();
	var timertv=date1.getTime();
	var setvalueflag=false;
	Opkey.prototype.getScript = function (infoAr, el, evType, e) {
		//console.log("Tag name "+el.nodeName)

	    if(el.id.indexOf("IGNOREINOPKEYRECORDER")>-1){	
			return;
		}
		try{
		el.classList.remove("OPkeyHighlighter")
		}catch(e){
			
		}
		if(!((el.nodeName=="A") || (el.nodeName=="IMG") || (el.nodeName=="INPUT") || (el.nodeName=="BUTTON"))){
			//console.log("Running code") 
		 		try{
         var el2=el
         var i=0;
         var k1=0;
         var runloop=true

//comment from here
		 try{
		 if(el2.nodeName=="LABEL"){
		var siblings=el2.parentNode.getElementsByTagName("INPUT");
		var forattribute=null;
		try{
		forattribute=el2.getAttribute("for");
		}catch(e){
		}
		for(var sb=0;siblings.length;sb++){
			var node=siblings[sb]
		if(node.nodeName=="A" || node.nodeName=="INPUT" || node.nodeName=="BUTTON"){
			if(forattribute!=null){
				
				if(node.id==forattribute){
					if(node.nodeName=="INPUT"){
						if(node.type=="text" || node.type=="search" || node.type=="email" || node.type=="password" || node.type=="tel" || node.type=="number"){
							break;
						}
					}
				var elInfo2 = this.identify(node);
	            var ids2 = elInfo2.apis; 
	            infoAr=ids2
				el=node
				runloop=false
				break; 
				}
			}
			 }
		}
		 }
		 }catch(e){}
		 try{
        if(el2.parentNode!=null){
			if(el2.parentNode.nodeName=="LABEL"){
			var forattribute=null;
		try{
		forattribute=el2.getAttribute("for");
		}catch(e){
		}
		var siblings=el2.parentNode.getElementsByTagName("INPUT");
		for(var sb=0;siblings.length;sb++){
			var node=siblings[sb]
		if(node.nodeName=="INPUT" || node.nodeName=="BUTTON"){
			if(forattribute!=null){
				if(node.id==forattribute){
				var elInfo2 = this.identify(node);
	            var ids2 = elInfo2.apis; 
	            infoAr=ids2
				el=node
				runloop=false
				break; 
			 }
		   }
		}
		}
		}
		}
		 }catch(e){}
		 
		 if(runloop){
			 		 try{
        if(el2.parentNode.parentNode!=null){
			if(el2.parentNode.parentNode.nodeName=="LABEL"){
		var forattribute=null;
		try{
		forattribute=el2.getAttribute("for");
		}catch(e){
		}
		var siblings=el2.parentNode.parentNode.getElementsByTagName("INPUT");
		for(var sb=0;siblings.length;sb++){
			var node=siblings[sb]
		if(node.nodeName=="A" || node.nodeName=="INPUT" || node.nodeName=="BUTTON"){
						if(forattribute!=null){
				if(node.id==forattribute){
				var elInfo2 = this.identify(node);
	            var ids2 = elInfo2.apis; 
	            infoAr=ids2
				el=node
				runloop=false
				break; 
			 }
						}
		}
		}
		}
		}
		 }catch(e){}
		 }
// comment upto here
         if(runloop){
         while(i<10){
			 el2=el2.parentNode
			 if(el2!=null){
			 if(el2.nodeName=="A" || el2.nodeName=="INPUT" || el2.nodeName=="BUTTON"){
				var elInfo2 = this.identify(el2);
	            var ids2 = elInfo2.apis; 
	            infoAr=ids2
				el=el2
				break; 
			 }
			 }
			 else{
				 break;
			 }
			 i++;
		 }
	 }
	}catch(e){}
}


 		//if(document.domain != "rediff.com" && e.type == "blur") return; 
 		var popupName = this.getPopupName(); 
 		//this._debug("evType" + evType + "   :el:  " + el ); 
 		var toSendAr = new Object(); 
 		var accessorArr; 
 		var winArr; 
 		if(evType == "focusout") {
 			if(el.nodeName == "INPUT") {
 				this.triggerEvent(el, "change");
 			}
 			else return;		
 		}
 		if(infoAr.length > 0){ 
 			var info = infoAr[0]; 
 			var action = info.event.replace(/^_/, '');	

		if(action.search("click")>-1 || action.search("setSelected")>-1){
		var date2=new Date();
	    var timer2=date2.getTime();
		if((timer2-timer1)<900){
			return;
		}
		else{
			timer1=timer2
		}
		}
if(action.search("setValue")>-1){
	if(setvalueflag==true){
		var date2=new Date();
	    var timer2=date2.getTime();
		if((timer2-timertv)<400){
			setvalueflag=false;
			return;
		}
			else{
			timertv=timer2
		}
		
		
		//return;
	}
setvalueflag=true
}
else{
	setvalueflag=false;
}

 	var value = null;
if(action==""){
	return;
}
if(action=="setValue" || action=="_setValue"){
	_opkey.textbox=null;
		_opkey.typekeysoccured=false
}
else{
	_opkey.textbox=null;
	_opkey.typekeysoccured=false
}			
 		if (action == "setValue" || action == "setSelected" || action == "setFile"){ 
 				var value = info.value; 
 				////this._debug("info.value:  " +info.value);
 			    if (value == null) value = ""; 
 			    if(value == "") return;
 			    value = this.toJSON(value);
 		}
		if(action=="setSelected" || action==""){
			if(el.nodeName=="OPTION"){
				var tempoption=el;
				action="setSelected"
				el=el.parentNode
				value=tempoption.innerText
				var elInfo = this.identify(el);
	            infoAr = elInfo.apis; 
			}
		}
		
		if(_opkey.otherselectnodefound){
			var value=_opkey._getSelectedText(el) || _opkey.getOptionId(el, el.value) || el.value;
			value = this.toJSON(value);
			_opkey.otherselectnodefound=false;
		}
		try{
	if(el.nodeName=="A"){
		if(el.target){
			if(el.target.toLowerCase()=="_blank"){
				_opkey.sendToServer("/_s_/dyn/Driver_setBlankWindowsOpened");
			}
		}
	}	
		}catch(e){}			
 			var elProp = this.getAD(el); 
 			var elPropEnd = false; 
 			if(elProp.length > 0){ 
 				var elPropLength = elProp.length; 
 				 
 				for(var elPropLen = 0; elPropLen < elPropLength; elPropLen ++) { 
 					//this._debug("22: " + elProp[elPropLen].tag + ";" + elProp[elPropLen].type + ";" + e.type + ";" + elProp[elPropLen].event); 
 					var elEvents = elProp[elPropLen].event.split("__xxSAHIDIVIDERxx__"); 
 					if(!this.arrayContains(elEvents, e.type)) continue; 
 					else{ 
 						elPropEnd = true; 
 						var actionIndex = this.arrayIndexOf(elEvents, e.type); 
 						var actionEvents = elProp[0].action.split("__xxSAHIDIVIDERxx__"); 
 						action = actionEvents[actionIndex]; 
 						if(elProp[elPropLen].tag == "DIV") {
 							value = el.innerText; 
 						} 
 					} 
 					if(elPropEnd == true) break; 
 				} 
 			}
		
 			if(elPropEnd == false){
				
			var elPropparent = this.getAD(el.parentNode); 
 			if(elPropparent.length > 0){ 
 				var elPropparentLength = elPropparent.length; 
 				 
 				for(var elPropparentLen = 0; elPropparentLen < elPropparentLength; elPropparentLen ++) { 
 					//this._debug("22: " + elProp[elPropLen].tag + ";" + elProp[elPropLen].type + ";" + e.type + ";" + elProp[elPropLen].event); 
 					var elEvents = elPropparent[elPropparentLen].event.split("__xxSAHIDIVIDERxx__"); 
 					if(!this.arrayContains(elEvents, e.type)) continue; 
 					else{ 
 						elPropEnd = true; 
 						var actionIndex = this.arrayIndexOf(elEvents, e.type); 
 						var actionEvents = elProp[0].action.split("__xxSAHIDIVIDERxx__"); 
 						action = actionEvents[actionIndex]; 
 						if(elPropparent[elPropparentLen].tag == "DIV") {
 							value = el.innerText; 
 						} 
 					} 
 					if(elPropEnd == true) break; 
 				} 
 			}
			}

			//if(elPropEnd==false) return;

			//console.log("Doing")
if(el.nodeName=="SELECT" && el.type=="select-multiple"){
	toSendAr["action"] = "SelectMultipleDropDownItem";
}			
            else if(el.nodeName=="INPUT" && el.type=="password"){
            toSendAr["action"] = "TypeSecureText";
	        }
	 		else{	 
 			toSendAr["action"] = action;
		    } 
			var valueofelement=this.escapeNullValue(value).replace(/\"/g, '').replace(/\[/g,'&squareopen').replace(/\]/g,'&squareclose')
			if(valueofelement==_opkey.textboxtext){
				return;
			}
			if(valueofelement=="e"){
				valueofelement="'"+valueofelement+"'"
			}
			if(valueofelement=="op"){
				valueofelement="'"+valueofelement+"'"
			}
 			var dataArguments = { 
 					"type" : "string", 
 				//	"data" : this.escapeNullValue(value).replace(/\"/g, '').replace(/[\[\]]+/g,'')
				"data" : valueofelement
 		//"data" : this.escapeNullValue(value).replace(/\"/g, '')
		//	"data" : encodeURIComponent(this.escapeNullValue(value))
 			} 
 			//toSendAr["popupName"] = popupName.replace(/\"/g, "&quote;"); 
 			
			var elementProperties = new Object(); 
 			var previousAccessorType = [];
 			var visitedAccessorType = 0;
			try{
			var positionInfo = el.getBoundingClientRect();
            var height = positionInfo.height;
            var width = positionInfo.width;
			}catch(e){

			}
 			var imagebase64=_opkey.sendToServer('/_s_/dyn/Driver_getRealtimeObjectImage?width='+width+'&height='+height);
		
			this.getStepObj(imagebase64, "ObjectImage", elementProperties);
 			for (var i=0; i<infoAr.length; i++){ 
 				try{ 
 					var info = infoAr[i]; 
 					////console.log(info);
 					var accessor = this.escapeDollar(this.getAccessor1(info)); 
 					var accessorType = this.getAccessorType(info); 
 					/*//this._debug("accessorType:  " + accessorType);
 					//this._debug("type:  "+ typeof accessorType + "; "+ previousAccessorType.length);*/
 					for(var j = 0; j < previousAccessorType.length; j++) {
 						if(previousAccessorType[j] == accessorType) visitedAccessorType = 1;
 					}
 					 
 					////this._debug("Accessor Type: " +  accessorType + "; Accessor:" + accessor); 
 					if(visitedAccessorType != 1){
					this.getStepObj(el.innerText.replace(/^\s+|\s+$/g, ''), "sahiText", elementProperties); 
 						this.getStepObj(accessor, accessorType, elementProperties); 
 						previousAccessorType.push(accessorType);
 						////this._debug("recorded:  " + accessorType+ "; Accessor:" + accessor);
 						visitedAccessorType = 0;
 					}
 					else visitedAccessorType = 0;
 						
 					// added by ganesh adding value in element properties
 					if(i == 0){
 						var value = info.value;
 	 					this.getStepObj(value, "value", elementProperties);
 					}
 					
 					//end
 				}catch(e){} 
 			} 
 			var checkstatus=""
 			this.getStepObj(el.tagName, "tag", elementProperties); 
 		    if(el.type=="checkbox")
 	      {
		if(checkstatus==""){
		checkstatus=""+el.checked 
		}
		this.getStepObj(checkstatus, "checked", elementProperties); 
	}
				if(el.nodeName=="SELECT"){
				try{
					if(elementProperties["sahiText"]){
						elementProperties["sahiText"]="";
					}
					if(elementProperties["value"]){
						elementProperties["value"]="";
					}
				}catch(e){}
			}
		var logicalname=el.nodeName;
			try{
				logicalname=_opkey.getLogicalNameOfObject(el,elementProperties["sahiText"])
				if(typeof logicalname==="object"){
					logicalname=el.nodeName
				}
				}catch(e){}
		if(logicalname.length>25){
			logicalname=logicalname.substring(0, 25);
		}
	this.getStepObj(logicalname, "logicalname", elementProperties);
		if(el.nodeName=="TD"){
			this.getStepObj("\""+el.cellIndex+"\"", "column", elementProperties); 
			if(el.parentNode.nodeName=="TR"){
			this.getStepObj("\""+el.parentNode.rowIndex+"\"", "row", elementProperties);
		} 
		}
 			if(typeof el.type != "undefined") this.getStepObj(el.type, "type", elementProperties); 
 			// Selenium accessors start 
 			var locators = this.getSeleniumAccessors(el); 
 			for (var i=0; i<locators.length; i++){ 
 				try{ 
 				//toSendAr[toSendAr.length] = this.getStepObj(action, this.quotedEscapeValue(locators[i][0]), value, "selenium", popupName); 
 				////this._debug(locators[i][0] + ":" + locators[i][1]); 
 			
 			//console.log("Text is "+locators[i][1])
		
			if(locators[i][1]!="name"){
 					this.getStepObj(locators[i][0], locators[i][1], elementProperties); 
				}
			if(locators[i][1]=="link"){
				var linkcon=locators[i][0]
				linkcon=linkcon.replace("link=","")
 					this.getStepObj(linkcon, locators[i][1], elementProperties); 
				}
				
 				} catch(e){} 
 			} 
 			// Selenium accessors end 
		var recordingmode=_opkey.sendToServer("/_s_/dyn/Driver_getRecordingMode");
		if(recordingmode=="SALESFORCE"){
		try{
		var label=_opkey.getMatchingLabelWithTextBoxNDropDown(el);
		if(label){
			elementProperties["label:text"]=label.textContent;
			var labellocators = this.getSeleniumAccessors(label); 
 			for (var li=0; li<labellocators.length; li++){
			  elementProperties["label:"+labellocators[li][1]]=labellocators[li][0]
			}
		}
		if(el.placeholder){
			elementProperties["label:placeholder"] = el.placeholder;
		}
		if(el.aria-label){
			elementProperties["label:arialabel"] = el.el.aria-label;
		}
			}catch(e){
				}
		}
		if(elementProperties["label:text"]){
			elementProperties["logicalname"]=elementProperties["label:text"]
		}
		else if(elementProperties["label:placeholder"]){
			elementProperties["logicalname"]=elementProperties["label:placeholder"]
		}
		else if(elementProperties["label:arialabel"]){
			elementProperties["logicalname"]=elementProperties["label:arialabel"]
		}
 			this._framesList = new Array();
            this._tempframesList = new Array(); 			
			var htmltitle;
			var titleindex;
 			var doc = el.ownerDocument; 
 			var win = doc.defaultView || doc.parentWindow; 
			
 			this._getFrames(win);
			if(this._framesList.length>1000){
				var singleframe=this._framesList[0];
				this._framesList=new Array();
				this._framesList.push(singleframe);
			}
	        for(var i=0;i<this._framesList.length;i++){
				var parentobject=this._framesList[i]
				if(parentobject["tag"]=="html"){
					htmltitle=parentobject["title"]
					toSendAr["popupName"]=htmltitle
					titleindex=parentobject["titleindex"]
				}
			}
            for(var j=0;j<this._framesList.length;j++){
				var parentobject=this._framesList[j]
					parentobject["title"]=htmltitle;
					parentobject["titleindex"]=titleindex;
					this._tempframesList.push(parentobject)
			}
            this._framesList=this._tempframesList;
			var parentobject=this._getFinalFramesList();
			if(parentobject==null){
				var opkeywindowid=null;
				opkeywindowid=_opkey.sendToServer("/_s_/dyn/Driver_getFocusedWindowID?");
				if(opkeywindowid==""){
				opkeywindowid=_opkey.windowidentiferontitle;
				}
				var probject=new Object();
				probject["tag"]="HTML";
				probject["type"]="html page";
				probject["title"]=_opkey.getTitle();
				probject["url"]=_opkey.getURL().replace(/{/g, '').replace(/}/g, '').replace(/\"/g, "&#x0022;");
				probject["titleindex"]=_opkey.sendToServer("/_s_/dyn/Driver_getPageTitleIndex?id="+opkeywindowid+"&title="+encodeURIComponent(_opkey.getTitle().replace(/\"/g, "&#x0022;").replace("'","&#x0027;")));
				parentobject=probject;
			}
			if(parentobject["title"]==null){
				parentobject["title"]=_opkey.getTitle();
			}
			if(parentobject["titleindex"]==null){
				var opkeywindowid=null;
				opkeywindowid=_opkey.sendToServer("/_s_/dyn/Driver_getFocusedWindowID?");
				if(opkeywindowid==""){
				opkeywindowid=_opkey.windowidentiferontitle;
				}
				parentobject["titleindex"]=_opkey.sendToServer("/_s_/dyn/Driver_getPageTitleIndex?id="+opkeywindowid+"&title="+encodeURIComponent(_opkey.getTitle().replace(/\"/g, "&#x0022;").replace("'","&#x0027;")));
			}
 			elementProperties["parent"] = parentobject;
			if(elementProperties["className"]!=null){
			elementProperties["className"]=elementProperties["className"].replace(" OPkeyHighlighter","").replace("OPkeyHighlighter","")
			}
		if(elementProperties["sahiText"]!=null){
			if(elementProperties["sahiText"].length>200){
			elementProperties["sahiText"]=elementProperties["sahiText"].substring(0, 199);
			}
		}
 			toSendAr["arguments"] = [elementProperties, dataArguments]; 
  		}			 

 		 
 		 
 		 var retdata=FJSON.stringify(toSendAr)
 		 for(var k=0;k<1000;k++){
 		 retdata = retdata.toString().replace('\\"','"')
 		 retdata = retdata.toString().replace('arguments":"[{','arguments":[{')
 		 retdata = retdata.toString().replace(']"}',']}')
	 }
 		 //console.log(retdata)
 		 
 		return retdata; 
 	} 

	
		Opkey.prototype.getOpkeyDummyCustomScript = function (infoAr, el, evType, e) {
		//console.log("Tag name "+el.nodeName)

	    if(el.id.indexOf("IGNOREINOPKEYRECORDER")>-1){	
			return;
		}
		try{
		el.classList.remove("OPkeyHighlighter")
		}catch(e){
			
		}

 		//if(document.domain != "rediff.com" && e.type == "blur") return; 
 		var popupName = this.getPopupName(); 
 		//this._debug("evType" + evType + "   :el:  " + el ); 
 		var toSendAr = new Object(); 
 		var accessorArr; 
 		var winArr; 
 		if(evType == "focusout") {
 			if(el.nodeName == "INPUT") {
 				this.triggerEvent(el, "change");
 			}
 			else return;		
 		}
 		if(infoAr.length > 0){ 
 			var info = infoAr[0]; 
 			var action = info.event.replace(/^_/, '');
 			var value = null;

if(action=="setValue" || action=="_setValue"){
	_opkey.textbox=null;
		_opkey.typekeysoccured=false
}
else{
	_opkey.textbox=null;
	_opkey.typekeysoccured=false
}			
 		if (action == "setValue" || action == "setSelected" || action == "setFile"){ 
 				var value = info.value; 
 				////this._debug("info.value:  " +info.value);
 			    if (value == null) value = ""; 
 			    if(value == "") return;
 			    value = this.toJSON(value); 
 		}
		if(action=="setSelected" || action==""){
			if(el.nodeName=="OPTION"){
				var tempoption=el;
				action="setSelected"
				el=el.parentNode
				value=tempoption.innerText
				var elInfo = this.identify(el);
	            infoAr = elInfo.apis; 
			}
		}	
 			var elProp = this.getAD(el); 
 			var elPropEnd = false; 
 			if(elProp.length > 0){ 
 				var elPropLength = elProp.length; 
 				 
 				for(var elPropLen = 0; elPropLen < elPropLength; elPropLen ++) { 
 					//this._debug("22: " + elProp[elPropLen].tag + ";" + elProp[elPropLen].type + ";" + e.type + ";" + elProp[elPropLen].event); 
 					var elEvents = elProp[elPropLen].event.split("__xxSAHIDIVIDERxx__"); 
 					if(!this.arrayContains(elEvents, e.type)) continue; 
 					else{ 
 						elPropEnd = true; 
 						var actionIndex = this.arrayIndexOf(elEvents, e.type); 
 						var actionEvents = elProp[0].action.split("__xxSAHIDIVIDERxx__"); 
 						action = actionEvents[actionIndex]; 
 						if(elProp[elPropLen].tag == "DIV") {
 							value = el.innerText; 
 						} 
 					} 
 					if(elPropEnd == true) break; 
 				} 
 			}
		
 			if(elPropEnd == false){
				
			var elPropparent = this.getAD(el.parentNode); 
 			if(elPropparent.length > 0){ 
 				var elPropparentLength = elPropparent.length; 
 				 
 				for(var elPropparentLen = 0; elPropparentLen < elPropparentLength; elPropparentLen ++) { 
 					//this._debug("22: " + elProp[elPropLen].tag + ";" + elProp[elPropLen].type + ";" + e.type + ";" + elProp[elPropLen].event); 
 					var elEvents = elPropparent[elPropparentLen].event.split("__xxSAHIDIVIDERxx__"); 
 					if(!this.arrayContains(elEvents, e.type)) continue; 
 					else{ 
 						elPropEnd = true; 
 						var actionIndex = this.arrayIndexOf(elEvents, e.type); 
 						var actionEvents = elProp[0].action.split("__xxSAHIDIVIDERxx__"); 
 						action = actionEvents[actionIndex]; 
 						if(elPropparent[elPropparentLen].tag == "DIV") {
 							value = el.innerText; 
 						} 
 					} 
 					if(elPropEnd == true) break; 
 				} 
 			}
			}

			//if(elPropEnd==false) return;

			//console.log("Doing")
if(el.nodeName=="SELECT" && el.type=="select-multiple"){
	toSendAr["action"] = "SelectMultipleDropDownItem";
}			
            else if(el.nodeName=="INPUT" && el.type=="password"){
            toSendAr["action"] = "TypeSecureText";
	        }
	 		else{	 
 			toSendAr["action"] = action;
		    } 
			var valueofelement=this.escapeNullValue(value).replace(/\"/g, '').replace(/\[/g,'&squareopen').replace(/\]/g,'&squareclose')
			if(valueofelement==_opkey.textboxtext){
				return;
			}
			if(valueofelement=="e"){
				valueofelement="'"+valueofelement+"'"
			}
 			var dataArguments = { 
 					"type" : "string", 
 				//	"data" : this.escapeNullValue(value).replace(/\"/g, '').replace(/[\[\]]+/g,'')
				"data" : valueofelement
 		//"data" : this.escapeNullValue(value).replace(/\"/g, '')
		//	"data" : encodeURIComponent(this.escapeNullValue(value))
 			} 
 			//toSendAr["popupName"] = popupName.replace(/\"/g, "&quote;"); 
 			
			var elementProperties = new Object(); 
 			var previousAccessorType = [];
 			var visitedAccessorType = 0;
			try{
			var positionInfo = el.getBoundingClientRect();
            var height = positionInfo.height;
            var width = positionInfo.width;
			}catch(e){

			}
 			for (var i=0; i<infoAr.length; i++){ 
 				try{ 
 					var info = infoAr[i]; 
 					////console.log(info);
 					var accessor = this.escapeDollar(this.getAccessor1(info)); 
 					var accessorType = this.getAccessorType(info); 
 					/*//this._debug("accessorType:  " + accessorType);
 					//this._debug("type:  "+ typeof accessorType + "; "+ previousAccessorType.length);*/
 					for(var j = 0; j < previousAccessorType.length; j++) {
 						if(previousAccessorType[j] == accessorType) visitedAccessorType = 1;
 					}
 					 
 					////this._debug("Accessor Type: " +  accessorType + "; Accessor:" + accessor); 
 					if(visitedAccessorType != 1){
					this.getStepObj(el.innerText.replace(/^\s+|\s+$/g, ''), "sahiText", elementProperties); 
 						this.getStepObj(accessor, accessorType, elementProperties); 
 						previousAccessorType.push(accessorType);
 						////this._debug("recorded:  " + accessorType+ "; Accessor:" + accessor);
 						visitedAccessorType = 0;
 					}
 					else visitedAccessorType = 0;
 						
 					// added by ganesh adding value in element properties
 					if(i == 0){
 						var value = info.value;
 	 					this.getStepObj(value, "value", elementProperties);
 					}
 					
 					//end
 				}catch(e){} 
 			} 
 			var checkstatus=""
 			this.getStepObj(el.tagName, "tag", elementProperties); 
 		    if(el.type=="checkbox")
 	      {
		if(checkstatus==""){
		checkstatus=""+el.checked 
		}
		this.getStepObj(checkstatus, "checked", elementProperties); 
	}
				if(el.nodeName=="SELECT"){
				try{
					if(elementProperties["sahiText"]){
						elementProperties["sahiText"]="";
					}
					if(elementProperties["value"]){
						elementProperties["value"]="";
					}
				}catch(e){}
			}
		var logicalname=el.nodeName;
			try{
				logicalname=_opkey.getLogicalNameOfObject(el,elementProperties["sahiText"])
				if(typeof logicalname==="object"){
					logicalname=el.nodeName
				}
				}catch(e){}
		if(logicalname.length>25){
			logicalname=logicalname.substring(0, 25);
		}
	this.getStepObj(logicalname, "logicalname", elementProperties);
		if(el.nodeName=="TD"){
			this.getStepObj("\""+el.cellIndex+"\"", "column", elementProperties); 
			if(el.parentNode.nodeName=="TR"){
			this.getStepObj("\""+el.parentNode.rowIndex+"\"", "row", elementProperties);
		} 
		}
 			if(typeof el.type != "undefined") this.getStepObj(el.type, "type", elementProperties); 
 			// Selenium accessors start 
 			var locators = this.getSeleniumAccessors(el); 
 			for (var i=0; i<locators.length; i++){ 
 				try{ 
 				//toSendAr[toSendAr.length] = this.getStepObj(action, this.quotedEscapeValue(locators[i][0]), value, "selenium", popupName); 
 				////this._debug(locators[i][0] + ":" + locators[i][1]); 
 			
 			//console.log("Text is "+locators[i][1])
		
			if(locators[i][1]!="name"){
 					this.getStepObj(locators[i][0], locators[i][1], elementProperties); 
				}
			if(locators[i][1]=="link"){
				var linkcon=locators[i][0]
				linkcon=linkcon.replace("link=","")
 					this.getStepObj(linkcon, locators[i][1], elementProperties); 
				}
				
 				} catch(e){} 
 			} 
 			// Selenium accessors end 
 			this._framesList = new Array();
            this._tempframesList = new Array(); 			
			var htmltitle;
			var titleindex;
 			var doc = el.ownerDocument; 
 			var win = doc.defaultView || doc.parentWindow; 
 			this._getFrames(win);		
	        for(var i=0;i<this._framesList.length;i++){
				var parentobject=this._framesList[i]
				if(parentobject["tag"]=="html"){
					htmltitle=parentobject["title"]
					toSendAr["popupName"]=htmltitle
					titleindex=parentobject["titleindex"]
				}
			}
            for(var j=0;j<this._framesList.length;j++){
				var parentobject=this._framesList[j]
					parentobject["title"]=htmltitle;
					parentobject["titleindex"]=titleindex;
					this._tempframesList.push(parentobject)
			}
            this._framesList=this._tempframesList			
 						var parentobject=this._getFinalFramesList();
			if(parentobject==null){
				var opkeywindowid=null;
				opkeywindowid=_opkey.sendToServer("/_s_/dyn/Driver_getFocusedWindowID?");
				if(opkeywindowid==""){
				opkeywindowid=_opkey.windowidentiferontitle;
				}
				var probject=new Object();
				probject["tag"]="HTML";
				probject["type"]="html page";
				probject["title"]=_opkey.getTitle();
				probject["url"]=_opkey.getURL().replace(/{/g, '').replace(/}/g, '').replace(/\"/g, "&#x0022;");
				probject["titleindex"]=_opkey.sendToServer("/_s_/dyn/Driver_getPageTitleIndex?id="+opkeywindowid+"&title="+encodeURIComponent(_opkey.getTitle().replace(/\"/g, "&#x0022;").replace("'","&#x0027;")));
				parentobject=probject;
			}
 			elementProperties["parent"] = parentobject;
			if(elementProperties["className"]!=null){
			elementProperties["className"]=elementProperties["className"].replace(" OPkeyHighlighter","").replace("OPkeyHighlighter","")
			}
			
 			toSendAr["arguments"] = [elementProperties, dataArguments]; 
  		}			 

 		 
 		 
 		 var retdata=FJSON.stringify(toSendAr)
 		 //console.log(retdata)
 		 
 		return retdata; 
 	} 
	
	
	
	Opkey.prototype.getSeleniumAccessors = function(el) {
		var locators = [];
		try {
			var l = new LocatorBuilders(window);
		//	LocatorBuilders.order = ['id', 'link', 'name', 'dom:name', 'xpath:link', 'xpath:img','xpath:attributes', 'xpath:href', 'dom:index', 'xpath:position'];
			locators = l.buildAll(el);
		} catch (e) {
		}
		return locators;
	}
	Opkey.prototype.escapeDollar = function(s) {
		return s;
		if (s == null)
			return null;
		return s.replace(/[$]/g, "\\$");
	}
	Opkey.prototype.queuedMouseOver = function() {
		var el = this.__lastMousedOverElement;

		var lastRelationElement = this
				.getServerVarNew("__opkey__lastIdentifiedRelation");
		this.setParentElementForRelation(lastRelationElement);
		try {
			this.identifyAndDisplay(el);
			var controlWin = this.getController();
			if (controlWin && !controlWin.closed) {
				controlWin.clearUpDownHistory();
			}
		} catch (e) {
		}
	}
	Opkey.prototype.getServerVarNew = function(name, isGlobal) {
		var v = this.sendToServer("/_s_/dyn/SessionState_getVar?name="
				+ this.encode(name) + "&isglobal=" + (isGlobal ? 1 : 0));
		return this.withoutQuotedEscapeValue(decodeURIComponent(v));
	};
	Opkey.prototype.withoutQuotedEscapeValue = function(s) {
		return this.withoutQuoted(this.escapeValue(s));
	};
	Opkey.prototype.withoutQuoted = function(s) {
		return s.replace(/"/g, '\\"').replace(new RegExp("\\+", "g"), ' ');
	};
	Opkey.prototype.escapeForScript = function(s) {
		if (typeof s == "number")
			return s;
		return this.withoutQuotedEscapeValue(s);
	}
	Opkey.prototype.setAnchor = function(s) {
		this.anchorStr = s;
		try {
			this.anchor = eval(this.addOpkey(s).replace(new RegExp("\\+", "g"),
					' ').replace(/\\"/g, '"'));
		} catch (e) {
		}
	}
	Opkey.prototype.getAccessor1 = function(info, type) {
		if (info == null)
			return null;
		if ("" == ("" + info.shortHand) || info.shortHand == null)
			return null;
		this.lastIdentifiedElementType = info.type;
		var accessor;
		if (type == "identify") {
			var accessorType = this.getAccessorType(info);
			accessor = info.type + "(" + this.escapeForScript(info.shortHand)
					+ ")__xxSAHIDIVIDERxx__" + accessorType;
		} else
			accessor = this.escapeForScript(info.shortHand);
		/*if (typeof accessor == "string" && accessor.indexOf("_") == 0)
			accessor = accessor.substring(1);*/
		if (type == "identify" && info.relationStr)
			this.lastIdentifiedRelation = info.relationStr;
		else
			this.lastIdentifiedRelation = null;
		return accessor;
	};
	Opkey.prototype.setParentElementForRelation = function(parentEl) {
		if (parentEl != null) {
			this.setAnchor(parentEl);
		}
		return true;
	};
	Opkey.prototype.domToJSON = function(el) {
		var s = new Object();
		var f = "";
		var j = 0;
		if (typeof el == "array") {
			for (var i = 0; i < el.length; i++) {
				s[i] = el[i];
			}
		}
		if (typeof el == "object") {
			for ( var i in el) {
				try {
					if (el[i] && el[i] != el) {
						if (("" + el[i]).indexOf("function") == 0) {
						} else {
							if (typeof el[i] == "object"
									&& el[i] != el.parentNode) {
								s[i] = "{{" + el[i].replace(/object /g, "")
										+ "}}";
							}
							s[i] = el[i];
							j++;
						}
					}
				} catch (e) {
					//s += "" + i + ",";
				}
			}
		}
		//this._debug(JSON.stringify(s));
		return JSON.stringify(s);
	};
	
	if(_opkey._isSafari()){
			var originalStringify = JSON.stringify;
			JSON.stringify = function(obj) {
				var seen = [];
	
				var result = originalStringify(obj, function(key, val) {
					//to support IE8 added by ganesh
					if (!window.HTMLElement)
						HTMLElement = window.Element;
	
					if (!Array.prototype.indexOf) {
						Array.prototype.indexOf = function(elt , from) {
							var len = this.length >>> 0;
	
							var from = Number(arguments[1]) || 0;
							from = (from < 0) ? Math.ceil(from) : Math.floor(from);
							if (from < 0)
								from += len;
	
							for (; from < len; from++) {
								if (from in this && this[from] === elt)
									return from;
							}
							return -1;
						};
					}
					//end
					if (val instanceof HTMLElement) {
						return val.outerHTML
					}
					if (typeof val == "object") {
						if (seen.indexOf(val) >= 0) {
							return null;
						}
						seen.push(val);
					}
					return val;
				});
				return result;
			};
	}


							_opkey.sendToServer("/_s_/dyn/Driver_setDom?element="
				+ encodeURIComponent("reset"));
	
	            function parseAlternateProperty(input, flag) {

                // flag:0  replace with single quote
                //flag:3 do not push data
				if(input.charAt(0)=="_"){
                input = "" + input;
                var init = input.indexOf('(');
                var fin = input.indexOf(')');
                var out = input.substr(init + 1, fin - init - 1);
                if (out != "") {
                    if (input != null) {
                        if (flag == 0) {
                            input = input.replace("(", "('");
                            input = input.replace(")", "')");
                        }
                        var a = { Action: input };

                    }
                    return out;
                }
                else {
                    if (input == "undefined") {
                        return null;
                    }
                    else {
                        return input;
                    }
                }
				}
				else{
					return input;
				}
            }
	
	
	Opkey.prototype.sendIdentifierInfo = function(accessors, escapedAccessor,
			escapedValue, popupName, assertions, el,cantakeimage) {

			//console.log("part 0")
					try{
		//el.classList.remove("OPkeyHighlighter")
		}catch(e){
			
		}
		var assertions = this.identify(el).assertions;
		var elementProperties=new Object()
		elementProperties["tagName"]=el.nodeName
		for (var i = 0; i < accessors.length; i++) {
			var accessorPart = accessors[i].split("__xxSAHIDIVIDERxx__");
			if(elementProperties[accessorPart[1]]==null){
						try{
						if(accessorPart[1]=="sahiText"){
							accessorPart[0]=parseAlternateProperty(el.innerText,0)
						}
					}catch(e){}
			elementProperties[accessorPart[1]] = accessorPart[0];
		}
		}

		//console.log("part 1")
		var locators = this.getSeleniumAccessors(el);
		var selAccessors = [];
		for (var i = 0; i < locators.length; i++) {
			if(locators[i][1]!="name"){
			this.getStepObj(locators[i][0], locators[i][1], elementProperties);
		}
		}
		var logicalname=el.nodeName;
			try{
				logicalname=_opkey.getLogicalNameOfObject(el,elementProperties["sahiText"])
				if(typeof logicalname==="object"){
					logicalname=el.nodeName
				}
				}catch(e){}
		if(logicalname.length>25){
			logicalname=logicalname.substring(0, 25);
		}
         elementProperties["logicalname"]=logicalname
		//console.log("part 2")
			if(el.nodeName=="TD"){
				this.getStepObj("\""+el.cellIndex+"\"", "column", elementProperties); 
			if(el.parentNode.nodeName=="TR"){
			this.getStepObj("\""+el.parentNode.rowIndex+"\"", "row", elementProperties); 
		} 
		}
		//console.log("part 3")
			try{
		var backgroundcolorofelement=window.getComputedStyle(el, null).getPropertyValue("background-color")
        var colorofelement=window.getComputedStyle(el, null).getPropertyValue("color")

	
		elementProperties["background-color"] = backgroundcolorofelement;
		elementProperties["color"] = colorofelement;
		var rect = el.getBoundingClientRect();
         elementProperties["width"]=(rect.right - rect.left)
         elementProperties["height"]=(rect.bottom - rect.top)
         elementProperties["x"]=rect.left
         elementProperties["y"]=rect.top
		 if(cantakeimage!=1){
 			var imagebase64=_opkey.sendToServer('/_s_/dyn/Driver_getRealtimeObjectImage?width='+rect.width+'&height='+rect.height);
		elementProperties["ObjectImage"] = imagebase64;
		 }
		}catch(e){}
		try{
			
			if(el.nodeName=="INPUT" || el.nodeName=="TEXTAREA"){
				if(el.maxLength!=-1){
					elementProperties["length"]=el.maxLength
				}
				if(el.placeholder){
					elementProperties["placeholder"]=el.placeholder
				}
			}
			if(el.nodeName=="LI"){
				var parent=el.parentNode;
				var childnodes=parent.childNodes
				for(var k=0;k<childnodes.length;k++){
					if(childnodes[k]==el){
						elementProperties["itemIndex"]=k
						break;
					}
				}
			}
			if(el.nodeName=="UL" || el.nodeName=="SELECT"){
				var count=el.childnodes.length
				elementProperties["itemCount"]=count
			}
		}catch(e){}
		var recordingmode=_opkey.sendToServer("/_s_/dyn/Driver_getRecordingMode");
		if(recordingmode=="SALESFORCE"){
		try{
		var label=_opkey.getMatchingLabelWithTextBoxNDropDown(el);
		if(label){
			elementProperties["label:text"]=label.textContent;
			var labellocators = this.getSeleniumAccessors(label); 
 			for (var li=0; li<labellocators.length; li++){
			  elementProperties["label:"+labellocators[li][1]]=labellocators[li][0]
			}
		}
		if(el.placeholder){
			elementProperties["label:placeholder"] = el.placeholder;
		}
		if(el.aria-label){
			elementProperties["label:arialabel"] = el.el.aria-label;
		}
			}catch(e){
				}
		if(elementProperties["label:text"]){
			elementProperties["logicalname"]=elementProperties["label:text"]
		}
		else if(elementProperties["label:placeholder"]){
			elementProperties["logicalname"]=elementProperties["label:placeholder"]
		}
		else if(elementProperties["label:arialabel"]){
			elementProperties["logicalname"]=elementProperties["label:arialabel"]
		}
		}
		elementProperties["value"] = escapedValue;
		elementProperties["type"] = el.type;
		elementProperties["relation"] = this.escapeNullValue(this.lastIdentifiedRelation);
		//console.log("part 4")
		this._framesList = new Array();
		this._tempframesList = new Array(); 
		var htmltitle;
		var titleindex;
		var doc = el.ownerDocument;
		var win = doc.defaultView || doc.parentWindow;
 			this._getFrames(win);
			if(this._framesList.length>1000){
				var singleframe=this._framesList[0];
				this._framesList=new Array();
				this._framesList.push(singleframe);
			}
	        for(var i=0;i<this._framesList.length;i++){
				var parentobject=this._framesList[i]
				if(parentobject["tag"]=="html"){
					htmltitle=parentobject["title"]
					titleindex=parentobject["titleindex"]
				}
			}
            for(var j=0;j<this._framesList.length;j++){
				var parentobject=this._framesList[j]
					parentobject["title"]=htmltitle;
					parentobject["titleindex"]=titleindex;
					this._tempframesList.push(parentobject)
			}
            this._framesList=this._tempframesList;
			var parentobject=this._getFinalFramesList();
			if(parentobject==null){
				var opkeywindowid=null;
				opkeywindowid=_opkey.sendToServer("/_s_/dyn/Driver_getFocusedWindowID?");
				if(opkeywindowid==""){
				opkeywindowid=_opkey.windowidentiferontitle;
				}
				var probject=new Object();
				probject["tag"]="HTML";
				probject["type"]="html page";
				probject["title"]=_opkey.getTitle();
				probject["url"]=_opkey.getURL().replace(/{/g, '').replace(/}/g, '').replace(/\"/g, "&#x0022;");
				probject["titleindex"]=_opkey.sendToServer("/_s_/dyn/Driver_getPageTitleIndex?id="+opkeywindowid+"&title="+encodeURIComponent(_opkey.getTitle().replace(/\"/g, "&#x0022;").replace("'","&#x0027;")));
				parentobject=probject;
			}
			if(parentobject["title"]==null){
				parentobject["title"]=_opkey.getTitle();
			}
			if(parentobject["titleindex"]==null){
				var opkeywindowid=null;
				opkeywindowid=_opkey.sendToServer("/_s_/dyn/Driver_getFocusedWindowID?");
				if(opkeywindowid==""){
				opkeywindowid=_opkey.windowidentiferontitle;
				}
				parentobject["titleindex"]=_opkey.sendToServer("/_s_/dyn/Driver_getPageTitleIndex?id="+opkeywindowid+"&title="+encodeURIComponent(_opkey.getTitle().replace(/\"/g, "&#x0022;").replace("'","&#x0027;")));
			}
 			elementProperties["parent"] = parentobject;

		//NEON
		//console.log("Part 6")

		if(elementProperties["className"]!=null){
	elementProperties["className"]=elementProperties["className"].replace(" OPkeyHighlighter","").replace("OPkeyHighlighter","")
		}
		if(elementProperties["href"]!=null){
			elementProperties["href"]=elementProperties["href"].replace(/\"/g, "&#x0022;").replace("'","&#x0027;");
		}
		var toSendAr = FJSON.stringify(elementProperties);
 		 for(var k=0;k<1000;k++){
 		 toSendAr = toSendAr.toString().replace('\\"','"')
 		 toSendAr = toSendAr.toString().replace('arguments":"[{','arguments":[{')
 		 toSendAr = toSendAr.toString().replace(']"}',']}')
	 }
	 //console.log("Part 7")
		this.sendToServer("/_s_/dyn/Driver_setLastIdentifiedElement?element="
				+ encodeURIComponent(toSendAr));
	};
	Opkey.prototype.getAccessorType = function(info) {
		if (info == null)
			return null;
		if ("" == ("" + info.accessorType) || info.accessorType == null)
			return null;
		var accessor = (typeof info.accessorType == "function") ? "url"
				: info.accessorType;
		return accessor;
	};
	//	Opkey.prototype.openWin = function(){};
	//	Opkey.prototype.openController = function(){};	
	_opkey.language = {
		ASSERT_EXISTS : "assertExists__xxSAHIDIVIDERxx__<accessor>__xxSAHIDIVIDERxx__",
		ASSERT_VISIBLE : "assertVisible__xxSAHIDIVIDERxx__<accessor>__xxSAHIDIVIDERxx__",
		//ASSERT_EQUAL_TEXT: "assertEqual__xxSAHIDIVIDERxx__getText(<accessor>)__xxSAHIDIVIDERxx__<value>",
		ASSERT_CONTAINS_TEXT : "assertContainsText__xxSAHIDIVIDERxx__<value>__xxSAHIDIVIDERxx__<accessor>",
		ASSERT_EQUAL_VALUE : "assertEqual__xxSAHIDIVIDERxx__<accessor>.value__xxSAHIDIVIDERxx__<value>",
		//ASSERT_SELECTION: "assertEqual__xxSAHIDIVIDERxx__getSelectedText(<accessor>)__xxSAHIDIVIDERxx__<value>",
		//ASSERT_CHECKED: "assert__xxSAHIDIVIDERxx__<accessor>.checked__xxSAHIDIVIDERxx__",
		ASSERT_NOT_CHECKED : "assertChecked__xxSAHIDIVIDERxx__<accessor>__xxSAHIDIVIDERxx__",
		POPUP : "popup(<window_name>).",
		DOMAIN : "domain(<domain>)."
	};
}
/** -- OpKey Recorder End -- **/

/** -- Ruby Recorder Start -- **/
if (_opkey.controllerMode == "ruby") {
	_opkey.controllerURL = "/_s_/spr/controllertw.htm";
	_opkey.controllerHeight = 250;
	_opkey.controllerWidth = 420;
	_opkey.recorderClass = "StepWiseRecorder";
	Opkey.prototype.getExpectPromptScript = function(s, retVal) {
		return "browser." + this.getPopupDomainPrefixes() + "expect_prompt("
				+ this.quotedEscapeValue(s) + ", "
				+ this.quotedEscapeValue(retVal) + ")";
	}
	Opkey.prototype.getExpectConfirmScript = function(s, retVal) {
		return "browser." + this.getPopupDomainPrefixes() + "expect_confirm("
				+ this.quotedEscapeValue(s) + ", " + retVal + ")"
	}
	Opkey.prototype.getNavigateToScript = function(url) {
		return "browser." + this.getPopupDomainPrefixes() + "navigate_to("
				+ this.quotedEscapeValue(url) + ")"
	}
	Opkey.prototype.getScript = function(infoAr, el, evType, e) {
		var info = infoAr[0];
		var accessor = this.escapeDollar(this.getAccessor1(info));
		if (accessor == null)
			return null;
		if (accessor.indexOf("_") == 0)
			accessor = accessor.substring(1);
		var ev = info.event;
		var value = info.value;
		var type = info.type;
		var popup = this.getPopupName();

		var cmd = null;
		if (value == null)
			value = "";
		// handle F12 and contextmenu
		if (evType == "keydown") {
			if (e && e.keyCode >= 112 && e.keyCode <= 123 && !e.charCode) {
				cmd = accessor + ".key_press(\"[" + e.keyCode + "," + 0
						+ "]\");";
			}
			if (!cmd)
				return null;
		} else {
			if (ev == "_click") {
				if (evType && evType.toLowerCase() == "contextmenu") {
					cmd = accessor + ".right_click;";
				} else
					cmd = accessor + ".click";
			} else if (ev == "_setValue") {
				cmd = accessor + ".value = " + this.quotedEscapeValue(value);
			} else if (ev == "_setSelected") {
				cmd = accessor + ".choose(" + this.quotedEscapeValue(value)
						+ ")";
			} else if (ev == "_setFile") {
				cmd = accessor + ".file = " + this.quotedEscapeValue(value);
			}
		}
		cmd = this.addPopupDomainPrefixes(cmd);
		cmd = "browser." + cmd;
		return cmd;
	};
	Opkey.prototype.escapeDollar = function(s) {
		return s;
		if (s == null)
			return null;
		return s.replace(/[$]/g, "\\$");
	};
	Opkey.prototype.getAccessor1 = function(info) {
		if (info == null)
			return null;
		if ("" == ("" + info.shortHand) || info.shortHand == null)
			return null;
		var accessor = info.type + "(" + this.escapeForScript(info.shortHand)
				+ ")";
		if (accessor.indexOf("_") == 0)
			accessor = accessor.substring(1);
		return accessor;
	};
	_opkey.language = {
		ASSERT_EXISTS : "assert(<accessor>.exists?)",
		ASSERT_VISIBLE : "assert(<accessor>.visible?);",
		ASSERT_EQUAL_TEXT : "assert_equal(<value>, <accessor>.text);",
		ASSERT_CONTAINS_TEXT : "assert(<accessor>.text.contains(<value>));",
		ASSERT_EQUAL_VALUE : "assert_equal(<value>, <accessor>.value);",
		ASSERT_SELECTION : "assert_equal(<value>, <accessor>.selected_text);",
		ASSERT_CHECKED : "assert(<accessor>.checked?);",
		ASSERT_NOT_CHECKED : "assert(!<accessor>.checked?);",
		POPUP : "popup(<window_name>).",
		DOMAIN : "domain(<domain>)."
	};
}
/** -- Ruby Recorder End -- **/

/** -- TestMaker Recorder Start -- **/
if (_opkey.controllerMode == "testmaker") {
	/* Selenium locatorBuilders start */
	eval(_opkey.sendToServer("/_s_/spr/ext/selenium/locatorBuilders.js"));
	var Log = function() {
	};
	Log.info = Log.warn = Log.prototype.exception = Log.prototype.error = Log.prototype.debug = function(
			s) {
	};
	DummyBot = function() {
		this.locationStrategies = []
	};
	DummyBot.prototype.findElement = function(locator) {
		return _opkey._bySeleniumLocator(locator);
	}
	LocatorBuilders.prototype.pageBot = function() {
		return new DummyBot();
	};
	/* Selenium locatorBuilders end */

	_opkey.recorderClass = "StepWiseRecorder";
	Opkey.prototype.getExpectPromptScript = function(s, retVal) {
		return this.toJSON([ this.getStepObj("expectPrompt", this
				.quotedEscapeValue(s), this.quotedEscapeValue(retVal)) ]);
	}
	Opkey.prototype.getExpectConfirmScript = function(s, retVal) {
		return this.toJSON([ this.getStepObj("expectConfirm", this
				.quotedEscapeValue(s), retVal) ]);
	}
	Opkey.prototype.getNavigateToScript = function(url) {
		return this.toJSON([
				this.getStepObj("navigateTo", "", this.quotedEscapeValue(url)),
				this.getStepObj("navigateTo", "", this.quotedEscapeValue(url),
						"selenium") ]);
	}
	Opkey.prototype.getStepObj = function(action, accessor, value, dialect,
			popupName) {
		var toSend = new Object();
		toSend["popup"] = popupName ? popupName : "";
		toSend["dialect"] = dialect ? dialect : "sahi";
		toSend["action"] = action;
		toSend["accessor"] = accessor;
		toSend["value"] = value;
		return toSend;

	}
	Opkey.prototype.getScript = function(infoAr, el) {
		var popupName = this.getPopupName();

		var toSendAr = new Array();
		for (var i = 0; i < infoAr.length; i++) {
			try {
				var info = infoAr[i];
				var action = info.event.replace(/^_/, '');
				var accessor = this.escapeDollar(this.getAccessor1(info));
				var value = null;
				if (action == "setValue" || action == "setSelected"
						|| action == "setFile") {
					var value = info.value;
					if (value == null)
						value = "";
					value = this.toJSON(value);
				}
				toSendAr[toSendAr.length] = this.getStepObj(action, accessor,
						value, "sahi", popupName);
			} catch (e) {
			}
		}
		// Selenium accessors start
		var locators = this.getSeleniumAccessors(el);
		for (var i = 0; i < locators.length; i++) {
			try {
				toSendAr[toSendAr.length] = this.getStepObj(action, this
						.quotedEscapeValue(locators[i][0]), value, "selenium",
						popupName);
			} catch (e) {
				_opkey._alert(e)
			}
		}
		// Selenium accessors end

		//this._alert(this.toJSON(toSendAr));
		return this.toJSON(toSendAr);
	};
	Opkey.prototype.getSeleniumAccessors = function(el) {
		var l = new LocatorBuilders(window);
		return l.buildAll(el);
	}
	Opkey.prototype.escapeDollar = function(s) {
		return s;
		if (s == null)
			return null;
		return s.replace(/[$]/g, "\\$");
	};
	Opkey.prototype.getAccessor1 = function(info) {
		if (info == null)
			return null;
		if ("" == ("" + info.shortHand) || info.shortHand == null)
			return null;
		this.lastIdentifiedElementType = info.type;
		var accessor = info.type + "(" + this.escapeForScript(info.shortHand)
				+ ")";
		if (accessor.indexOf("_") == 0)
			accessor = accessor.substring(1);
		return accessor;
	};
	Opkey.prototype.sendIdentifierInfo = function(accessors, escapedAccessor,
			escapedValue, popupName) {
		var el = eval(this.addOpkey("_" + escapedAccessor));
		var assertions = this.identify(el).assertions;
		var locators = this.getSeleniumAccessors(el);
		var selAccessors = [];
		for (var i = 0; i < locators.length; i++) {
			selAccessors[selAccessors.length] = this
					.quotedEscapeValue(locators[i][0]);
		}

		var json = this.toJSON({
			type : this.lastIdentifiedElementType,
			accessors : {
				sahi : accessors,
				selenium : selAccessors
			},
			assertions : assertions,
			value : escapedValue
		});
		this.sendToServer("/_s_/dyn/Driver_setLastIdentifiedElement?element="
				+ encodeURIComponent(json));
	}
	//	Opkey.prototype.openWin = function(){};
	//	Opkey.prototype.openController = function(){};	
	_opkey.language = {
		ASSERT_EXISTS : "assertExists__xxSAHIDIVIDERxx__<accessor>__xxSAHIDIVIDERxx__",
		ASSERT_VISIBLE : "assertVisible__xxSAHIDIVIDERxx__<accessor>__xxSAHIDIVIDERxx__",
		//ASSERT_EQUAL_TEXT: "assertEqual__xxSAHIDIVIDERxx__getText(<accessor>)__xxSAHIDIVIDERxx__<value>",
		ASSERT_CONTAINS_TEXT : "assertContainsText__xxSAHIDIVIDERxx__<value>__xxSAHIDIVIDERxx__<accessor>",
		ASSERT_EQUAL_VALUE : "assertEqual__xxSAHIDIVIDERxx__<accessor>.value__xxSAHIDIVIDERxx__<value>",
		//ASSERT_SELECTION: "assertEqual__xxSAHIDIVIDERxx__getSelectedText(<accessor>)__xxSAHIDIVIDERxx__<value>",
		//ASSERT_CHECKED: "assert__xxSAHIDIVIDERxx__<accessor>.checked__xxSAHIDIVIDERxx__",
		ASSERT_NOT_CHECKED : "assertChecked__xxSAHIDIVIDERxx__<accessor>__xxSAHIDIVIDERxx__",
		POPUP : "popup(<window_name>).",
		DOMAIN : "domain(<domain>)."
	};
}
/** -- TestMaker Recorder End -- **/
