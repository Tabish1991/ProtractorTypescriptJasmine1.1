"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const protractor_1 = require("protractor");
describe('calculator practice 2', () => {
    function calc(a, b) {
        protractor_1.element(protractor_1.by.model("first")).sendKeys(a);
        protractor_1.element(protractor_1.by.model("operator")).element(protractor_1.by.css("option:nth-child(4)")).click();
        protractor_1.element(protractor_1.by.model("second")).sendKeys(b);
        protractor_1.element(protractor_1.by.id("gobutton")).click();
    }
    it('Practice 2', () => __awaiter(this, void 0, void 0, function* () {
        protractor_1.browser.get("http://juliemr.github.io/protractor-demo/");
        calc(5, 4);
        calc(6, 7);
        calc(7, 8);
        calc(3, 9);
        yield protractor_1.element.all(protractor_1.by.repeater("result in memory")).each(function (item) {
            item.element(protractor_1.by.css("td:nth-child(3)")).getText().then(function (text) {
                console.log(text);
            });
        });
    }));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJhY3RpY2VzcGVjMi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3ByYWN0aWNlc3BlYzIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLDJDQUFnRDtBQUdoRCxRQUFRLENBQUMsdUJBQXVCLEVBQUMsR0FBRSxFQUFFO0lBRWhDLFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBQyxDQUFDO1FBRWpCLG9CQUFPLENBQUMsZUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QyxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDN0Usb0JBQU8sQ0FBQyxlQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hDLG9CQUFPLENBQUMsZUFBRSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBRXhDLENBQUM7SUFFRCxFQUFFLENBQUMsWUFBWSxFQUFDLEdBQU8sRUFBRTtRQUV6QixvQkFBTyxDQUFDLEdBQUcsQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO1FBRXpELElBQUksQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7UUFDVixJQUFJLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1YsSUFBSSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztRQUNWLElBQUksQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7UUFDVixNQUFNLG9CQUFPLENBQUMsR0FBRyxDQUFDLGVBQUUsQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFTLElBQUk7WUFFakUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBUyxJQUFJO2dCQUVwRSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRXRCLENBQUMsQ0FBQyxDQUFBO1FBQ0YsQ0FBQyxDQUFDLENBQUE7SUFDRixDQUFDLENBQUEsQ0FBQyxDQUFBO0FBQ0YsQ0FBQyxDQUFDLENBQUEifQ==