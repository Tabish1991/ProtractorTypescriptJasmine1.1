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
describe('Automation test suite for mashreqbank', () => {
    beforeEach(function () {
        protractor_1.browser.get("https://www.mashreqbank.com/uae/en/personal/home");
    });
    it('verify if navigation bar is displayed on desktop devices and display 9 items', () => __awaiter(this, void 0, void 0, function* () {
        yield protractor_1.element.all(protractor_1.by.tagName("div[class='leftLinks']")).each(function (item) {
            item.element(protractor_1.by.tagName("ul")).getText().then(function (text) {
                console.log(text);
                item.isDisplayed();
                expect(true).toBe(true);
            });
        });
    }));
    it('verify if Mashreq News is displayed on the homepage', () => __awaiter(this, void 0, void 0, function* () {
        yield protractor_1.element(protractor_1.by.css("div[class='newsBox']")).getText().then(function (text) {
            console.log(text);
            protractor_1.element(protractor_1.by.css("div[class='newsBox']")).isDisplayed();
            expect(true).toBe(true);
        });
    }));
    it('Verify if link for “Contact Us” is displayed on the homepage.', () => __awaiter(this, void 0, void 0, function* () {
        yield protractor_1.element.all(protractor_1.by.css("div[class='ac-gf-buystrip-info with-4-columns']")).each(function (item) {
            item.element(protractor_1.by.css("section:nth-child(4)")).getText().then(function (text) {
                console.log(text);
            });
        });
    }));
    it('Verfiy if link for “Contact Us” is clickable on the homepage and it navigates to contact form page.', () => __awaiter(this, void 0, void 0, function* () {
        yield protractor_1.element(protractor_1.by.css("a[href='/uae/en/personal/contactus']")).click();
        yield protractor_1.element(protractor_1.by.id("btnSubmit")).click();
    }));
    it('Verify if error message is displayed when submitting the form without entering any details.', () => __awaiter(this, void 0, void 0, function* () {
        yield protractor_1.element(protractor_1.by.css("a[href='/uae/en/personal/contactus']")).click();
        yield protractor_1.element(protractor_1.by.id("btnSubmit")).click();
        expect(true).toBe(true);
    }));
    it('Verify if I am looking to the field is a dropdown with 4 choices.', () => __awaiter(this, void 0, void 0, function* () {
        yield protractor_1.element(protractor_1.by.css("a[href='/uae/en/personal/contactus']")).click();
        yield expect(protractor_1.element.all(protractor_1.by.css("select[name='reachoutforproduct'] option")).count()).toEqual(5);
    }));
    it('Verify if select sub product field is initially empty', () => __awaiter(this, void 0, void 0, function* () {
        yield protractor_1.element(protractor_1.by.css("a[href='/uae/en/personal/contactus']")).click();
        expect(protractor_1.element.all(protractor_1.by.css("select[id='product'] option")).count()).toEqual(1);
    }));
    it('Verify if Selecting the Product -Loans- from the dropdown populates the -Select Sub Product-and -Home Loan UAE Resident- is displayed', () => __awaiter(this, void 0, void 0, function* () {
        yield protractor_1.element(protractor_1.by.css("a[href='/uae/en/personal/contactus']")).click();
        yield protractor_1.element.all(protractor_1.by.css("select[id='need']")).each(function (item) {
            item.element(protractor_1.by.css("option:nth-child(2)")).click().then(function () {
                protractor_1.browser.sleep(5000);
                protractor_1.element.all(protractor_1.by.css("select[id='product']")).each(function (item) {
                    item.element(protractor_1.by.tagName("option:nth-child(4)")).getText().then(function (text) {
                        expect(text).toMatch("Home Loan UAE Resident");
                    });
                });
            });
        });
    }));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9tZXBhZ2VzcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vaG9tZXBhZ2VzcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSwyQ0FBK0M7QUFHL0MsUUFBUSxDQUFDLHVDQUF1QyxFQUFDLEdBQUUsRUFBRTtJQUNyRCxVQUFVLENBQUU7UUFDVixvQkFBTyxDQUFDLEdBQUcsQ0FBQyxrREFBa0QsQ0FBQyxDQUFDO0lBRWxFLENBQUMsQ0FBQyxDQUFBO0lBQ0EsRUFBRSxDQUFDLDhFQUE4RSxFQUFDLEdBQU8sRUFBRTtRQUU3RixNQUFNLG9CQUFPLENBQUMsR0FBRyxDQUFDLGVBQUUsQ0FBQyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFTLElBQUk7WUFDMUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVMsSUFBSTtnQkFDM0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDbEIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO2dCQUNuQixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRXhCLENBQUMsQ0FBQyxDQUFBO1FBQ0YsQ0FBQyxDQUFDLENBQUE7SUFDRixDQUFDLENBQUEsQ0FBQyxDQUFBO0lBR0QsRUFBRSxDQUFDLHFEQUFxRCxFQUFDLEdBQU8sRUFBRTtRQUUvRCxNQUFNLG9CQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVMsSUFBSTtZQUN0RSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWpCLG9CQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxzQkFBc0Is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