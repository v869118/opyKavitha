/**
 * Opkey - Web Automation and Test Tool
 *
 * Copyright  2006  V Narayan Raman
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
__opkeyDebug__("playback.js: start");
_opkey.removeEvent(window, "load", Opkey.onWindowLoad);
_opkey.removeEvent(window, "beforeunload", Opkey.onBeforeUnLoad);
_opkey.addEvent(window, "load", Opkey.onWindowLoad);
_opkey.addEvent(window, "beforeunload", Opkey.onBeforeUnLoad);
try{
if (!tried){
    if (_opkey.isWinOpen){
    	try{
    		if (_opkey.top() == window.top){
    			_opkey.top()._opkey.openWin();
    		}
        }catch(e){}
    }
    tried = true;
}
}catch(e){}
_opkey.initTimer = window.setTimeout("Opkey.onWindowLoad()", (_opkey.waitForLoad) * _opkey.INTERVAL);
__opkeyDebug__("playback.js: end");
