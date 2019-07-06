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
describe('calculator', () => {
    beforeEach(function () {
        protractor_1.browser.get("http://juliemr.github.io/protractor-demo/");
    });
    it('Practice 1', () => __awaiter(this, void 0, void 0, function* () {
        yield protractor_1.element(protractor_1.by.model("first")).sendKeys(3);
        yield protractor_1.element(protractor_1.by.model("operator")).element(protractor_1.by.css("option:nth-child(4)")).click();
        yield protractor_1.element(protractor_1.by.model("second")).sendKeys(4);
        yield protractor_1.element(protractor_1.by.id("gobutton")).click();
        yield protractor_1.element.all(protractor_1.by.repeater("result in memory")).each(function (item) {
            item.element(protractor_1.by.css("td:nth-child(3)")).getText().then(function (text) {
                console.log(text);
            });
        });
    }));
    it('Multiply all ', () => __awaiter(this, void 0, void 0, function* () {
        yield protractor_1.element(protractor_1.by.model("first")).sendKeys(99);
        yield protractor_1.element(protractor_1.by.model("operator")).element(protractor_1.by.css("option:nth-child(4)")).click();
        yield protractor_1.element(protractor_1.by.model("second")).sendKeys(99);
        yield protractor_1.element(protractor_1.by.id("gobutton")).click();
        yield protractor_1.element.all(protractor_1.by.repeater("result in memory")).each(function (item) {
            item.element(protractor_1.by.css("td:nth-child(3)")).getText().then(function (text) {
                console.log(text);
            });
        });
    }));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJhY3RpY2VzcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vcHJhY3RpY2VzcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSwyQ0FBaUQ7QUFHN0MsUUFBUSxDQUFDLFlBQVksRUFBRSxHQUFFLEVBQUU7SUFDN0IsVUFBVSxDQUFFO1FBQ1Ysb0JBQU8sQ0FBQyxHQUFHLENBQUMsMkNBQTJDLENBQUMsQ0FBQztJQUUzRCxDQUFDLENBQUMsQ0FBQTtJQUNELEVBQUUsQ0FBQyxZQUFZLEVBQUUsR0FBTyxFQUFFO1FBRzNCLE1BQU0sb0JBQU8sQ0FBQyxlQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlDLE1BQU0sb0JBQU8sQ0FBQyxlQUFFLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ25GLE1BQU0sb0JBQU8sQ0FBQyxlQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlDLE1BQU0sb0JBQU8sQ0FBQyxlQUFFLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDekMsTUFBTSxvQkFBTyxDQUFDLEdBQUcsQ0FBQyxlQUFFLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBUyxJQUFJO1lBR3RFLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVMsSUFBSTtnQkFFcEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVsQixDQUFDLENBQUMsQ0FBQTtRQUNELENBQUMsQ0FBQyxDQUFBO0lBQ0gsQ0FBQyxDQUFBLENBQUMsQ0FBQTtJQUNGLEVBQUUsQ0FBQyxlQUFlLEVBQUUsR0FBTyxFQUFFO1FBRzVCLE1BQU0sb0JBQU8sQ0FBQyxlQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzlDLE1BQU0sb0JBQU8sQ0FBQyxlQUFFLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ25GLE1BQU0sb0JBQU8sQ0FBQyxlQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQy9DLE1BQU0sb0JBQU8sQ0FBQyxlQUFFLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDekMsTUFBTSxvQkFBTyxDQUFDLEdBQUcsQ0FBQyxlQUFFLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBUyxJQUFJO1lBRXRFLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVMsSUFBSTtnQkFFcEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQixDQUFDLENBQUMsQ0FBQTtRQUNGLENBQUMsQ0FBQyxDQUFBO0lBQ0YsQ0FBQyxDQUFBLENBQUMsQ0FBQTtBQUNDLENBQUMsQ0FBQyxDQUFBIn0=