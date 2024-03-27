"use strict";
var HarmonyHub;
(function (HarmonyHub) {
    class Event {
        _eventName;
        _coorFullName;
        _coorEmail;
        _coorPhone;
        _eventDate;
        _eventTime;
        _eventDesc;
        constructor(eventName = "", coorFullName = "", coorEmail = "", coorPhone = "", eventDate = "", eventTime = "", eventDesc = "") {
            this._eventName = eventName;
            this._coorFullName = coorFullName;
            this._coorEmail = coorEmail;
            this._coorPhone = coorPhone;
            this._eventDate = eventDate;
            this._eventTime = eventTime;
            this._eventDesc = eventDesc;
        }
        get eventName() {
            return this._eventName;
        }
        set eventName(value) {
            this._eventName = value;
        }
        get coorFullName() {
            return this._coorFullName;
        }
        set coorFullName(value) {
            this._coorFullName = value;
        }
        get coorEmail() {
            return this._coorEmail;
        }
        set coorEmail(value) {
            this._coorEmail = value;
        }
        get coorPhone() {
            return this._coorPhone;
        }
        set coorPhone(value) {
            this._coorPhone = value;
        }
        get eventDate() {
            return this._eventDate;
        }
        set eventDate(value) {
            this._eventDate = value;
        }
        get eventTime() {
            return this._eventTime;
        }
        set eventTime(value) {
            this._eventTime = value;
        }
        get eventDesc() {
            return this._eventDesc;
        }
        set eventDesc(value) {
            this._eventDesc = value;
        }
        toString() {
            return `Event Name: ${this._eventName}\n` +
                `Coordinator Full Name: ${this._coorFullName}\n` +
                `Coordinator Email Address: ${this._coorEmail}\n` +
                `Coordinator Phone Number: ${this._coorPhone}\n` +
                `Event Date: ${this._eventDate}\n` +
                `Event Time: ${this._eventTime}\n` +
                `Event Description: ${this._eventDesc}\n`;
        }
        serialize() {
            if (this._eventName !== "" && this._coorFullName !== "" && this._coorEmail !== "" && this._coorPhone !== ""
                && this._eventDate !== "" && this._eventTime !== "" && this._eventDesc !== "") {
                return `${this._eventName},${this._coorFullName},${this._coorEmail},${this._coorPhone},
                ${this._eventDate},${this._eventTime},${this._eventDesc}`;
            }
            console.error("One or more properties of the Event are empty or invalid");
            return null;
        }
        deserialize(data) {
            let propertyArray = data.split(",");
            this._eventName = propertyArray[0];
            this._coorFullName = propertyArray[1];
            this._coorEmail = propertyArray[2];
            this._coorPhone = propertyArray[3];
            this._eventDate = propertyArray[4];
            this._eventTime = propertyArray[5];
            this._eventDesc = propertyArray[6];
        }
        toJSON() {
            return {
                eventName: this._eventName,
                coorFullName: this._coorFullName,
                coorEmail: this._coorEmail,
                coorPhone: this._coorPhone,
                eventDate: this._eventDate,
                eventTime: this._eventTime,
                eventDesc: this._eventDesc,
            };
        }
        fromJSON(data) {
            this._eventName = data.eventName;
            this._coorFullName = data.coorFullName;
            this._coorEmail = data.coorEmail;
            this._coorPhone = data.coorPhone;
            this._eventDate = data.eventDate;
            this._eventTime = data.eventTime;
            this._eventDesc = data.eventDesc;
        }
    }
    HarmonyHub.Event = Event;
})(HarmonyHub || (HarmonyHub = {}));
//# sourceMappingURL=event.js.map