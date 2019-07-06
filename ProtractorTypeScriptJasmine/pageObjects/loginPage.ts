import { ElementFinder, ElementArrayFinder, element, by } from "protractor";

export class loginPage {

    signIn: ElementFinder;
    emailCreate: ElementFinder;
    createAccountBtn: ElementFinder;
    gender: ElementFinder;
    firstName: ElementFinder;
    lastName: ElementFinder;
    email: ElementFinder;
    password: ElementFinder;
    days: ElementArrayFinder;
    months: ElementArrayFinder;
    years: ElementArrayFinder;
    newsletter: ElementFinder;
    offers: ElementFinder;
    aFirstName: ElementFinder;
    aLastName: ElementFinder;
    aCompany: ElementFinder;
    aAddress: ElementFinder;
    aCity: ElementFinder;
    aState: ElementArrayFinder;
    aPostcode: ElementFinder;
    aCountry: ElementArrayFinder;
    aText: ElementFinder;
    aPhone: ElementFinder;
    aMobile: ElementFinder;
    aAddress2: ElementFinder;
    aRegister: ElementFinder;
    aHeaderInfo: ElementFinder;
    logoutText: ElementFinder;
    logout: ElementFinder;
    email2: ElementFinder;
    password2: ElementFinder;
    submit: ElementFinder;
    womenDrpDwn: ElementFinder;
    firstItem: ElementFinder;
    addtocart: ElementFinder;
    proceedToCheckout: ElementFinder;
    proceedToCheckout2: ElementFinder;
    processAddressBtn: ElementFinder;
    termsCheckbox: ElementFinder;
    proceedToCheckout3: ElementFinder;
    bankWireBtn: ElementFinder;
    confirmOrderBtn: ElementFinder;
    confirmationText: ElementFinder;



    constructor() {
        this.signIn = element(by.css("a[href='http://automationpractice.com/index.php?controller=my-account']"));
        this.emailCreate = element(by.css("input[id='email_create']"));
        this.createAccountBtn = element(by.css("button[class='btn btn-default button button-medium exclusive']"));
        this.gender = element(by.css("input[name='id_gender']"));
        this.firstName = element(by.css("input[id='customer_firstname']"));
        this.lastName = element(by.css("input[id='customer_lastname']"));
        this.email = element(by.css("input[id='email']"));
        this.password = element(by.css("input[id='passwd']"));
        this.days = element.all(by.css("select[id='days']"));
        this.months = element.all(by.css("select[id='months']"));
        this.years = element.all(by.css("select[id='years']"));
        this.newsletter = element(by.css("input[id='newsletter']"));
        this.offers = element(by.css("input[id='optin']"));
        this.aFirstName = element(by.css("input[id='firstname']"));
        this.aLastName = element(by.css("input[id='lastname']"));
        this.aCompany = element(by.css("input[id='company']"));
        this.aAddress = element(by.css("input[id='address1']"));
        this.aCity = element(by.css("input[id='city']"));
        this.aState = element.all(by.css("select[id='id_state']"));
        this.aPostcode = element(by.css("input[id='postcode']"));
        this.aCountry = element.all(by.css("select[id='id_country']"));
        this.aText = element(by.css("textarea[id='other']"));
        this.aPhone = element(by.css("input[id='phone']"));
        this.aMobile = element(by.css("input[id='phone_mobile']"));
        this.aAddress2 = element(by.css("input[id='alias']"));
        this.aRegister = element(by.css("button[id='submitAccount']"));
        this.aHeaderInfo = element(by.css("div[class='header_user_info']"));
        this.logoutText = element(by.css("a[class='logout']"));
        this.logout = element(by.css("a[href='http://automationpractice.com/index.php?mylogout=']"));
        this.email2 = element(by.css("input[id='email']"));
        this.password2 = element(by.css("input[id='passwd']"));
        this.submit = element(by.css("button[id='SubmitLogin']"));
        this.womenDrpDwn = element(by.css("a[href='http://automationpractice.com/index.php?id_category=3&controller=category']"));
        this.firstItem = element(by.css("img[src='http://automationpractice.com/img/p/1/1-home_default.jpg']"));
        this.addtocart = element(by.css("button[name='Submit']"));
        this.proceedToCheckout = element(by.css("a[href='http://automationpractice.com/index.php?controller=order']"));
        this.proceedToCheckout2 = element(by.css("a[href='http://automationpractice.com/index.php?controller=order&step=1']"));
        this.processAddressBtn = element(by.css("button[name='processAddress']"));
        this.termsCheckbox = element(by.css("input[id='cgv']"));
        this.proceedToCheckout3 = element(by.css("button[name='processCarrier']"));
        this.bankWireBtn = element(by.css("a[class='bankwire']"));
        this.confirmOrderBtn = element(by.css("button[class='button btn btn-default button-medium']"));
        this.confirmationText = element(by.css("p[class='cheque-indent']")).element(by.css("strong[class='dark']"));
    }
}

