import { test, expect } from "@playwright/test"
import { ApiPage } from "../../pages/ApiPage"

// -----------------------------------------------
test.describe('get', () => {

    test("Test Get Products List API", async function({ request }) {
        const apiPage = new ApiPage(request);

        const { resp, body } = await apiPage.getProductsList();

        console.log("GET");
        expect(resp.status()).toBe(200);
        expect(body.responseCode).toBe(200);
        expect(body.products).toBeTruthy();
        expect(body.products.length).toBeGreaterThan(0);
    });
});

//-----------------------------------------------
test.describe('postnegative', () => {

    test("Test POST Products List API - 405 Method Not Allowed", async function({ request }) {
        const apiPage = new ApiPage(request);

        const { resp, body } = await apiPage.postProductsList();

        console.log("POST");
        expect(resp.status()).toBe(200);
        expect(body.responseCode).toBe(405);
        expect(body.message).toBe("This request method is not supported.");
    });
});

// -----------------------------------------------
test.describe('create', () => {

    test("Test POST Create Account API - 201 User Created", async function({ request }) {
        const apiPage = new ApiPage(request);

        const { resp, body } = await apiPage.createAccount({
            name          : "Ganapathi",
            email         : "ganapathi123@test.com",
            password      : "gana@1234",
            title         : "Mr",
            birth_date    : "21",
            birth_month   : "07",
            birth_year    : "2005",
            firstname     : "Ganapathi",
            lastname      : "ragu",
            company       : "Test Company",
            address1      : "123 Main Street",
            address2      : "Apt 4B",
            country       : "India",
            zipcode       : "10001",
            state         : "Tamilnadu",
            city          : "Coimbatore",
            mobile_number : "9876543210"
        });

        console.log("POST CREATE");
        expect(resp.status()).toBe(200);
        expect(body.responseCode).toBe(201);
        expect(body.message).toBe("User created!");
    });
});

//-----------------------------------------------


test.describe('update', () => {

    test("Test PUT Update Account API - 200 User Updated", async function({ request }) {
        const apiPage = new ApiPage(request);

        const { resp, body } = await apiPage.updateAccount({
            email         : "ganapathi123@test.com",
            password      : "gana@1234",
            name          : "Ganapathi Updated",
            title         : "Mr",
            birth_date    : "21",
            birth_month   : "07",
            birth_year    : "2005",
            firstname     : "Ganapathi",
            lastname      : "Ragu Updated",
            company       : "Updated Company",
            address1      : "456 New Street",
            address2      : "Floor 2",
            country       : "India",
            zipcode       : "60002",
            state         : "Tamilnadu",
            city          : "Chennai",
            mobile_number : "9999999999"
        });

        console.log("PUT UPDATE");
        expect(resp.status()).toBe(200);
        expect(body.responseCode).toBe(200);
        expect(body.message).toBe("User updated!");
    });
});

//-----------------------------------------------
test.describe('delete', () => {

    test("Test Delete", async function({ request }) {
        const apiPage = new ApiPage(request);

        const { resp, body } = await apiPage.deleteAccount(
            "ganapathi123@test.com",
            "gana@1234"
        );

        console.log("DELETE");
        expect(resp.status()).toBe(200);
        expect(body.responseCode).toBe(200);
        expect(body.message).toBe("Account deleted!");
    });
});
