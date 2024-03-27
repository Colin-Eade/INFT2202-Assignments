"use strict";

namespace HarmonyHub {

    /**
     * Represents a registered Harmony Hub Event.
     */
    export class Event {

        private _eventName: string;
        private _coorUserName: string;
        private _coorFullName: string;
        private _coorEmail: string;
        private _coorPhone: string;
        private _eventDate: string
        private _eventTime: string;
        private _eventDesc: string;

        //region Constructors

        /**
         * Creates an Event object with all the required attributes.
         * @param eventName The name of the event
         * @param coorFullName The first and last name of the event coordinator
         * @param coorUserName The username of the user creating the event
         * @param coorEmail The event coordinator's email
         * @param coorPhone The event coordinator's phone number
         * @param eventDate The date of the event
         * @param eventTime The time of the event
         * @param eventDesc A short description of the event
         */
        constructor(eventName: string = "", coorFullName: string = "", coorUserName: string = "", coorEmail: string = "", coorPhone: string = "",
                    eventDate: string = "", eventTime: string = "", eventDesc: string = "") {
            this._eventName = eventName;
            this._coorFullName = coorFullName;
            this._coorUserName = coorUserName;
            this._coorEmail = coorEmail;
            this._coorPhone = coorPhone;
            this._eventDate = eventDate;
            this._eventTime = eventTime;
            this._eventDesc = eventDesc;
        }
        //endregion

        //region Setters and Getters
        /** Gets the name of the event. */
        get eventName(): string {
            return this._eventName;
        }

        /** Sets the name of the event. */
        set eventName(value: string) {
            this._eventName = value;
        }

        /** Gets the Full name of the Event planner. */
        get coorFullName(): string {
            return this._coorFullName;
        }

        /** Sets the full name of the Event planner. */
        set coorFullName(value: string) {
            this._coorFullName = value;
        }

        /** Gets the username of the Event planner. */
        get coorUserName(): string {
            return this._coorUserName;
        }

        /** Sets the user name of the event planner. */
        set coorUserName(value: string) {
            this._coorUserName = value;
        }

        /** Gets the email address of the event planner. */
        get coorEmail(): string {
            return this._coorEmail;
        }

        /** Sets the email address of the event planner. */
        set coorEmail(value: string) {
            this._coorEmail = value;
        }

        /** Gets the phone number of the event planner. */
        get coorPhone(): string {
            return this._coorPhone;
        }

        /** Sets the phone number of the event planner. */
        set coorPhone(value: string) {
            this._coorPhone = value;
        }

        /** Gets the date of the event. */
        get eventDate(): string {
            return this._eventDate;
        }

        /** Sets the date of the event. */
        set eventDate(value: string) {
            this._eventDate = value;
        }

        /** Gets the time of the event. */
        get eventTime(): string {
            return this._eventTime;
        }

        /** Sets the time of the event. */
        set eventTime(value: string) {
            this._eventTime = value;
        }

        /** Gets the description of the event. */
        get eventDesc(): string {
            return this._eventDesc;
        }

        /** Sets the description of the event. */
        set eventDesc(value: string) {
            this._eventDesc = value;
        }

        //endregion

        //region Class Functions
        /**
         * Returns a string representation of the Event object.
         */
        toString(): string {
            return `Event Name: ${this._eventName}\n` +
                `Coordinator Full Name: ${this._coorFullName}\n` +
                `Coordinator User Name: ${this._coorUserName}\n` +
                `Coordinator Email Address: ${this._coorEmail}\n` +
                `Coordinator Phone Number: ${this._coorPhone}\n` +
                `Event Date: ${this._eventDate}\n` +
                `Event Time: ${this._eventTime}\n` +
                `Event Description: ${this._eventDesc}\n`;
        }

        /**
         * Serializes the Event object into a string.
         * @returns {string|null} A comma-separated string of event properties or null if any are invalid.
         */
        serialize(): string|null {
            if (this._eventName !== "" && this._coorFullName !== "" && this._coorUserName !== ""
                    && this._coorEmail !== "" && this._coorPhone !== ""
                    && this._eventDate !== "" && this._eventTime !== "" && this._eventDesc !== "") {
                return `${this._eventName},${this._coorFullName},${this._coorUserName},${this._coorEmail},
                ${this._coorPhone},${this._eventDate},${this._eventTime},${this._eventDesc}`;
            }
            console.error("One or more properties of the Event are empty or invalid");
            return null;
        }

        /**
         * Deserializes a string into the Event object's properties.
         * @param data A comma-separated string of event properties.
         */
        deserialize(data: string): void {
            let propertyArray = data.split(",");
            this._eventName = propertyArray[0];
            this._coorFullName = propertyArray[1];
            this._coorUserName = propertyArray[2];
            this._coorEmail = propertyArray[3];
            this._coorPhone = propertyArray[4];
            this._eventDate = propertyArray[5];
            this._eventTime = propertyArray[6];
            this._eventDesc = propertyArray[7];
        }

        /**
         * Converts the Event object into a JSON object.
         * @returns {Object} JSON representation of the event.
         */
        toJSON(): {eventName: string, coorFullName: string, coorUserName: string, coorEmail: string, coorPhone: string,
            eventDate: string, eventTime: string, eventDesc: string} {
            return {
                eventName: this._eventName,
                coorFullName: this._coorFullName,
                coorUserName: this._coorUserName,
                coorEmail: this._coorEmail,
                coorPhone: this._coorPhone,
                eventDate: this._eventDate,
                eventTime: this._eventTime,
                eventDesc: this._eventDesc,
            }
        }

        /**
         * Initializes the Event object's properties from a JSON object.
         * @param data JSON object containing user properties.
         */
        fromJSON(data: Event): void {
            this._eventName = data.eventName;
            this._coorFullName = data.coorFullName;
            this._coorUserName = data.coorUserName;
            this._coorEmail = data.coorEmail;
            this._coorPhone = data.coorPhone;
            this._eventDate = data.eventDate;
            this._eventTime = data.eventTime;
            this._eventDesc = data.eventDesc;
        }
        //endregion
    }
}
