/**
 * Injection for Minimalist
 * 
 * © 2011 Ansel Santosa
 * Licensed under GNU GPL v3
 **/

 function injectJS(scripts) {
	var m_bodies = document.getElementsByTagName("body");
	if (m_bodies.length > 0) {
		var m_scriptBlock = document.createElement("script");
			m_scriptBlock.type = "text/javascript";
			m_scriptBlock.appendChild(document.createTextNode(scripts));
		m_bodies[0].appendChild(m_scriptBlock);
	}
}

function injectCSS(styles) {
	var m_heads = document.getElementsByTagName("head");
	if (m_heads.length > 0) {
		var m_styleBlock = document.createElement("style");
			m_styleBlock.type = "text/css";
			m_styleBlock.appendChild(document.createTextNode(styles));
		m_heads[0].appendChild(m_styleBlock);
	}
}
function injectAll() {
	if (m_scripts != null) {
		injectJS(m_scripts);
	}
	if (m_dynamicStyles != null) {
		injectCSS(m_dynamicStyles);	
	}
	// NOTE: static styles injected in bootstrap
}