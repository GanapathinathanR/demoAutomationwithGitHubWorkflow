import { APIRequestContext } from "@playwright/test"

export class ApiPage {

    private request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    // ----------------------------------------
    // GET — Products List
    // ----------------------------------------
    async getProductsList() {
        const resp = await this.request.get("https://automationexercise.com/api/productsList", {
            maxRedirects: 5
        });
        const body = await resp.json();
        console.log("Response Status Code :", resp.status());
        console.log("Response Status Text  :", resp.statusText());
        console.log("Response Body         :", body);
        return { resp, body };
    }

    // ----------------------------------------
    // POST — Products List (negative)
    // ----------------------------------------
    async postProductsList() {
        const resp = await this.request.post("https://automationexercise.com/api/productsList", {
            maxRedirects: 5
        });
        const body = await resp.json();
        console.log("Response Status Code :", resp.status());
        console.log("Response Status Text  :", resp.statusText());
        console.log("Response Body         :", body);
        return { resp, body };
    }

    //----------------------------------------
    // POST — Create Account
    //----------------------------------------
    async createAccount(data: {
        name          : string,
        email         : string,
        password      : string,
        title         : string,
        birth_date    : string,
        birth_month   : string,
        birth_year    : string,
        firstname     : string,
        lastname      : string,
        company       : string,
        address1      : string,
        address2      : string,
        country       : string,
        zipcode       : string,
        state         : string,
        city          : string,
        mobile_number : string
    }) {
        const resp = await this.request.post("https://automationexercise.com/api/createAccount", {
            form: data,
            maxRedirects: 5
        });
        const body = await resp.json();
        console.log("Response Status Code :", resp.status());
        console.log("Response Status Text  :", resp.statusText());
        console.log("Response Body         :", body);
        return { resp, body };
    }

    // ----------------------------------------
    // DELETE — Delete Account
    // ----------------------------------------
    async deleteAccount(email: string, password: string) {
        const resp = await this.request.delete("https://automationexercise.com/api/deleteAccount", {
            form: { email, password },
            maxRedirects: 5
        });
        const body = await resp.json();
        console.log("Response Status Code :", resp.status());
        console.log("Response Status Text  :", resp.statusText());
        console.log("Response Body         :", body);
        return { resp, body };
    }

    // ----------------------------------------
    // PUT — Update Account
    //----------------------------------------
    async updateAccount(data: {
        name          : string,
        email         : string,
        password      : string,
        title         : string,
        birth_date    : string,
        birth_month   : string,
        birth_year    : string,
        firstname     : string,
        lastname      : string,
        company       : string,
        address1      : string,
        address2      : string,
        country       : string,
        zipcode       : string,
        state         : string,
        city          : string,
        mobile_number : string
    }) {
        const resp = await this.request.put("https://automationexercise.com/api/updateAccount", {
            form: data,
            maxRedirects: 5
        });
        const body = await resp.json();
        console.log("Response Status Code :", resp.status());
        console.log("Response Status Text  :", resp.statusText());
        console.log("Response Body         :", body);
        return { resp, body };
    }

}