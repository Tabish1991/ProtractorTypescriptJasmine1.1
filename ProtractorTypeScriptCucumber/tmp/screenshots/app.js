var app = angular.module('reportingApp', []);

//<editor-fold desc="global helpers">

var isValueAnArray = function (val) {
    return Array.isArray(val);
};

var getSpec = function (str) {
    var describes = str.split('|');
    return describes[describes.length - 1];
};
var checkIfShouldDisplaySpecName = function (prevItem, item) {
    if (!prevItem) {
        item.displaySpecName = true;
    } else if (getSpec(item.description) !== getSpec(prevItem.description)) {
        item.displaySpecName = true;
    }
};

var getParent = function (str) {
    var arr = str.split('|');
    str = "";
    for (var i = arr.length - 2; i > 0; i--) {
        str += arr[i] + " > ";
    }
    return str.slice(0, -3);
};

var getShortDescription = function (str) {
    return str.split('|')[0];
};

var countLogMessages = function (item) {
    if ((!item.logWarnings || !item.logErrors) && item.browserLogs && item.browserLogs.length > 0) {
        item.logWarnings = 0;
        item.logErrors = 0;
        for (var logNumber = 0; logNumber < item.browserLogs.length; logNumber++) {
            var logEntry = item.browserLogs[logNumber];
            if (logEntry.level === 'SEVERE') {
                item.logErrors++;
            }
            if (logEntry.level === 'WARNING') {
                item.logWarnings++;
            }
        }
    }
};

var defaultSortFunction = function sortFunction(a, b) {
    if (a.sessionId < b.sessionId) {
        return -1;
    }
    else if (a.sessionId > b.sessionId) {
        return 1;
    }

    if (a.timestamp < b.timestamp) {
        return -1;
    }
    else if (a.timestamp > b.timestamp) {
        return 1;
    }

    return 0;
};


//</editor-fold>

app.controller('ScreenshotReportController', function ($scope, $http) {
    var that = this;
    var clientDefaults = {};

    $scope.searchSettings = Object.assign({
        description: '',
        allselected: true,
        passed: true,
        failed: true,
        pending: true,
        withLog: true
    }, clientDefaults.searchSettings || {}); // enable customisation of search settings on first page hit

    this.warningTime = 1400;
    this.dangerTime = 1900;

    var initialColumnSettings = clientDefaults.columnSettings; // enable customisation of visible columns on first page hit
    if (initialColumnSettings) {
        if (initialColumnSettings.displayTime !== undefined) {
            // initial settings have be inverted because the html bindings are inverted (e.g. !ctrl.displayTime)
            this.displayTime = !initialColumnSettings.displayTime;
        }
        if (initialColumnSettings.displayBrowser !== undefined) {
            this.displayBrowser = !initialColumnSettings.displayBrowser; // same as above
        }
        if (initialColumnSettings.displaySessionId !== undefined) {
            this.displaySessionId = !initialColumnSettings.displaySessionId; // same as above
        }
        if (initialColumnSettings.displayOS !== undefined) {
            this.displayOS = !initialColumnSettings.displayOS; // same as above
        }
        if (initialColumnSettings.inlineScreenshots !== undefined) {
            this.inlineScreenshots = initialColumnSettings.inlineScreenshots; // this setting does not have to be inverted
        } else {
            this.inlineScreenshots = false;
        }
        if (initialColumnSettings.warningTime) {
            this.warningTime = initialColumnSettings.warningTime;
        }
        if (initialColumnSettings.dangerTime){
            this.dangerTime = initialColumnSettings.dangerTime;
        }
    }

    this.showSmartStackTraceHighlight = true;

    this.chooseAllTypes = function () {
        var value = true;
        $scope.searchSettings.allselected = !$scope.searchSettings.allselected;
        if (!$scope.searchSettings.allselected) {
            value = false;
        }

        $scope.searchSettings.passed = value;
        $scope.searchSettings.failed = value;
        $scope.searchSettings.pending = value;
        $scope.searchSettings.withLog = value;
    };

    this.isValueAnArray = function (val) {
        return isValueAnArray(val);
    };

    this.getParent = function (str) {
        return getParent(str);
    };

    this.getSpec = function (str) {
        return getSpec(str);
    };

    this.getShortDescription = function (str) {
        return getShortDescription(str);
    };

    this.convertTimestamp = function (timestamp) {
        var d = new Date(timestamp),
            yyyy = d.getFullYear(),
            mm = ('0' + (d.getMonth() + 1)).slice(-2),
            dd = ('0' + d.getDate()).slice(-2),
            hh = d.getHours(),
            h = hh,
            min = ('0' + d.getMinutes()).slice(-2),
            ampm = 'AM',
            time;

        if (hh > 12) {
            h = hh - 12;
            ampm = 'PM';
        } else if (hh === 12) {
            h = 12;
            ampm = 'PM';
        } else if (hh === 0) {
            h = 12;
        }

        // ie: 2013-02-18, 8:35 AM
        time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;

        return time;
    };


    this.round = function (number, roundVal) {
        return (parseFloat(number) / 1000).toFixed(roundVal);
    };


    this.passCount = function () {
        var passCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (result.passed) {
                passCount++;
            }
        }
        return passCount;
    };


    this.pendingCount = function () {
        var pendingCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (result.pending) {
                pendingCount++;
            }
        }
        return pendingCount;
    };


    this.failCount = function () {
        var failCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (!result.passed && !result.pending) {
                failCount++;
            }
        }
        return failCount;
    };

    this.passPerc = function () {
        return (this.passCount() / this.totalCount()) * 100;
    };
    this.pendingPerc = function () {
        return (this.pendingCount() / this.totalCount()) * 100;
    };
    this.failPerc = function () {
        return (this.failCount() / this.totalCount()) * 100;
    };
    this.totalCount = function () {
        return this.passCount() + this.failCount() + this.pendingCount();
    };

    this.applySmartHighlight = function (line) {
        if (this.showSmartStackTraceHighlight) {
            if (line.indexOf('node_modules') > -1) {
                return 'greyout';
            }
            if (line.indexOf('  at ') === -1) {
                return '';
            }

            return 'highlight';
        }
        return true;
    };

    var results = [
    {
        "description": "verify if user is able to create an account|User Account Creation",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "instanceId": 6392,
        "browser": {
            "name": "chrome",
            "version": "75.0.3770.100"
        },
        "message": [
            "Failed: No element found using locator: By(css selector, a[class='logout'])"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(css selector, a[class='logout'])\n    at elementArrayFinder.getWebElements.then (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:814:27)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at process._tickCallback (internal/process/next_tick.js:68:7)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as getText] (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as getText] (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:831:22)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:86:34\n    at Generator.next (<anonymous>)\n    at fulfilled (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\JSFiles\\loginspec.js:4:58)\n    at process._tickCallback (internal/process/next_tick.js:68:7)\nFrom: Task: Run it(\"verify if user is able to create an account\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:23:9\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasmine-data-provider\\src\\index.js:37:22\n    at Array.forEach (<anonymous>)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasmine-data-provider\\src\\index.js:30:24\n    at Suite.describe (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:22:5)\n    at addSpecsToSuite (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:8:1)"
        ],
        "browserLogs": [],
        "screenShotFile": "00d1007f-0091-0016-0061-00ee0041001d.png",
        "timestamp": 1562370720335,
        "duration": 24593
    },
    {
        "description": "verify if user is able to create an account|User Account Creation",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "instanceId": 6656,
        "browser": {
            "name": "chrome",
            "version": "75.0.3770.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0013000b-00ad-0034-0047-00b40076009a.png",
        "timestamp": 1562370807469,
        "duration": 28271
    },
    {
        "description": "verify if user is able to login with an existing user|User Account Creation",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "instanceId": 6656,
        "browser": {
            "name": "chrome",
            "version": "75.0.3770.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "008a001c-00e9-00c1-0001-00ff0085001e.png",
        "timestamp": 1562370836150,
        "duration": 33233
    },
    {
        "description": "verify if user is able to create an account|User Account Creation",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "instanceId": 3968,
        "browser": {
            "name": "chrome",
            "version": "75.0.3770.100"
        },
        "message": [
            "Failed: No element found using locator: By(css selector, input[name='id_gender'])"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(css selector, input[name='id_gender'])\n    at elementArrayFinder.getWebElements.then (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:814:27)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at process._tickCallback (internal/process/next_tick.js:68:7)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as click] (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as click] (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:831:22)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:33:30\n    at Generator.next (<anonymous>)\n    at fulfilled (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\JSFiles\\loginspec.js:4:58)\n    at process._tickCallback (internal/process/next_tick.js:68:7)\nFrom: Task: Run it(\"verify if user is able to create an account\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:20:9\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasmine-data-provider\\src\\index.js:37:22\n    at Array.forEach (<anonymous>)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasmine-data-provider\\src\\index.js:30:24\n    at Suite.describe (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:19:5)\n    at addSpecsToSuite (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:5:1)"
        ],
        "browserLogs": [],
        "screenShotFile": "00ac0076-00e5-00b1-001b-00fd004f00ed.png",
        "timestamp": 1562371349544,
        "duration": 16939
    },
    {
        "description": "verify if user is able to login with an existing user|User Account Creation",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "instanceId": 3968,
        "browser": {
            "name": "chrome",
            "version": "75.0.3770.100"
        },
        "message": [
            "Failed: No element found using locator: By(css selector, a[href='http://automationpractice.com/index.php?mylogout='])"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(css selector, a[href='http://automationpractice.com/index.php?mylogout='])\n    at elementArrayFinder.getWebElements.then (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:814:27)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at process._tickCallback (internal/process/next_tick.js:68:7)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as click] (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as click] (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:831:22)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:98:30\n    at Generator.next (<anonymous>)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\JSFiles\\loginspec.js:7:71\n    at new Promise (<anonymous>)\n    at __awaiter (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\JSFiles\\loginspec.js:3:12)\n    at UserContext.it (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:96:80)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasminewd2\\index.js:112:25\nFrom: Task: Run it(\"verify if user is able to login with an existing user\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:96:9\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasmine-data-provider\\src\\index.js:37:22\n    at Array.forEach (<anonymous>)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasmine-data-provider\\src\\index.js:30:24\n    at Suite.describe (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:19:5)\n    at addSpecsToSuite (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:5:1)"
        ],
        "browserLogs": [],
        "screenShotFile": "00b4001f-004b-0051-0056-008c00840055.png",
        "timestamp": 1562371366902,
        "duration": 9664
    },
    {
        "description": "verify if user is able to create an account|User Account Creation",
        "passed": false,
        "pending": false,
        "instanceId": 8156,
        "browser": {
            "name": "firefox"
        },
        "message": [
            "Failed: No element found using locator: By(css selector, input[name='id_gender'])"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(css selector, input[name='id_gender'])\n    at elementArrayFinder.getWebElements.then (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:814:27)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at process._tickCallback (internal/process/next_tick.js:68:7)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as click] (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as click] (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:831:22)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:33:30\n    at Generator.next (<anonymous>)\n    at fulfilled (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\JSFiles\\loginspec.js:4:58)\n    at process._tickCallback (internal/process/next_tick.js:68:7)\nFrom: Task: Run it(\"verify if user is able to create an account\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:20:9\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasmine-data-provider\\src\\index.js:37:22\n    at Array.forEach (<anonymous>)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasmine-data-provider\\src\\index.js:30:24\n    at Suite.describe (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:19:5)\n    at addSpecsToSuite (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:5:1)"
        ],
        "browserLogs": [],
        "screenShotFile": "00800029-00a5-002c-001d-006d0051001b.png",
        "timestamp": 1562371410758,
        "duration": 17890
    },
    {
        "description": "verify if user is able to login with an existing user|User Account Creation",
        "passed": false,
        "pending": false,
        "instanceId": 8156,
        "browser": {
            "name": "firefox"
        },
        "message": [
            "Failed: No element found using locator: By(css selector, a[href='http://automationpractice.com/index.php?mylogout='])"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(css selector, a[href='http://automationpractice.com/index.php?mylogout='])\n    at elementArrayFinder.getWebElements.then (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:814:27)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at process._tickCallback (internal/process/next_tick.js:68:7)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as click] (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as click] (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:831:22)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:98:30\n    at Generator.next (<anonymous>)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\JSFiles\\loginspec.js:7:71\n    at new Promise (<anonymous>)\n    at __awaiter (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\JSFiles\\loginspec.js:3:12)\n    at UserContext.it (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:96:80)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasminewd2\\index.js:112:25\nFrom: Task: Run it(\"verify if user is able to login with an existing user\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:96:9\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasmine-data-provider\\src\\index.js:37:22\n    at Array.forEach (<anonymous>)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasmine-data-provider\\src\\index.js:30:24\n    at Suite.describe (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:19:5)\n    at addSpecsToSuite (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:5:1)"
        ],
        "browserLogs": [],
        "screenShotFile": "002000cc-00f8-00c1-0017-00ef00450000.png",
        "timestamp": 1562371428897,
        "duration": 6930
    },
    {
        "description": "verify if user is able to create an account|User Account Creation",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "instanceId": 6632,
        "browser": {
            "name": "chrome",
            "version": "75.0.3770.100"
        },
        "message": [
            "Failed: No element found using locator: By(css selector, input[name='id_gender'])"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(css selector, input[name='id_gender'])\n    at elementArrayFinder.getWebElements.then (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:814:27)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at process._tickCallback (internal/process/next_tick.js:68:7)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as click] (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as click] (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:831:22)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:33:30\n    at Generator.next (<anonymous>)\n    at fulfilled (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\JSFiles\\loginspec.js:4:58)\n    at process._tickCallback (internal/process/next_tick.js:68:7)\nFrom: Task: Run it(\"verify if user is able to create an account\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:20:9\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasmine-data-provider\\src\\index.js:37:22\n    at Array.forEach (<anonymous>)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasmine-data-provider\\src\\index.js:30:24\n    at Suite.describe (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:19:5)\n    at addSpecsToSuite (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:5:1)"
        ],
        "browserLogs": [],
        "screenShotFile": "0067003e-0046-00a1-00b8-00c000d60051.png",
        "timestamp": 1562371589050,
        "duration": 18138
    },
    {
        "description": "verify if user is able to create an account|User Account Creation",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "instanceId": 6752,
        "browser": {
            "name": "chrome",
            "version": "75.0.3770.100"
        },
        "message": [
            "Failed: No element found using locator: By(css selector, a[class='logout'])"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(css selector, a[class='logout'])\n    at elementArrayFinder.getWebElements.then (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:814:27)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at process._tickCallback (internal/process/next_tick.js:68:7)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as getText] (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as getText] (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:831:22)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:83:34\n    at Generator.next (<anonymous>)\n    at fulfilled (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\JSFiles\\loginspec.js:4:58)\n    at process._tickCallback (internal/process/next_tick.js:68:7)\nFrom: Task: Run it(\"verify if user is able to create an account\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:20:9\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasmine-data-provider\\src\\index.js:37:22\n    at Array.forEach (<anonymous>)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasmine-data-provider\\src\\index.js:30:24\n    at Suite.describe (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:19:5)\n    at addSpecsToSuite (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:5:1)"
        ],
        "browserLogs": [],
        "screenShotFile": "00f900b6-00f0-0038-008e-00bf00e4000f.png",
        "timestamp": 1562371664432,
        "duration": 24837
    },
    {
        "description": "verify if user is able to login with an existing user|User Account Creation",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "instanceId": 6752,
        "browser": {
            "name": "chrome",
            "version": "75.0.3770.100"
        },
        "message": [
            "Failed: No element found using locator: By(css selector, a[href='http://automationpractice.com/index.php?mylogout='])"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(css selector, a[href='http://automationpractice.com/index.php?mylogout='])\n    at elementArrayFinder.getWebElements.then (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:814:27)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at process._tickCallback (internal/process/next_tick.js:68:7)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as click] (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as click] (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:831:22)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:98:30\n    at Generator.next (<anonymous>)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\JSFiles\\loginspec.js:7:71\n    at new Promise (<anonymous>)\n    at __awaiter (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\JSFiles\\loginspec.js:3:12)\n    at UserContext.it (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:96:80)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasminewd2\\index.js:112:25\nFrom: Task: Run it(\"verify if user is able to login with an existing user\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:96:9\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasmine-data-provider\\src\\index.js:37:22\n    at Array.forEach (<anonymous>)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasmine-data-provider\\src\\index.js:30:24\n    at Suite.describe (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:19:5)\n    at addSpecsToSuite (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:5:1)"
        ],
        "browserLogs": [],
        "screenShotFile": "002100a6-00d0-0087-0091-0014002100d8.png",
        "timestamp": 1562371689694,
        "duration": 11680
    },
    {
        "description": "verify if user is able to create an account|User Account Creation",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "instanceId": 7984,
        "browser": {
            "name": "chrome",
            "version": "75.0.3770.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0045002c-0007-0052-0083-002b001700bb.png",
        "timestamp": 1562371733427,
        "duration": 28989
    },
    {
        "description": "verify if user is able to login with an existing user|User Account Creation",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "instanceId": 7984,
        "browser": {
            "name": "chrome",
            "version": "75.0.3770.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00fe007e-001a-0026-0005-003b00340040.png",
        "timestamp": 1562371762859,
        "duration": 33346
    },
    {
        "description": "verify if user is able to create an account|User Account Creation",
        "passed": false,
        "pending": false,
        "instanceId": 5540,
        "browser": {
            "name": "firefox"
        },
        "message": [
            "Failed: No element found using locator: By(css selector, a[class='logout'])"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(css selector, a[class='logout'])\n    at elementArrayFinder.getWebElements.then (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:814:27)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at process._tickCallback (internal/process/next_tick.js:68:7)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as getText] (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as getText] (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:831:22)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:83:34\n    at Generator.next (<anonymous>)\n    at fulfilled (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\JSFiles\\loginspec.js:4:58)\n    at process._tickCallback (internal/process/next_tick.js:68:7)\nFrom: Task: Run it(\"verify if user is able to create an account\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:20:9\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasmine-data-provider\\src\\index.js:37:22\n    at Array.forEach (<anonymous>)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasmine-data-provider\\src\\index.js:30:24\n    at Suite.describe (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:19:5)\n    at addSpecsToSuite (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:5:1)"
        ],
        "browserLogs": [],
        "screenShotFile": "00c10056-00ea-008a-00d8-001300a50023.png",
        "timestamp": 1562371918519,
        "duration": 23957
    },
    {
        "description": "verify if user is able to login with an existing user|User Account Creation",
        "passed": false,
        "pending": false,
        "instanceId": 5540,
        "browser": {
            "name": "firefox"
        },
        "message": [
            "Failed: No element found using locator: By(css selector, a[href='http://automationpractice.com/index.php?mylogout='])"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(css selector, a[href='http://automationpractice.com/index.php?mylogout='])\n    at elementArrayFinder.getWebElements.then (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:814:27)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at process._tickCallback (internal/process/next_tick.js:68:7)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as click] (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as click] (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:831:22)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:98:30\n    at Generator.next (<anonymous>)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\JSFiles\\loginspec.js:7:71\n    at new Promise (<anonymous>)\n    at __awaiter (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\JSFiles\\loginspec.js:3:12)\n    at UserContext.it (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:96:80)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasminewd2\\index.js:112:25\nFrom: Task: Run it(\"verify if user is able to login with an existing user\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:96:9\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasmine-data-provider\\src\\index.js:37:22\n    at Array.forEach (<anonymous>)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasmine-data-provider\\src\\index.js:30:24\n    at Suite.describe (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:19:5)\n    at addSpecsToSuite (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:5:1)"
        ],
        "browserLogs": [],
        "screenShotFile": "00450020-009a-0056-0049-002d006900bd.png",
        "timestamp": 1562371942644,
        "duration": 7118
    },
    {
        "description": "verify if user is able to create an account|User Account Creation",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "instanceId": 4372,
        "browser": {
            "name": "chrome",
            "version": "75.0.3770.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00c100e1-00a3-00bc-00f7-00bc007500ac.png",
        "timestamp": 1562372008826,
        "duration": 29787
    },
    {
        "description": "verify if user is able to login with an existing user|User Account Creation",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "instanceId": 4372,
        "browser": {
            "name": "chrome",
            "version": "75.0.3770.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00ed0038-004d-00e8-008f-006300f500f6.png",
        "timestamp": 1562372039090,
        "duration": 34142
    },
    {
        "description": "verify if user is able to create an account|User Account Creation",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "instanceId": 6064,
        "browser": {
            "name": "chrome",
            "version": "75.0.3770.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "006b0045-0001-0072-00f4-00220025006d.png",
        "timestamp": 1562372730211,
        "duration": 33560
    },
    {
        "description": "verify if user is able to login with an existing user|User Account Creation",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "instanceId": 6064,
        "browser": {
            "name": "chrome",
            "version": "75.0.3770.100"
        },
        "message": [
            "Error: Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL."
        ],
        "trace": [
            "Error: Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL.\n    at Timeout._onTimeout (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4281:23)\n    at ontimeout (timers.js:436:11)\n    at tryOnTimeout (timers.js:300:5)\n    at listOnTimeout (timers.js:263:5)\n    at Timer.processTimers (timers.js:223:10)"
        ],
        "browserLogs": [],
        "screenShotFile": "0022009b-00f3-0087-006a-00eb00f20046.png",
        "timestamp": 1562372764925,
        "duration": 40544
    },
    {
        "description": "verify if user is able to create an account|User Account Creation",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "instanceId": 7316,
        "browser": {
            "name": "chrome",
            "version": "75.0.3770.100"
        },
        "message": [
            "Failed: No element found using locator: By(css selector, input[name='id_gender'])"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(css selector, input[name='id_gender'])\n    at elementArrayFinder.getWebElements.then (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:814:27)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at process._tickCallback (internal/process/next_tick.js:68:7)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as click] (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as click] (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:831:22)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:33:30\n    at Generator.next (<anonymous>)\n    at fulfilled (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\JSFiles\\loginspec.js:4:58)\n    at process._tickCallback (internal/process/next_tick.js:68:7)\nFrom: Task: Run it(\"verify if user is able to create an account\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:20:9\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasmine-data-provider\\src\\index.js:37:22\n    at Array.forEach (<anonymous>)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasmine-data-provider\\src\\index.js:30:24\n    at Suite.describe (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:19:5)\n    at addSpecsToSuite (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:5:1)"
        ],
        "browserLogs": [],
        "screenShotFile": "0071009a-0081-00a8-00dc-003200000051.png",
        "timestamp": 1562372893865,
        "duration": 30220
    },
    {
        "description": "verify if user is able to create an account|User Account Creation",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "instanceId": 5320,
        "browser": {
            "name": "chrome",
            "version": "75.0.3770.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00a400a7-0099-003b-0081-000600d500ee.png",
        "timestamp": 1562372982222,
        "duration": 31488
    },
    {
        "description": "verify if user is able to login with an existing user|User Account Creation",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "instanceId": 5320,
        "browser": {
            "name": "chrome",
            "version": "75.0.3770.100"
        },
        "message": [
            "Error: Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL.",
            "Failed: No element found using locator: By(css selector, a[href='http://automationpractice.com/index.php?controller=order&step=1'])"
        ],
        "trace": [
            "Error: Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL.\n    at Timeout._onTimeout (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4281:23)\n    at ontimeout (timers.js:436:11)\n    at tryOnTimeout (timers.js:300:5)\n    at listOnTimeout (timers.js:263:5)\n    at Timer.processTimers (timers.js:223:10)",
            "NoSuchElementError: No element found using locator: By(css selector, a[href='http://automationpractice.com/index.php?controller=order&step=1'])\n    at elementArrayFinder.getWebElements.then (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:814:27)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at process._tickCallback (internal/process/next_tick.js:68:7)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as click] (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as click] (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:831:22)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:112:42\n    at Generator.next (<anonymous>)\n    at fulfilled (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\JSFiles\\loginspec.js:4:58)\nFrom: Task: Run it(\"verify if user is able to login with an existing user\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:96:9\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasmine-data-provider\\src\\index.js:37:22\n    at Array.forEach (<anonymous>)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasmine-data-provider\\src\\index.js:30:24\n    at Suite.describe (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:19:5)\n    at addSpecsToSuite (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:5:1)"
        ],
        "browserLogs": [],
        "screenShotFile": "00410087-00a0-0097-00cd-006900b90056.png",
        "timestamp": 1562373014166,
        "duration": 57291
    },
    {
        "description": "verify if user is able to create an account|User Account Creation",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "instanceId": 5320,
        "browser": {
            "name": "chrome",
            "version": "75.0.3770.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0082006a-0082-0006-0069-003300cb0087.png",
        "timestamp": 1562373404541,
        "duration": 27594
    },
    {
        "description": "verify if user is able to login with an existing user|User Account Creation",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "instanceId": 5320,
        "browser": {
            "name": "chrome",
            "version": "75.0.3770.100"
        },
        "message": [
            "Failed: No element found using locator: By(css selector, a[href='http://automationpractice.com/index.php?controller=order&step=1'])"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(css selector, a[href='http://automationpractice.com/index.php?controller=order&step=1'])\n    at elementArrayFinder.getWebElements.then (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:814:27)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at process._tickCallback (internal/process/next_tick.js:68:7)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as click] (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as click] (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:831:22)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:112:42\n    at Generator.next (<anonymous>)\n    at fulfilled (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\JSFiles\\loginspec.js:4:58)\nFrom: Task: Run it(\"verify if user is able to login with an existing user\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:96:9\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasmine-data-provider\\src\\index.js:37:22\n    at Array.forEach (<anonymous>)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasmine-data-provider\\src\\index.js:30:24\n    at Suite.describe (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:19:5)\n    at addSpecsToSuite (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:5:1)"
        ],
        "browserLogs": [],
        "screenShotFile": "0060001a-00d0-0034-004f-00ab001b0044.png",
        "timestamp": 1562373432574,
        "duration": 37904
    },
    {
        "description": "verify if user is able to create an account|User Account Creation",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "instanceId": 6008,
        "browser": {
            "name": "chrome",
            "version": "75.0.3770.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "001b00bc-00a8-0012-003b-00d200c90093.png",
        "timestamp": 1562373593106,
        "duration": 27151
    },
    {
        "description": "verify if user is able to login with an existing user|User Account Creation",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "instanceId": 6008,
        "browser": {
            "name": "chrome",
            "version": "75.0.3770.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "002f003b-00f2-003b-006b-006f00c3007c.png",
        "timestamp": 1562373620751,
        "duration": 33203
    },
    {
        "description": "verify if user is able to create an account|User Account Creation",
        "passed": false,
        "pending": false,
        "instanceId": 7708,
        "browser": {
            "name": "firefox"
        },
        "message": [
            "Failed: No element found using locator: By(css selector, input[name='id_gender'])"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(css selector, input[name='id_gender'])\n    at elementArrayFinder.getWebElements.then (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:814:27)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at process._tickCallback (internal/process/next_tick.js:68:7)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as click] (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as click] (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:831:22)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:33:30\n    at Generator.next (<anonymous>)\n    at fulfilled (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\JSFiles\\loginspec.js:4:58)\n    at process._tickCallback (internal/process/next_tick.js:68:7)\nFrom: Task: Run it(\"verify if user is able to create an account\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:20:9\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasmine-data-provider\\src\\index.js:37:22\n    at Array.forEach (<anonymous>)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasmine-data-provider\\src\\index.js:30:24\n    at Suite.describe (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:19:5)\n    at addSpecsToSuite (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:5:1)"
        ],
        "browserLogs": [],
        "screenShotFile": "00ad0023-0026-00eb-007f-00c900c60088.png",
        "timestamp": 1562373808697,
        "duration": 32471
    },
    {
        "description": "verify if user is able to create an account|User Account Creation",
        "passed": false,
        "pending": false,
        "instanceId": 5996,
        "browser": {
            "name": "firefox"
        },
        "message": [
            "Failed: No element found using locator: By(css selector, a[class='logout'])"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(css selector, a[class='logout'])\n    at elementArrayFinder.getWebElements.then (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:814:27)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at process._tickCallback (internal/process/next_tick.js:68:7)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as getText] (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as getText] (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:831:22)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:83:34\n    at Generator.next (<anonymous>)\n    at fulfilled (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\JSFiles\\loginspec.js:4:58)\n    at process._tickCallback (internal/process/next_tick.js:68:7)\nFrom: Task: Run it(\"verify if user is able to create an account\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:20:9\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasmine-data-provider\\src\\index.js:37:22\n    at Array.forEach (<anonymous>)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasmine-data-provider\\src\\index.js:30:24\n    at Suite.describe (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:19:5)\n    at addSpecsToSuite (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:5:1)"
        ],
        "browserLogs": [],
        "screenShotFile": "00c80066-00aa-00cc-00f4-00f300d30035.png",
        "timestamp": 1562373888070,
        "duration": 22883
    },
    {
        "description": "verify if user is able to login with an existing user|User Account Creation",
        "passed": false,
        "pending": false,
        "instanceId": 5996,
        "browser": {
            "name": "firefox"
        },
        "message": [
            "Failed: No element found using locator: By(css selector, a[href='http://automationpractice.com/index.php?mylogout='])"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(css selector, a[href='http://automationpractice.com/index.php?mylogout='])\n    at elementArrayFinder.getWebElements.then (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:814:27)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at process._tickCallback (internal/process/next_tick.js:68:7)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as click] (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as click] (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\built\\element.js:831:22)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:98:30\n    at Generator.next (<anonymous>)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\JSFiles\\loginspec.js:7:71\n    at new Promise (<anonymous>)\n    at __awaiter (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\JSFiles\\loginspec.js:3:12)\n    at UserContext.it (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:96:80)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasminewd2\\index.js:112:25\nFrom: Task: Run it(\"verify if user is able to login with an existing user\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:96:9\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasmine-data-provider\\src\\index.js:37:22\n    at Array.forEach (<anonymous>)\n    at C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\jasmine-data-provider\\src\\index.js:30:24\n    at Suite.describe (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:19:5)\n    at addSpecsToSuite (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\sabiha\\Desktop\\ProtractorTypeScriptCucumber\\loginspec.ts:5:1)"
        ],
        "browserLogs": [],
        "screenShotFile": "00380022-003c-00e7-00b3-00cf00e8000a.png",
        "timestamp": 1562373911120,
        "duration": 7804
    }
];

    this.sortSpecs = function () {
        this.results = results.sort(function sortFunction(a, b) {
    if (a.sessionId < b.sessionId) return -1;else if (a.sessionId > b.sessionId) return 1;

    if (a.timestamp < b.timestamp) return -1;else if (a.timestamp > b.timestamp) return 1;

    return 0;
});
    };

    this.loadResultsViaAjax = function () {

        $http({
            url: './combined.json',
            method: 'GET'
        }).then(function (response) {
                var data = null;
                if (response && response.data) {
                    if (typeof response.data === 'object') {
                        data = response.data;
                    } else if (response.data[0] === '"') { //detect super escaped file (from circular json)
                        data = CircularJSON.parse(response.data); //the file is escaped in a weird way (with circular json)
                    }
                    else {
                        data = JSON.parse(response.data);
                    }
                }
                if (data) {
                    results = data;
                    that.sortSpecs();
                }
            },
            function (error) {
                console.error(error);
            });
    };


    if (clientDefaults.useAjax) {
        this.loadResultsViaAjax();
    } else {
        this.sortSpecs();
    }


});

app.filter('bySearchSettings', function () {
    return function (items, searchSettings) {
        var filtered = [];
        if (!items) {
            return filtered; // to avoid crashing in where results might be empty
        }
        var prevItem = null;

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            item.displaySpecName = false;

            var isHit = false; //is set to true if any of the search criteria matched
            countLogMessages(item); // modifies item contents

            var hasLog = searchSettings.withLog && item.browserLogs && item.browserLogs.length > 0;
            if (searchSettings.description === '' ||
                (item.description && item.description.toLowerCase().indexOf(searchSettings.description.toLowerCase()) > -1)) {

                if (searchSettings.passed && item.passed || hasLog) {
                    isHit = true;
                } else if (searchSettings.failed && !item.passed && !item.pending || hasLog) {
                    isHit = true;
                } else if (searchSettings.pending && item.pending || hasLog) {
                    isHit = true;
                }
            }
            if (isHit) {
                checkIfShouldDisplaySpecName(prevItem, item);

                filtered.push(item);
                prevItem = item;
            }
        }

        return filtered;
    };
});

