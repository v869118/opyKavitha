var Opkey=function(){


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
				if(attr_value==id_Attr_Value){
				    lbl_element = prevSib;
				    break;
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
				if(attr_value==id_Attr_Value){
				    lbl_element = nextSib;
				    break;
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
			var allchilds=par_node.childNodes;
			for(var k=0;k<allchilds.length;k++){
			if(allchilds[k].nodeType==1){
			var lbl_tag_name = allchilds[k].tagName;
			if(lbl_element=="LABEL")
				break;
			else{
			if(lbl_tag_name=='LABEL'){
			    if(allchilds[k].getAttribute){
				var attr_value = allchilds[k].getAttribute("for");
				if(attr_value==id_Attr_Value){
				    lbl_element = allchilds[k];
				    break;
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
	var child = el.childNodes?el.childNodes:el.children;
		while(child!=null){
		    if(child.nodeType==1){
			var lbl_tag_name = child.tagName;
			if(lbl_element=="LABEL")
				break;
			else{
			if(lbl_tag_name=='LABEL'){
			    if(child.getAttribute){
				var attr_value = child.getAttribute("for");
				if(attr_value==id_Attr_Value){
				    lbl_element = child;
				    break;
				}
			    }
			}
			}
		    }
		    child = child.children;
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