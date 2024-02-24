"use strict";

(function (HarmonyHub) {

    class User {

        constructor(firstName = "", lastName = "", emailAddress = "", phone = "",
                    address = "", birthday = "", userName = "", password = "") {
            this._firstName = firstName;
            this._lastName = lastName;
            this._emailAddress = emailAddress;
            this._phone = phone;
            this._address = address;
            this._birthday = birthday;
            this._userName = userName;
            this._password = password;
        }

        //region Setters and Getters
        get firstName() {
            return this._firstName;
        }

        set firstName(value) {
            this._firstName = value;
        }

        get lastName() {
            return this._lastName;
        }

        set lastName(value) {
            this._lastName = value;
        }

        get emailAddress() {
            return this._emailAddress;
        }

        set emailAddress(value) {
            this._emailAddress = value;
        }

        get phone() {
            return this._phone;
        }

        set phone(value) {
            this._phone = value;
        }

        get address() {
            return this._address;
        }

        set address(value) {
            this._address = value;
        }

        get birthday() {
            return this._birthday;
        }

        set birthday(value) {
            this._birthday = value;
        }

        get userName() {
            return this._userName;
        }

        set userName(value) {
            this._userName = value;
        }

        get password() {
            return this._password;
        }

        set password(value) {
            this._password = value;
        }
        //endregion

        toString() {
            return `First Name: ${this._firstName}\n` +
                `Last Name: ${this._lastName}\n` +
                `Email Address: ${this._emailAddress}\n` +
                `Phone: ${this._phone}\n` +
                `Address: ${this._address}\n` +
                `Birthday: ${this._birthday}\n` +
                `Username: ${this._userName}\n` +
                `Password: ${this._password}`;
        }

        serialize() {
            if (this._firstName !== "" && this._lastName !== "" && this._userName !== "" && this._emailAddress !== "") {
                return `${this._firstName},${this._lastName},${this._userName},${this._emailAddress}`;
            }
            console.error("One or more properties of the User are empty or invalid");
            return null;
        }

        deserialize(data) {
            let propertyArray = data.split(",");
            this._firstName = propertyArray[0];
            this._lastName = propertyArray[1];
            this._userName = propertyArray[2];
            this._emailAddress = propertyArray[3];
        }


        toJSON() {
            return {
                firstName : this._firstName,
                lastName : this._lastName,
                emailAddress : this._emailAddress,
                phone : this._phone,
                address : this._address,
                birthday : this._birthday,
                userName : this._userName,
                password : this._password
            }
        }

        fromJSON(data) {
            this._firstName = data.firstName;
            this._lastName = data.lastName;
            this._emailAddress = data.emailAddress;
            this._phone = data.phone;
            this._address = data.address;
            this._birthday = data.birthday;
            this._userName = data.userName;
            this._password = data.password;
        }

    }
    HarmonyHub.User = User;

})(HarmonyHub || (HarmonyHub = {}) );
