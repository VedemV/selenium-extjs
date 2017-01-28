
const config = require('./lib/config');
const webdriver = require('selenium-webdriver');

var browsers = (function(){
	if( process.env['SELENIUM_BROWSER'] ){
		config.browsers = process.env['SELENIUM_BROWSER'];
	};

	if( !config.browsers ){
		config.browsers = webdriver.Browser.FIREFOX;
	};

	config.browsers = Array.isArray(config.browsers)
		? config.browsers
		: config.browsers.split(',')
			.map(item => String.prototype.trim.call(item))
			.map(item => {
				var parts = item.split(/:/)
					.map(item => String.prototype.trim.call(item));

				if (parts[0] === 'ie')
					parts[0] = webdriver.Browser.IE;
				if (parts[0] === 'edge')
					parts[0] = webdriver.Browser.EDGE;

				return parts.join(':');
			});

    browsers.forEach(function(browser) {
        var parts = browser.split(/:/, 3);
        var recognized = false;

        for (var prop in webdriver.Browser) {
            if( webdriver.Browser.hasOwnProperty(prop)
                && webdriver.Browser[prop] === parts[0] ){
                recognized = true;
                break;
            }
        }
    });

	return config.browsers;

})();

function isIgnoreBrowser(currentBrowser, browsersIgnore) {
    return function() {
        return browsersIgnore.indexOf(currentBrowser) !== -1;
    };
};

