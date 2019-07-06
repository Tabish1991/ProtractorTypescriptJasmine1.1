"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const protractor_1 = require("protractor");
describe('Ecommerce shop', () => {
    function SelectItems(product) {
        protractor_1.element.all(protractor_1.by.tagName("app-card")).each(function (item) {
            item.element(protractor_1.by.css("h4 a")).getText().then(function (text) {
                if (text == "iphone X") {
                    item.element(protractor_1.by.css("button[class*='btn-info']")).click();
                }
            });
        });
    }
    it('Add mobile to cart', () => {
        protractor_1.browser.get("https://qaclickacademy.github.io/protocommerce/");
        protractor_1.element(protractor_1.by.linkText("Shop")).click();
        SelectItems("iphone X");
        SelectItems("Samsung Note 8");
        SelectItems("Nokia Edge");
        protractor_1.element(protractor_1.by.css("a[class='nav-link btn btn-primary']")).getText().then(function (text) {
            console.log(text);
        });
        protractor_1.element(protractor_1.by.css("a[class='nav-link btn btn-primary']")).click().then(function () {
            protractor_1.browser.sleep(4000);
            protractor_1.element.all(protractor_1.by.tagName("tbody")).each(function (item) {
                item.element(protractor_1.by.tagName("tr")).element(protractor_1.by.css("td:nth-child(4)")).getText().then(function (text) {
                    console.log(text);
                });
            });
            protractor_1.element.all(protractor_1.by.tagName("tbody")).each(function (item) {
                item.element(protractor_1.by.css("tr:nth-child(2)")).getText().then(function (text) {
                    console.log(text);
                });
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVtb3NwZWMyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vZGVtb3NwZWMyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkNBQWdEO0FBRWhELFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxHQUFFLEVBQUU7SUFDL0IsU0FBUyxXQUFXLENBQUMsT0FBTztRQUN4QixvQkFBTyxDQUFDLEdBQUcsQ0FBQyxlQUFFLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVMsSUFBSTtZQUVsRCxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBUyxJQUFJO2dCQUV6RCxJQUFHLElBQUksSUFBRSxVQUFVLEVBQUM7b0JBQ2hCLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7aUJBQzdEO1lBQ0QsQ0FBQyxDQUFDLENBQUE7UUFFRixDQUFDLENBQUMsQ0FBQTtJQUdWLENBQUM7SUFDRCxFQUFFLENBQUMsb0JBQW9CLEVBQUUsR0FBRSxFQUFFO1FBQzdCLG9CQUFPLENBQUMsR0FBRyxDQUFDLGlEQUFpRCxDQUFDLENBQUM7UUFDL0Qsb0JBQU8sQ0FBQyxlQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFckMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3hCLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzlCLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUMxQixvQkFBTyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMscUNBQXFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFTLElBQUk7WUFDbkYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNqQixDQUFDLENBQUMsQ0FBQTtRQUNGLG9CQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDO1lBRWhFLG9CQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3hCLG9CQUFPLENBQUMsR0FBRyxDQUFDLGVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBUyxJQUFJO2dCQUVuRCxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVMsSUFBSTtvQkFDOUYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDbEIsQ0FBQyxDQUFDLENBQUE7WUFFRixDQUFDLENBQUMsQ0FBQTtZQUVGLG9CQUFPLENBQUMsR0FBRyxDQUFDLGVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBUyxJQUFJO2dCQUMvQyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFTLElBQUk7b0JBQ3hFLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2QsQ0FBQyxDQUFDLENBQUE7WUFPTixDQUFDLENBQUMsQ0FBQTtRQUNGLENBQUMsQ0FBQyxDQUFBO0lBQ0UsQ0FBQyxDQUFDLENBQUE7QUFDRixDQUFDLENBQUMsQ0FBQSJ9