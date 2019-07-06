import { element, by, browser } from "protractor";
import { async } from "q";
import { loginPage } from "./pageObjects/loginPage";

describe('User Account Creation', () => {
    let d = require("./testdata");
    let using = require('jasmine-data-provider');

    browser.waitForAngularEnabled(false);
    let log = new loginPage();
    beforeEach(function () {
        browser.get("http://automationpractice.com/index.php").then(function () {
            browser.sleep(3000);
            log.signIn.click();

        })

    })
    using(d.datadriven, function (data, description) {
        it('verify if user is able to create an account', async () => {

            await log.emailCreate.sendKeys(data.emailCreate);

            await log.createAccountBtn.click().then(function () {
                browser.sleep(3000);
            })


            await browser.getTitle().then(function (text) {
                expect(text).toMatch("Login - My Store");

            })
            await log.gender.click();
            await log.firstName.sendKeys(data.firstName);
            await log.lastName.sendKeys(data.lastName);
            await log.email.clear();
            await log.email.sendKeys(data.email);
            await log.password.sendKeys(data.password);

            await log.days.each(function (item) {
                item.element(by.css("option:nth-child(11)")).click();

            })
            await log.months.each(function (item) {
                item.element(by.css("option:nth-child(2)")).click();

            })
            await log.years.each(function (item) {
                item.element(by.css("option:nth-child(30)")).click();

            })
            await log.newsletter.click();
            await log.offers.click();
            await log.aFirstName.sendKeys(data.aFirstName);
            await log.aLastName.sendKeys(data.aLastName);
            await log.aCompany.sendKeys(data.aCompany);
            await log.aAddress.sendKeys(data.aAddress);
            await log.aCity.sendKeys(data.aCity);

            await log.aState.each(function (item) {
                item.element(by.css("option:nth-child(2)")).click();

            })

            await log.aPostcode.sendKeys(data.aPostcode);

            await log.aCountry.each(function (item) {
                item.element(by.css("option:nth-child(2)")).click();
            })

            await log.aText.sendKeys(data.aText);
            await log.aPhone.sendKeys(data.aPhone);

            await log.aMobile.sendKeys(data.aMobile);
            await log.aAddress2.sendKeys(data.aAddress2);
            await log.aRegister.click().then(function () {
                browser.sleep(3000);
            })

            await log.aHeaderInfo.getText().then(function (text) {
                expect(log.aHeaderInfo.getText()).toContain(text);
            })
            await log.logoutText.getText().then(function (text) {
                expect(log.logoutText.getText()).toContain(text).then(function () {
                    browser.sleep(4000);


                })
            })

        })




        it('verify if user is able to login with an existing user', async () => {

            await log.logout.click();

            await log.email2.clear();

            await log.email2.sendKeys(data.email2);
            await log.password2.clear();
            await log.password2.sendKeys(data.password2);
            await log.submit.click();
            await log.womenDrpDwn.click();
            await log.firstItem.click();
            await log.addtocart.click();
            await log.proceedToCheckout.click().then(function () {
                browser.sleep(2000);
            })
            await log.proceedToCheckout2.click().then(function () {
                browser.sleep(2000);
            })

            await log.processAddressBtn.click();
            await log.termsCheckbox.click();

            await log.proceedToCheckout3.click();

            await log.bankWireBtn.click();

            await log.confirmOrderBtn.click();
            await browser.getTitle().then(function (title) {
                expect(title).toBe("Order confirmation - My Store");
            })
            await log.confirmationText.getText().then(function (text) {
                expect(text).toMatch("Your order on My Store is complete.");
            })
            await log.logout.click();
        })

    })

})
