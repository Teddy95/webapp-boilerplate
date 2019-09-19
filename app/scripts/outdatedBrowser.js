/**
* Autor: Andre Sieverding
* Copyright © 2019
*/

const supportedBrowsers = require('../../dist/supportedBrowsers')

if (!supportedBrowsers.test(navigator.userAgent)) {
	var bodyElement = document.body
	var outdatedBrowserTemplate = '<h6>Your browser is out-of-date!</h6><p>Update your browser to view this website correctly. <a id="btnUpdateBrowser" href="https://bestvpn.org/outdatedbrowser/">Update Browser</a></p><p class="last"><a id="obsoleteClose" href="#" title="Close">&times;</a></p>'
	var outdatedBrowserElement = document.createElement('div')
	outdatedBrowserElement.setAttribute('id', 'outdated')
	outdatedBrowserElement.innerHTML = outdatedBrowserTemplate
	bodyElement.insertBefore(outdatedBrowserElement, bodyElement.firstChild)
}
