import { test } from './fixtures';
import { HomePage }     from '../pages/HomePage';
import { LoginPage }    from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage }     from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { ContactUsPage } from '../pages/ContactusPage';
import data             from '../test-data/data.json';
import { readExcelData } from '../utils/excelReader';



// Read login credentials from Excel file
// loginValid  → valid email & password (used in smoke2)
// loginInvalid → wrong email & password (used in smoke3)
const excelData = readExcelData();
test.beforeAll(async () => {
    
    console.log("----------------Test Suite Running--------------------");
  });``
   test.beforeEach(async ({ page }) => {
  const home = new HomePage(page);
  await home.goto();                  // ← goto() MUST be here
  await home.verifyHomePageVisible();
});

// ─----------------------------------------------------------------------------
// smoke1: Register User → Verify Account Created → Delete Account
//  ─----------------------------------------------------------------------------
test.describe('smoke1', {tag:['@sanity','@auth']},() => {
  test('Test 1: Register User', async ({ page }) => {
    const home     = new HomePage(page);
    const login    = new LoginPage(page);
    const register = new RegisterPage(page);
  
   // await home.verifyHomePageVisible();

    await home.clickSignupLogin();
    await login.verifyNewUserSignupVisible();

    const regEmail1 = `johndoe_${Date.now()}@mailnull.com`;
    await login.fillSignupNameAndEmail(data.user.name, regEmail1);
    await login.clickSignupButton();

    await register.verifyEnterAccountInfoVisible();
    await register.fillAllAccountDetails(data.user);
    await register.clickCreateAccount();

    await register.verifyAccountCreated();
    await register.clickContinue();

    await home.verifyLoggedInAs(data.user.name);
    await home.clickDeleteAccount();

    await register.verifyAccountDeleted();
    await register.clickContinueAfterDelete();
  });
});

//  ─----------------------------------------------------------------------------
// smoke2: Login User with Valid Credentials
//  ─----------------------------------------------------------------------------
test.describe('smoke2',{tag:['@sanity','@auth']}, () => {
  test('Test 2: Login User with Valid Credentials', async ({ page }) => {
    const home  = new HomePage(page);
    const login = new LoginPage(page);
    //await home.verifyHomePageVisible();

    await home.clickSignupLogin();
    await login.verifyLoginHeadingVisible();

    // email and password now come from Excel file (testdata.xlsx → LoginValid sheet)
    await login.fillLoginCredentials(excelData.loginValid.email, excelData.loginValid.password);
    await login.clickLoginButton();

    await home.verifyLoggedInAs(data.user.name);
  });
});

//  ─----------------------------------------------------------------------------
// smoke3: Login User with Incorrect Credentials
//  ─----------------------------------------------------------------------------
test.describe('smoke3', () => {
  test('Test 3: Login User with Invalid Credentials', {tag:['@sanity','@auth']},async ({ page }) => {
    const home  = new HomePage(page);
    const login = new LoginPage(page);

    // await home.goto();
    // await home.verifyHomePageVisible();

    await home.clickSignupLogin();
    await login.verifyLoginHeadingVisible();

    // email and password now come from Excel file (testdata.xlsx → LoginInvalid sheet)
    await login.fillLoginCredentials(excelData.loginInvalid.email, excelData.loginInvalid.password);
    await login.clickLoginButton();

    await login.verifyInvalidCredentialsError();

    const errorScreenshot = await page.screenshot({ fullPage: true });
    await test.info().attach('Invalid Credentials Error Message', {
      body: errorScreenshot,
      contentType: 'image/png',
    });
  });
});


//  ---------------------------------------------------------------------------
// smoke4: Add Products to Cart and Verify Details
//  ─----------------------------------------------------------------------------
test.describe('smoke4',{tag:['@sanity','@products']}, () => {
  test('Test 4: Add Two Products to Cart and Verify', async ({ page }) => {
    const home     = new HomePage(page);
    const products = new ProductsPage(page);
    const cart     = new CartPage(page);

    // await home.goto();
    // await home.verifyHomePageVisible();

    await home.clickProducts();
    await products.verifyAllProductsVisible();

    await products.hoverAndAddToCart(0);
    await products.clickContinueShopping();

    await products.hoverAndAddToCart(1);
    await products.clickViewCartInModal();

    await cart.verifyProductCount(2);
    await cart.verifyTwoProductDetails();
  });
});

//  --------------------------------------------------------------------------
// smoke5a: View Product Detail, Set Quantity to 4, Verify in Cart.... new changs
//  --------------------------------------------------------------------------
test.describe('smoke5a',{tag:['@sanity','@cart']}, () => {
  test('Test 5a: View Product Detail and Set Quantity to 4', async ({ page }) => {
    const home     = new HomePage(page);
    const products = new ProductsPage(page);
    const cart     = new CartPage(page);

    // await home.goto();
    // await home.verifyHomePageVisible();

    await products.clickViewProduct(0);
    await products.verifyProductDetailVisible();

    await products.setQuantity(4);
    await products.clickAddToCartDetail();
    await products.clickViewCartInModal();

    await cart.verifyFirstItemQuantity(4);
  });
});

//  ----------------------------------------------------------------------------
// smoke5b: Add 5 Products → Print Names & Quantities to Console
//  ----------------------------------------------------------------------------
test.describe('smoke5b', () => {
  test('Test 5b: Add 5 Products and Print Cart Summary to Console',{tag:['@sanity','@cart']}, async ({ page }) => {
    const home     = new HomePage(page);
    const products = new ProductsPage(page);
    const cart     = new CartPage(page);

    // await home.goto();
    // await home.verifyHomePageVisible();

    await home.clickProducts();
    await products.verifyAllProductsVisible();

    await products.addMultipleProductsToCart(5);

    await cart.verifyCartPageVisible();

    const cartScreenshot = await page.screenshot({ fullPage: true });
    await test.info().attach('Cart Product List', {
      body: cartScreenshot,
      contentType: 'image/png',
    });

    await cart.printCartSummary();
  });
});

// ----------------------------------------------------------------------------
// smoke6: Add Review for Product
// ----------------------------------------------------------------------------
test.describe('smoke6', {tag:['@sanity','@products']},() => {
  test('Test 6: Write Product Review', async ({ page }) => {
    const home     = new HomePage(page);
    const products = new ProductsPage(page);

    // await home.goto();
    // await home.verifyHomePageVisible();

    await home.clickProducts();
    await products.verifyAllProductsVisible();

    await products.clickViewProduct(0);
    await products.verifyWriteYourReviewVisible();

    await products.fillReviewForm(
      data.review.name,
      data.review.email,
      data.review.text
    );

    await products.clickSubmitReview();
    await products.verifyReviewSuccess();
  });
});

// ----------------------------------------------------------------------------
// smoke7: Place Order — Register while Checkout
// ----------------------------------------------------------------------------
test.describe('smoke7',{tag:['@sanity','@checkout']}, () => {
  test('Test 7: Place Order - Register While Checkout', async ({ page }) => {
    const home     = new HomePage(page);
    const login    = new LoginPage(page);
    const register = new RegisterPage(page);
    const cart     = new CartPage(page);
    const checkout = new CheckoutPage(page);

    const testUser = {
      ...data.user,
      email: `johndoe_t7_${Date.now()}@mailnull.com`,
    };

    // await home.goto();
    // await home.verifyHomePageVisible();

    await home.addFirstProductToCart();
    await home.clickContinueShopping();

    await home.clickCart();
    await cart.verifyCartPageVisible();

    await cart.clickProceedToCheckout();
    await cart.clickRegisterLogin();

    await login.verifyNewUserSignupVisible();
    await login.fillSignupNameAndEmail(testUser.name, testUser.email);
    await login.clickSignupButton();

    await register.verifyEnterAccountInfoVisible();
    await register.fillAllAccountDetails(testUser);
    await register.clickCreateAccount();

    await register.verifyAccountCreated();
    await register.clickContinue();

    await home.verifyLoggedInAs(testUser.name);
    await home.clickCart();
    await cart.clickProceedToCheckout();

    await checkout.verifyAddressAndOrderVisible();
    await checkout.enterCommentAndPlaceOrder(data.orderComment);
    await checkout.fillPaymentDetails(data.payment);
    await checkout.clickPayAndConfirm();

    await checkout.verifyOrderSuccess();

    await home.clickDeleteAccount();
    await register.verifyAccountDeleted();
    await register.clickContinueAfterDelete();
  });
});

test.describe('smoke8', () => {
  test('Test 8: Contact Us page', {tag:['@sanity','@contact']},async ({ page }) => {

    // ----------Home Page --------------------
    const home = new HomePage(page);
    
    // await home.goto();
    // await home.verifyHomePageVisible();

    // ------ Contact Us Page ------------------------------------
    const contact = new ContactUsPage(page);

    await contact.clickContactUs();
    await contact.verifyContactUsPageVisible();

    await contact.enterName('Sample Name');
    await contact.enterEmail('sample@mail.com');
    await contact.enterSubject('Test Subject');
    await contact.enterMessage('This is a sample message for testing purposes.');

    await contact.clickSubmit();
    await contact.verifySuccessMessage();
  });
});