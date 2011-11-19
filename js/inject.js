/**
 * Injection for Minimalist
 * 
 * © 2011 Ansel Santosa
 * Licensed under GNU GPL v3
 **/

function injectBody() {
	if (bodyScripts.length > 0) {
		debug('injecting body JavaScript...');
		var bodies = document.getElementsByTagName('body');
		if (bodies.length > 0) {
			/*var jq = document.createElement('script');
				jq.setAttribute('src','//ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js');
			bodies[0].appendChild(jq);*/
			var scriptBlock = document.createElement('script');
				scriptBlock.type = 'text/javascript';
				scriptBlock.appendChild(document.createTextNode(bodyScripts));
			bodies[0].appendChild(scriptBlock);
		}
	}
}

function injectHead() {
	if (styles.length > 0 || headScripts.length > 0) {
		debug('injecting CSS...');
		var heads = document.getElementsByTagName('head');
		if (heads.length > 0) {
			if (styles.length > 0) {
				var styleBlock = document.createElement('style');
					styleBlock.type = 'text/css';
					styleBlock.appendChild(document.createTextNode(styles));
				heads[0].appendChild(styleBlock);
			}
			if (headScripts.length > 0) {
				var scriptBlock = document.createElement('script');
					scriptBlock.type = 'text/javascript';
					scriptBlock.appendChild(document.createTextNode(headScripts));
				heads[0].appendChild(scriptBlock);
			}
		}
	}
}