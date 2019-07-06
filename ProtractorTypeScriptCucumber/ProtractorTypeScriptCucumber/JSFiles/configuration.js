"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
    // The address of a running selenium server.
    // seleniumAddress: 'http://localhost:4444/wd/hub',
    directConnect: true,
    // Capabilities to be passed to the webdriver instance.
    capabilities: {
        browserName: 'chrome'
    },
    // Spec patterns are relative to the configuration file location passed
    // to protractor (in this example conf.js).
    // They may include glob patterns.
    specs: ['testspec.js'],
    // Options to be passed to Jasmine-node.
    jasmineNodeOpts: {
        showColors: true,
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlndXJhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2NvbmZpZ3VyYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFJVyxRQUFBLE1BQU0sR0FBVztJQUN4Qiw0Q0FBNEM7SUFDN0MsbURBQW1EO0lBQ25ELGFBQWEsRUFBQyxJQUFJO0lBR2pCLHVEQUF1RDtJQUN2RCxZQUFZLEVBQUU7UUFDWixXQUFXLEVBQUUsUUFBUTtLQUN0QjtJQUVELHVFQUF1RTtJQUN2RSwyQ0FBMkM7SUFDM0Msa0NBQWtDO0lBQ2xDLEtBQUssRUFBRSxDQUFDLGFBQWEsQ0FBQztJQUV0Qix3Q0FBd0M7SUFDeEMsZUFBZSxFQUFFO1FBQ2YsVUFBVSxFQUFFLElBQUk7S0FDakI7Q0FDRixDQUFDIn0=