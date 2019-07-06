"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const protractor_1 = require("protractor");
describe('Protractor Tutorial', () => {
    it('demo web application', () => {
        protractor_1.browser.get("https://qaclickacademy.github.io/protocommerce/");
        protractor_1.element(protractor_1.by.name("name")).sendKeys("Tabish Nasar");
        protractor_1.element(protractor_1.by.name("email")).sendKeys("infotabish@gmail.com");
        protractor_1.element(protractor_1.by.css("input[type='password']")).sendKeys("Panacea@12345");
        protractor_1.element(protractor_1.by.css("input[type='checkbox']")).click();
        protractor_1.element(protractor_1.by.css("select[id='exampleFormControlSelect1']")).element(protractor_1.by.css("option:nth-child(2)")).click().then(function () {
            protractor_1.browser.sleep(3000);
        });
        protractor_1.element(protractor_1.by.css("input[id='inlineRadio2']")).click();
        protractor_1.element(protractor_1.by.buttonText("Submit")).click();
        protractor_1.element(protractor_1.by.css("div[class*='alert alert-success']")).getText().then(function (text) {
            console.log(text);
        });
        protractor_1.element(protractor_1.by.name("name")).clear();
        protractor_1.element(protractor_1.by.name("name")).sendKeys("T");
        protractor_1.element.all(protractor_1.by.css("div[class='alert alert-danger']")).get(0).getText().then(function (text) {
            console.log(text);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVtb3NwZWMxLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vZGVtb3NwZWMxLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkNBQWdEO0FBRWhELFFBQVEsQ0FBQyxxQkFBcUIsRUFBRSxHQUFFLEVBQUU7SUFFcEMsRUFBRSxDQUFDLHNCQUFzQixFQUFFLEdBQUUsRUFBRTtRQUUvQixvQkFBTyxDQUFDLEdBQUcsQ0FBQyxpREFBaUQsQ0FBQyxDQUFDO1FBQy9ELG9CQUFPLENBQUMsZUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNsRCxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUMzRCxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUNwRSxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2xELG9CQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQztZQUM5RyxvQkFBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNwQixDQUFDLENBQUMsQ0FBQTtRQUNGLG9CQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDcEQsb0JBQU8sQ0FBQyxlQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDekMsb0JBQU8sQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLG1DQUFtQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBUyxJQUFJO1lBQ2pGLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFbEIsQ0FBQyxDQUFDLENBQUE7UUFDRixvQkFBTyxDQUFDLGVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNqQyxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdkMsb0JBQU8sQ0FBQyxHQUFHLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFTLElBQUk7WUFDdEYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN0QixDQUFDLENBQUMsQ0FBQTtJQUVGLENBQUMsQ0FBQyxDQUFBO0FBR0YsQ0FBQyxDQUFDLENBQUEifQ==