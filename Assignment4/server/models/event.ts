"use strict"

import mongoose from "mongoose";
const Schema = mongoose.Schema;

const EventsSchema : any = new Schema (
    {
        eventName: String,
        eventLocation: String,
        eventDate: Date,
        eventImage: String,
        eventDescription: String,
        eventLikeCount: Number
    },
    {
        collection: "events"
    }

);

const Model = mongoose.model("Event", EventsSchema);
export default Model;