"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const protractor_1 = require("protractor");
class loginPage {
    constructor() {
        this.signIn = protractor_1.element(protractor_1.by.css("a[href='http://automationpractice.com/index.php?controller=my-account']"));
        this.emailCreate = protractor_1.element(protractor_1.by.css("input[id='email_create']"));
        this.createAccountBtn = protractor_1.element(protractor_1.by.css("button[class='btn btn-default button button-medium exclusive']"));
        this.gender = protractor_1.element(protractor_1.by.css("input[name='id_gender']"));
        this.firstName = protractor_1.element(protractor_1.by.css("input[id='customer_firstname']"));
        this.lastName = protractor_1.element(protractor_1.by.css("input[id='customer_lastname']"));
        this.email = protractor_1.element(protractor_1.by.css("input[id='email']"));
        this.password = protractor_1.element(protractor_1.by.css("input[id='passwd']"));
        this.days = protractor_1.element.all(protractor_1.by.css("select[id='days']"));
        this.months = protractor_1.element.all(protractor_1.by.css("select[id='months']"));
        this.years = protractor_1.element.all(protractor_1.by.css("select[id='years']"));
        this.newsletter = protractor_1.element(protractor_1.by.css("input[id='newsletter']"));
        this.offers = protractor_1.element(protractor_1.by.css("input[id='optin']"));
        this.aFirstName = protractor_1.element(protractor_1.by.css("input[id='firstname']"));
        this.aLastName = protractor_1.element(protractor_1.by.css("input[id='lastname']"));
        this.aCompany = protractor_1.element(protractor_1.by.css("input[id='company']"));
        this.aAddress = protractor_1.element(protractor_1.by.css("input[id='address1']"));
        this.aCity = protractor_1.element(protractor_1.by.css("input[id='city']"));
        this.aState = protractor_1.element.all(protractor_1.by.css("select[id='id_state']"));
        this.aPostcode = protractor_1.element(protractor_1.by.css("input[id='postcode']"));
        this.aCountry = protractor_1.element.all(protractor_1.by.css("select[id='id_country']"));
        this.aText = protractor_1.element(protractor_1.by.css("textarea[id='other']"));
        this.aPhone = protractor_1.element(protractor_1.by.css("input[id='phone']"));
        this.aMobile = protractor_1.element(protractor_1.by.css("input[id='phone_mobile']"));
        this.aAddress2 = protractor_1.element(protractor_1.by.css("input[id='alias']"));
        this.aRegister = protractor_1.element(protractor_1.by.css("button[id='submitAccount']"));
        this.aHeaderInfo = protractor_1.element(protractor_1.by.css("div[class='header_user_info']"));
        this.logoutText = protractor_1.element(protractor_1.by.css("a[class='logout']"));
        this.logout = protractor_1.element(protractor_1.by.css("a[href='http://automationpractice.com/index.php?mylogout=']"));
        this.email2 = protractor_1.element(protractor_1.by.css("input[id='email']"));
        this.password2 = protractor_1.element(protractor_1.by.css("input[id='passwd']"));
        this.submit = protractor_1.element(protractor_1.by.css("button[id='SubmitLogin']"));
        this.womenDrpDwn = protractor_1.element(protractor_1.by.css("a[href='http://automationpractice.com/index.php?id_category=3&controller=category']"));
        this.firstItem = protractor_1.element(protractor_1.by.css("img[src='http://automationpractice.com/img/p/1/1-home_default.jpg']"));
        this.addtocart = protractor_1.element(protractor_1.by.css("button[name='Submit']"));
        this.proceedToCheckout = protractor_1.element(protractor_1.by.css("a[href='http://automationpractice.com/index.php?controller=order']"));
        this.proceedToCheckout2 = protractor_1.element(protractor_1.by.css("a[href='http://automationpractice.com/index.php?controller=order&step=1']"));
        this.processAddressBtn = protractor_1.element(protractor_1.by.css("button[name='processAddress']"));
        this.termsCheckbox = protractor_1.element(protractor_1.by.css("input[id='cgv']"));
        this.proceedToCheckout3 = protractor_1.element(protractor_1.by.css("button[name='processCarrier']"));
        this.bankWireBtn = protractor_1.element(protractor_1.by.css("a[class='bankwire']"));
        this.confirmOrderBtn = protractor_1.element(protractor_1.by.css("button[class='button btn btn-default button-medium']"));
        this.confirmationText = protractor_1.element(protractor_1.by.css("p[class='cheque-indent']")).element(protractor_1.by.css("strong[class='dark']"));
    }
}
exports.loginPage = loginPage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW5QYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vcGFnZU9iamVjdHMvbG9naW5QYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkNBQTRFO0FBRTVFLE1BQWEsU0FBUztJQWdEbEI7UUFDSSxJQUFJLENBQUMsTUFBTSxHQUFHLG9CQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyx5RUFBeUUsQ0FBQyxDQUFDLENBQUM7UUFDekcsSUFBSSxDQUFDLFdBQVcsR0FBRyxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxDQUFDO1FBQy9ELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMsZ0VBQWdFLENBQUMsQ0FBQyxDQUFDO1FBQzFHLElBQUksQ0FBQyxNQUFNLEdBQUcsb0JBQU8sQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQztRQUN6RCxJQUFJLENBQUMsU0FBUyxHQUFHLG9CQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDLENBQUM7UUFDbkUsSUFBSSxDQUFDLFFBQVEsR0FBRyxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMsK0JBQStCLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLElBQUksQ0FBQyxLQUFLLEdBQUcsb0JBQU8sQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQztRQUNsRCxJQUFJLENBQUMsUUFBUSxHQUFHLG9CQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7UUFDdEQsSUFBSSxDQUFDLElBQUksR0FBRyxvQkFBTyxDQUFDLEdBQUcsQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQztRQUNyRCxJQUFJLENBQUMsTUFBTSxH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