const { Member, validateMember, validateUpdate, validateEmail, validatePassword, validateNotification } = require("../../../models/Member");
const Joi = require("@hapi/joi"); // request validation middleware
Joi.objectId = require("joi-objectid")(Joi); // allows joi to validate mongo Object Id's
const config = require('config');

describe('validateMember', () =>{
    it("should return error as false if req.body is validated by Joi", () => {
        const member = {
            name : "12345",
            address1 : "1234567890",
            address2 : "",
            city : "City",
            state_prov : "AB",
            country : "USA",
            zip_postal : "12345",
            phone: '1234567890',
            email: 'email@email.com',
            password: '12345678',
            shipping_same: true,
            shipping_name: '12345',
            shipping_address1: '1234567890',
            shipping_address2: '',
            shipping_city: "City",
            shipping_state_prov: "AB",
            shipping_country: "USA",
            shipping_zip_postal: "12345",
            shipping_phone: "1234567890",
            shipping_email: "email@email.com"
        };
        const {error} = validateMember(member);
        expect(error).toBeFalsy();
    });

    it("should return error as true if req.body is invalidated by Joi", ()=>{
        const {error} = validateMember({});
        expect(error).toBeTruthy();
    });
});

describe('validateUpdate', ()=>{
    it("should return error as false if req.body is validated by Joi", () => {
        const member = {
            name : "12345",
            address1 : "1234567890",
            address2 : "",
            city : "City",
            state_prov : "AB",
            country : "USA",
            zip_postal : "12345",
            phone: '1234567890',
            shipping_same: true,
            shipping_name: '12345',
            shipping_address1: '1234567890',
            shipping_address2: '',
            shipping_city: "City",
            shipping_state_prov: "AB",
            shipping_country: "USA",
            shipping_zip_postal: "12345",
            shipping_phone: "1234567890",
            shipping_email: "email@email.com"
        };
        const {error} = validateUpdate(member);
        expect(error).toBeFalsy();
    });

    it("should return error as true if req.body is invalidated by Joi", ()=>{
        const {error} = validateUpdate({});
        expect(error).toBeTruthy();
    });
});

describe('validateEmail', ()=>{
    it ('should return error as false if email in req.body is validated by Joi', ()=>{
        const {error} = validateEmail({email: "email@email.com"});
        expect(error).toBeFalsy();
    });

    it ('should return error as true if email in req.body is invalidated by Joi', ()=>{
        const {error} = validateEmail({});
        expect(error).toBeTruthy();
    });
});

describe('validatePassword', ()=>{
    it('should return error as false if req.body is validated by Joi',()=>{
        const member = {
            oldpassword: "12345678",
            newpassword: "87654321",
            confirmpassword: "87654321"
        }
        const {error} = validatePassword(member);
        expect(error).toBeFalsy();
    });

    it('should return error as true if req.body is invalidated by Joi', ()=>{
        const {error} = validatePassword({});
        expect(error).toBeTruthy();
    });
});

describe('validateNotification', ()=>{
    it ('should return error as false if req.body is validated by Joi',()=>{
        const member = {
            recipients: ["5d2123b90a568e001fde9d15"],
            message: "Hello World",
            clickTo: ""
        };
        const {error} = validateNotification(member);
        expect(error).toBeFalsy();
    });

    it ('should return error as true if req.body is invalidated by Joi', ()=>{
        const {error} = validateNotification({});
        expect(error).toBeTruthy();
    });
});


