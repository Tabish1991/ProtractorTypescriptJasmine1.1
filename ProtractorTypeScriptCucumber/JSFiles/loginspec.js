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
const loginPage_1 = require("./pageObjects/loginPage");
describe('User Account Creation', () => {
    let d = require("./testdata");
    let using = require('jasmine-data-provider');
    protractor_1.browser.waitForAngularEnabled(false);
    let log = new loginPage_1.loginPage();
    beforeEach(function () {
        protractor_1.browser.get("http://automationpractice.com/index.php").then(function () {
            protractor_1.browser.sleep(3000);
            log.signIn.click();
        });
    });
    using(d.datadriven, function (data, description) {
        it('verify if user is able to create an account', () => __awaiter(this, void 0, void 0, function* () {
            yield log.emailCreate.sendKeys(data.emailCreate);
            yield log.createAccountBtn.click().then(function () {
                protractor_1.browser.sleep(3000);
            });
            yield protractor_1.browser.getTitle().then(function (text) {
                expect(text).toMatch("Login - My Store");
            });
            yield log.gender.click();
            yield log.firstName.sendKeys(data.firstName);
            yield log.lastName.sendKeys(data.lastName);
            yield log.email.clear();
            yield log.email.sendKeys(data.email);
            yield log.password.sendKeys(data.password);
            yield log.days.each(function (item) {
                item.element(protractor_1.by.css("option:nth-child(11)")).click();
            });
            yield log.months.each(function (item) {
                item.element(protractor_1.by.css("option:nth-child(2)")).click();
            });
            yield log.years.each(function (item) {
                item.element(protractor_1.by.css("option:nth-child(30)")).click();
            });
            yield log.newsletter.click();
            yield log.offers.click();
            yield log.aFirstName.sendKeys(data.aFirstName);
            yield log.aLastName.sendKeys(data.aLastName);
            yield log.aCompany.sendKeys(data.aCompany);
            yield log.aAddress.sendKeys(data.aAddress);
            yield log.aCity.sendKeys(data.aCity);
            yield log.aState.each(function (item) {
                item.element(protractor_1.by.css("option:nth-child(2)")).click();
            });
            yield log.aPostcode.sendKeys(data.aPostcode);
            yield log.aCountry.each(function (item) {
                item.element(protractor_1.by.css("option:nth-child(2)")).click();
            });
            yield log.aText.sendKeys(data.aText);
            yield log.aPhone.sendKeys(data.aPhone);
            yield log.aMobile.sendKeys(data.aMobile);
            yield log.aAddress2.sendKeys(data.aAddress2);
            yield log.aRegister.click().then(function () {
                protractor_1.browser.sleep(3000);
            });
            yield log.aHeaderInfo.getText().then(function (text) {
                expect(log.aHeaderInfo.getText()).toContain(text);
            });
            yield log.logoutText.getText().then(function (text) {
                expect(log.logoutText.getText()).toContain(text).then(function () {
                    protractor_1.browser.sleep(4000);
                });
            });
        }));
        it('verify if user is able to login with an existing user', () => __awaiter(this, void 0, void 0, function* () {
            yield log.logout.click();
            yield log.email2.clear();
            yield log.email2.sendKeys(data.email2);
            yield log.password2.clear();
            yield log.password2.sendKeys(data.password2);
            yield log.submit.click();
            yield log.womenDrpDwn.click();
            yield log.firstItem.click();
            yield log.addtocart.click();
            yield log.proceedToCheckout.click().then(function () {
                protractor_1.browser.sleep(2000);
            });
            yield log.proceedToCheckout2.click().then(function () {
                protractor_1.browser.sleep(2000);
            });
            yield log.processAddressBtn.click();
            yield log.termsCheckbox.click();
            yield log.proceedToCheckout3.click();
            yield log.bankWireBtn.click();
            yield log.confirmOrderBtn.click();
            yield protractor_1.browser.getTitle().then(function (title) {
                expect(title).toBe("Order confirmation - My Store");
            });
            yield log.confirmationText.getText().then(function (text) {
                expect(text).toMatch("Your order on My Store is complete.");
            });
            yield log.logout.click();
        }));
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vbG9naW5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSwyQ0FBa0Q7QUFFbEQsdURBQW9EO0FBRXBELFFBQVEsQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLEVBQUU7SUFDbkMsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzlCLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0lBRTdDLG9CQUFPLENBQUMscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDckMsSUFBSSxHQUFHLEdBQUcsSUFBSSxxQkFBUyxFQUFFLENBQUM7SUFDMUIsVUFBVSxDQUFDO1FBQ1Asb0JBQU8sQ0FBQyxHQUFHLENBQUMseUNBQXlDLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDeEQsb0JBQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDcEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUV2QixDQUFDLENBQUMsQ0FBQTtJQUVOLENBQUMsQ0FBQyxDQUFBO0lBQ0YsS0FBSyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsVUFBVSxJQUFJLEVBQUUsV0FBVztRQUMzQyxFQUFFLENBQUMsNkNBQTZDLEVBQUUsR0FBUyxFQUFFO1lBRXpELE1BQU0sR0FBRyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBRWpELE1BQU0sR0FBRyxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQztnQkFDcEMsb0JBQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDeEIsQ0FBQyxDQUFDLENBQUE7WUFHRixNQUFNLG9CQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSTtnQkFDeEMsTUFBTSxD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