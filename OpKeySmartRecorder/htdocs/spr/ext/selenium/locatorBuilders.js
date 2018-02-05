/*
 * Copyright 2005 Shinya Kasatani
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function LocatorBuilders(window) {
	this.window = window;
	//this.log = new Log("LocatorBuilders");
}

LocatorBuilders.prototype.detach = function() {
    if (this.window._locator_pageBot) {
        this.window._locator_pageBot = undefined;
        // Firefox 3 (beta 5) throws "Security Manager vetoed action" when we use delete operator like this:
        // delete this.window._locator_pageBot;
    }
}

LocatorBuilders.prototype.pageBot = function() {
	var pageBot = this.window._locator_pageBot;
	if (pageBot == null) {
        //pageBot = BrowserBot.createForWindow(this.window);
        pageBot = new MozillaBrowserBot(this.window);
        var self = this;
        pageBot.getCurrentWindow = function() {
            return self.window;
        }
		this.window._locator_pageBot = pageBot;
	}
	return pageBot;
}

LocatorBuilders.prototype.buildWith = function(name, e, opt_contextNode) {
	return LocatorBuilders.builderMap[name].call(this, e, opt_contextNode);
}

LocatorBuilders.prototype.build = function(e) {
    var locators = this.buildAll(e);
    if (locators.length > 0) {
        return locators[0][0];
    } else {
        return "LOCATOR_DETECTION_FAILED";
    }
}

LocatorBuilders.prototype.buildAll = function(el) {
	var i = 0;
	var xpathLevel = 0;
	var maxLevel = 10;
	var locator;
    var locators = [];

	for (var i = 0; i < LocatorBuilders.order.length; i++) {
		var finderName = LocatorBuilders.order[i];
        try{
		locator = this.buildWith(finderName, el);
		if (locator) {
			locator = String(locator);
			if(locator.search("document")>-1) {
				locators.push([ locator, finderName ]);
				//return locators;
			}
			else{
				locators.push([ locator, finderName ]);
			}
		
			// test the locator. If a is_fuzzy_match() heuristic function is
            // defined for the location strategy, use it to determine the
            // validity of the locator's results. Otherwise, maintain existing
            // behavior.
  
    
		}
        } catch (e) {
      // TODO ignore the buggy locator builder for now
          if (el == this.findElement(locator)) {

            locators.push([ locator, finderName ]);
          }
		  else{
			  if(finderName=="xpath:idRelative")
			  {
				locators.push([this.getAbsolutePath(el), finderName ]);
		  }
		  }
    }
	}
    return locators;
}

LocatorBuilders.prototype.preciseXPath = function(xpath, e){
  //only create more precise xpath if needed
  if (this.findElement(xpath) != e) {
    var result = e.ownerDocument.evaluate(xpath, e.ownerDocument, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    //skip first element (result:0 xpath index:1)
    for (var i=0, len=result.snapshotLength; i < len; i++) {
      var newPath = 'xpath=(' +  xpath + ')[' + (i +1 )+']';
      if ( this.findElement(newPath) == e ) {
		  newPath = newPath.replace("xpath=", "");
          return newPath ;
      }
    }
  }
  return xpath;
}

LocatorBuilders.prototype.findElement = function(locator) {
	try {
		return this.pageBot().findElement(locator);
	} catch (error) {
		return null;
	}
}

/*
 * Class methods
 */

LocatorBuilders.order = [];
LocatorBuilders.builderMap = {};

LocatorBuilders.add = function(name, finder) {
	this.order.push(name);
	this.builderMap[name] = finder;
}



/*
 * Utility function: Encode XPath attribute value.
 */
LocatorBuilders.prototype.attributeValue = function(value) {
	if (value.indexOf("'") < 0) {
		return "'" + value + "'";
	} else if (value.indexOf('"') < 0) {
		return '"' + value + '"';
	} else {
		var result = 'concat(';
		while (true) {
			var apos = value.indexOf("'");
			var quot = value.indexOf('"');
			if (apos < 0) {
				result += "'" + value + "'";
				break;
			} else if (quot < 0) {
				result += '"' + value + '"';
				break;
			} else if (quot < apos) {
				var part = value.substring(0, apos);
				result += "'" + part + "'";
				value = value.substring(part.length);
			} else {
				var part = value.substring(0, quot);
				result += '"' + part + '"';
				value = value.substring(part.length);
			}
			result += ',';
		}
		result += ')';
		return result;
	}
}

LocatorBuilders.prototype.xpathHtmlElement = function(name) {
    if (this.window.document.contentType == 'application/xhtml+xml') {
        // "x:" prefix is required when testing XHTML pages
        return "x:" + name;
    } else {
        return name;
    }
}

LocatorBuilders.prototype.relativeXPathFromParent = function(current) {
    var childNodes = current.parentNode.childNodes;
    var total = 0;
    var index = -1;
    for (var i = 0; i < childNodes.length; i++) {
        var child = childNodes[i];
        if (child.nodeName == current.nodeName) {
            if (child == current) {
                index = total;
            }
            total++;
        }
    }
    var currentPath = '/' + this.xpathHtmlElement(current.nodeName.toLowerCase());
    if (total > 1 && index >= 0) {
        currentPath += '[' + (index + 1) + ']';
    }
    return currentPath;
}

/*
 * ===== builders =====
 */

//LocatorBuilders.add('ui', function(pageElement) {
//    return UIMap.getInstance().getUISpecifierString(pageElement,
//        this.window.document);
//    });
    
LocatorBuilders.add('id', function(e) {
		if (e.id) {
			return e.id;
		}
		return null;
	});

LocatorBuilders.add('link', function(e) {
		if (e.nodeName == 'A') {
			var text = LocatorBuilders.textContent(e);
			if (!text.match(/^\s*$/)) {
				return "link=" + LocatorBuilders.exactMatchPattern(text.replace(/\xA0/g, " ").replace(/^\s*(.*?)\s*$/, "$1"));
			}
		}
		return null;
	});

LocatorBuilders.add('name', function(e) {
		if (e.name) {
			return e.name;
		}
		return null;
	});

/*
 * This function is called from DOM locatorBuilders
 */
LocatorBuilders.prototype.findDomFormLocator = function(form) {
	if (form.name!=null) {
		var name = form.name;
		var locator = "document." + name;
		if (this.findElement(locator) == form) {
			return locator;
		}
		locator = "document.forms['" + name + "']";
		if (this.findElement(locator) == form) {
			return locator;
		}
	}
	var forms = this.window.document.forms;
	for (var i = 0; i < forms.length; i++) {
		if (form == forms[i]) {
			return "document.forms[" + i + "]";
		}
	}
	return null;
}

LocatorBuilders.add('dom:name', function(e) {
		if (e.form && e.name) {
			var formLocator = this.findDomFormLocator(e.form);
			var candidates = [formLocator + "." + e.name,
							  formLocator + ".elements['" + e.name + "']"];
			for (var c = 0; c < candidates.length; c++) {
				var locator = candidates[c];
				var found = this.findElement(locator);
				if (found) {
					if (found == e) {
						return locator;
					} else if (found.length && found.length > 0) {
						// multiple elements with same name
						for (var i = 0; i < found.length; i++) {
							if (found[i] == e) {
								return locator + "[" + i + "]";
							}
						}
					}
				}
			}
		}
		return null;
	});

LocatorBuilders.add('xpath:link', function(e) {
		if (e.nodeName == 'A') {
			var text = LocatorBuilders.textContent(e);
			if (!text.match(/^\s*$/)) {
				return "//" + this.xpathHtmlElement("a") + "[contains(text(),'" + text.replace(/^\s+/,'').replace(/\s+$/,'') + "')]";
			}
		}
		return null;
	});

LocatorBuilders.add('xpath:img', function(e) {
  if (e.nodeName == 'IMG') {
    if (e.alt != '') {
      return this.preciseXPath("//" + this.xpathHtmlElement("img") + "[@alt=" + this.attributeValue(e.alt) + "]", e);
    } else if (e.title != '') {
      return this.preciseXPath("//" + this.xpathHtmlElement("img") + "[@title=" + this.attributeValue(e.title) + "]", e);
    } else if (e.src != '') {
      return this.preciseXPath("//" + this.xpathHtmlElement("img") + "[contains(@src," + this.attributeValue(e.src) + ")]", e);
    }
  }
  return null;
});

LocatorBuilders.add('xpath:attributes', function(e) {
		var PREFERRED_ATTRIBUTES = ['id','name','value','type','action','onclick'];
		
		function attributesXPath(name, attNames, attributes) {
			var locator = "//" + this.xpathHtmlElement(name) + "[";
			for (var i = 0; i < attNames.length; i++) {
				if (i > 0) {
					locator += " and ";
				}
				var attName = attNames[i];
				locator += '@' + attName + "=" + this.attributeValue(attributes[attName]);
			}
			locator += "]";
			return locator;
		}

		if (e.attributes) {
			var atts = e.attributes;
			var attsMap = {};
			for (var i = 0; i < atts.length; i++) {
				var att = atts[i];
				attsMap[att.name] = att.value;
			}
			var names = [];
			// try preferred attributes
			for (var i = 0; i < PREFERRED_ATTRIBUTES.length; i++) {
				var name = PREFERRED_ATTRIBUTES[i];
				if (attsMap[name] != null) {
					names.push(name);
					var locator = attributesXPath.call(this, e.nodeName.toLowerCase(), names, attsMap);
					if (e == this.findElement(locator)) {
						return locator;
					}
				}
			}
		}
		return null;
	});

	LocatorBuilders.prototype.getAbsolutePath=function(el){
		var path = '';
		var current = el;
		while (current != null) {
			if (current.parentNode != null) {	
                path = this.relativeXPathFromParent(current) + path;
			}
			current = current.parentNode;
		}
		return path;
	};
	
LocatorBuilders.add('xpath:idRelative', function(e) {
		var path = '';
		var current = e;
		while (current != null) {
			if (current.parentNode != null) {
				
                path = this.relativeXPathFromParent(current) + path;
                if (current.parentNode.id) {
                    return "//" + this.xpathHtmlElement(current.parentNode.nodeName.toLowerCase()) + 
                        "[@id=" + this.attributeValue(current.parentNode.id) + "]" +
                        path;
                }
				else if (current.parentNode.name) {
                    return "//" + this.xpathHtmlElement(current.parentNode.nodeName.toLowerCase()) + 
                        "[@name=" + this.attributeValue(current.parentNode.name) + "]" +
                        path;
                }

			} else {
	
                return null;
            }
			current = current.parentNode;
		}
		return null;
	});

LocatorBuilders.add('xpath:href', function(e) {
		if (e.attributes && e.href!=null) {
			href = e.href;
			if (href.search(/^http?:\/\//) >= 0) {
				return "//" + this.xpathHtmlElement("a") + "[@href=" + this.attributeValue(href) + "]";
			} else {
				// use contains(), because in IE getAttribute("href") will return absolute path
				return "//" + this.xpathHtmlElement("a") + "[contains(@href, " + this.attributeValue(href) + ")]";
			}
		}
		return null;
	});

LocatorBuilders.add('dom:index', function(e) {
		if (e.form) {
			var formLocator = this.findDomFormLocator(e.form);
			var elements = e.form.elements;
			for (var i = 0; i < elements.length; i++) {
				if (elements[i] == e) {
					return formLocator + ".elements[" + i + "]";
				}
			}
		}
		return null;
	});

LocatorBuilders.add('xpath:position', function(e, opt_contextNode) {
		var path = '';
		var current = e;
		while (current != null && current != opt_contextNode) {
            var currentPath;
			if (current.parentNode != null) {
                currentPath = this.relativeXPathFromParent(current);
			} else {
                currentPath = '/' + this.xpathHtmlElement(current.nodeName.toLowerCase());
            }
			path = currentPath + path;
			var locator = '/' + path;
			if (e == this.findElement(locator)) {
				return locator;
			}
			current = current.parentNode;
			if(current.nodeName == "#document") {
				//locator = locator.replace("//","//#document/");
				return locator;
			}

		}
		return null;
	});

// You can change the priority of builders by setting LocatorBuilders.order.
//LocatorBuilders.order = ['id', 'link', 'name', 'dom:name', 'xpath:link', 'xpath:img', 'xpath:attributes', 'xpath:href', 'dom:index', 'xpath:position'];

/* added */
LocatorBuilders.exactMatchPattern = function (string) {
    if (string != null && (string.match(/^\w*:/) || string.indexOf('?') >= 0 || string.indexOf('*') >= 0)) {
            return "exact:" + string;
    } else {
            return string;
    }
}
LocatorBuilders.hasAttribute = function(el, attr){
	return el.getAttribute(attr) != null;
}
LocatorBuilders.textContent = function(el){
	return el.innerText ? el.innerText : el.textContent;
}
