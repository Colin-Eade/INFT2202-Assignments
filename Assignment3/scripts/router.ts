"use strict";

namespace HarmonyHub {

    /**
     * Router class responsible for managing navigation and routing within an application.
     */
    export class Router {

        private _activeLink: string;
        private _routingTable: string[];
        private _linkData: string;

        /**
         * Constructs a new Router instance.
         * @param activeLink The active link.
         * @param routingTable The routing table, an array of route strings.
         * @param linkData Additional data associated with the link.
         */
        public constructor(activeLink: string = "", routingTable: string[] = [], linkData: string = "") {
            this._activeLink = activeLink;
            this._routingTable = routingTable
            this._linkData = linkData
        }

        /**
         * Gets the link data.
         * @returns The current link data as a string.
         */
        public get LinkData(): string {
            return this._linkData;
        }

        /**
         * Sets the link data.
         * @param link The new link data.
         */
        public set LinkData(link: string) {
            this._linkData = link;
        }

        /**
         * Gets the active link.
         * @returns The current active link as a string.
         */
        public get ActiveLink(): string {
            return this._activeLink;
        }

        /**
         * Sets the active link.
         * @param link The new active link.
         */
        public set ActiveLink(link: string) {
            this._activeLink = link;
        }

        /**
         * Adds a new route to the routing table.
         * @param route The route to add.
         */
        public Add(route: string): void {
            this._routingTable.push(route);
        }

        /**
         * Replaces the current routing table with a new one.
         * @param routingTable The new routing table to set.
         */
        public AddTable(routingTable: string[]): void {
            this._routingTable = routingTable;
        }

        /**
         * Finds the index of a route in the routing table.
         * @param route The route to find.
         * @returns The index of the route, or -1 if not found.
         */
        public Find(route: string): number {
            return this._routingTable.indexOf(route);
        }

        /**
         * Removes a route from the routing table.
         * @param route The route to remove.
         * @returns True if the route was removed, false if it was not found.
         */
        public Remove(route: string): boolean {
            if (this.Find(route) > -1) {
                this._routingTable.splice(this.Find(route), 1);
                return true;
            }
            return false;
        }

        /**
         * Converts the routing table to a string representation.
         * @returns A string representation of the routing table.
         */
        public toString(): string {
            return this._routingTable.toString();
        }
    }
}

let router: HarmonyHub.Router = new HarmonyHub.Router();

router.AddTable([
    "/",
    "/home",
    "/news",
    "/careers",
    "/contact",
    "/events",
    "/gallery",
    "/login",
    "/portfolio",
    "/privacy_policy",
    "/register",
    "/services",
    "/team",
    "/terms_of_service"
]);

let route: string = location.pathname;

router.ActiveLink = router.Find(route) > -1 ? route === "/" ? "home" : route.substring(1) : ("404");