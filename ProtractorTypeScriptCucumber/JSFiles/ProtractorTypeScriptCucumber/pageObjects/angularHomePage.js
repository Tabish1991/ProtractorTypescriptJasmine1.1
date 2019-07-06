"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const protractor_1 = require("protractor");
class angularHomePage {
    constructor() {
        this.angularLink = protractor_1.element(protractor_1.by.linkText("angular.io"));
        this.search = protractor_1.element(protractor_1.by.css("input[type='search']"));
    }
}
exports.angularHomePage = angularHomePage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhckhvbWVQYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vUHJvdHJhY3RvclR5cGVTY3JpcHRDdWN1bWJlci9wYWdlT2JqZWN0cy9hbmd1bGFySG9tZVBhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQ0FBc0Q7QUFFdEQsTUFBYSxlQUFlO0lBSzVCO1FBR0ksSUFBSSxDQUFDLFdBQVcsR0FBQyxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztRQUNwRCxJQUFJLENBQUMsTUFBTSxHQUFDLG9CQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUM7SUFFeEQsQ0FBQztDQU1BO0FBakJELDBDQWlCQyJ9