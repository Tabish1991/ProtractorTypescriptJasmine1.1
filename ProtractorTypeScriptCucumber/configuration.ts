import { Config } from 'protractor';
var HtmlReporter = require('protractor-beautiful-reporter');

// An example configuration file
export let config: Config = {
  onPrepare: function () {
    // Add a screenshot reporter and store screenshots to `/tmp/screenshots`:
    jasmine.getEnv().addReporter(new HtmlReporter({
      baseDirectory: 'tmp/screenshots'
    }).getJasmine2Reporter());
  },
  // The address of a running selenium server.
  //seleniumAddress: 'http://localhost:4444/wd/hub',
  directConnect: true,
  // Capabilities to be passed to the webdriver instance.
   capabilities: {
    browserName: 'chrome'
  }, 

  /* multiCapabilities: [{
    'browserName': 'firefox'
  }, {
    'browserName': 'chrome'
  }], */

  // Spec patterns are relative to the configuration file location passed
  // to protractor (in this example conf.js).
  // They may include glob patterns.
  specs: ['loginspec.js'],

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true, // Use colors in the command line report.
     defaultTimeoutInterval: 260000 ,
  }
}