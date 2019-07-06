"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const protractor_1 = require("protractor");
class calculatorHomePage {
    constructor() {
        this.firstEditBox = protractor_1.element(protractor_1.by.model("first"));
        this.SecondEditBox = protractor_1.element(protractor_1.by.model("second"));
        this.goButton = protractor_1.element(protractor_1.by.id("gobutton"));
        this.getText = protractor_1.element(protractor_1.by.repeater("result in memory")).element(protractor_1.by.css("td:nth-child(3)"));
        this.eleCount = protractor_1.element.all(protractor_1.by.repeater("result in memory"));
    }
}
exports.calculatorHomePage = calculatorHomePage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsY3VsYXRvckhvbWVQYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vcGFnZU9iamVjdHMvY2FsY3VsYXRvckhvbWVQYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkNBQXlFO0FBRXpFLE1BQWEsa0JBQWtCO0lBUS9CO1FBRUEsSUFBSSxDQUFDLFlBQVksR0FBQyxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUM3QyxJQUFJLENBQUMsYUFBYSxHQUFFLG9CQUFPLENBQUMsZUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ2hELElBQUksQ0FBQyxRQUFRLEdBQUMsb0JBQU8sQ0FBQyxlQUFFLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLE9BQU8sR0FBQyxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztRQUN6RixJQUFJLENBQUMsUUFBUSxHQUFDLG9CQUFPLENBQUMsR0FBRyxDQUFDLGVBQUUsQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO0lBQzNELENBQUM7Q0FHQTtBQWxCRCxnREFrQkMifQ==