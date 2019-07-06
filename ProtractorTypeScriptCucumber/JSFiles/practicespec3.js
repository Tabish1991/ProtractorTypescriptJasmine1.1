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
describe('calculator practice 3', () => {
    function calculator(a, b, c) {
        protractor_1.element(protractor_1.by.model("first")).sendKeys(a);
        protractor_1.element.all(protractor_1.by.tagName("option")).each(function (item) {
            item.getAttribute("value").then(function (values) {
                if (values == c) {
                    item.click();
                }
            });
        });
        protractor_1.element(protractor_1.by.model("second")).sendKeys(b);
        protractor_1.element(protractor_1.by.id("gobutton")).click();
    }
    it('Practice 3', () => __awaiter(this, void 0, void 0, function* () {
        protractor_1.browser.get("http://juliemr.github.io/protractor-demo/");
        calculator(3, 5, "MULTIPLICATION");
        calculator(12, 6, "ADDITION");
        calculator(13, 4, "SUBTRACTION");
        calculator(14, 3, "DIVISION");
        yield protractor_1.element.all(protractor_1.by.repeater("result in memory")).each(function (item) {
            item.element(protractor_1.by.css("td:nth-child(3)")).getText().then(function (text) {
                console.log(text);
            });
        });
    }));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJhY3RpY2VzcGVjMy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3ByYWN0aWNlc3BlYzMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLDJDQUE2QztBQUk3QyxRQUFRLENBQUMsdUJBQXVCLEVBQUUsR0FBRSxFQUFFO0lBRXRDLFNBQVMsVUFBVSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQztRQUNyQixvQkFBTyxDQUFDLGVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkMsb0JBQU8sQ0FBQyxHQUFHLENBQUMsZUFBRSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFTLElBQUk7WUFFaEQsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBUyxNQUFNO2dCQUUvQyxJQUFJLE1BQU0sSUFBRSxDQUFDLEVBQUM7b0JBQ1osSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO2lCQUNkO1lBRUQsQ0FBQyxDQUFDLENBQUE7UUFFRixDQUFDLENBQUMsQ0FBQTtRQUNOLG9CQUFPLENBQUMsZUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUdwQyxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUczQyxDQUFDO0lBR0QsRUFBRSxDQUFDLFlBQVksRUFBRSxHQUFPLEVBQUU7UUFFMUIsb0JBQU8sQ0FBQyxHQUFHLENBQUMsMkNBQTJDLENBQUMsQ0FBQztRQUd6RCxVQUFVLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ2pDLFVBQVUsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxFQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzVCLFVBQVUsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxFQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQy9CLFVBQVUsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxFQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRTVCLE1BQU0sb0JBQU8sQ0FBQyxHQUFHLENBQUMsZUFBRSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVMsSUFBSTtZQUVqRSxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFTLElBQUk7Z0JBRXBFLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7WUFNdEIsQ0FBQyxDQUFDLENBQUE7UUFDRixDQUFDLENBQUMsQ0FBQTtJQUVGLENBQUMsQ0FBQSxDQUFDLENBQUE7QUFFRixDQUFDLENBQUMsQ0FBQSJ9