"use strict";

namespace HarmonyHub {

    export class Router {

        private _activeLink: string;
        private _routingTable: string[];
        private _linkData: string;

        /**
         *
         */
        public constructor() {
            this._activeLink = "";
            this._routingTable = [];
            this._linkData = "";
        }

        /**
         *
         */
        public get LinkData(): string {
            return this._linkData;
        }

        /**
         *
         * @param link
         */
        public set LinkData(link: string) {
            this._linkData = link;
        }

        /**
         *
         */
        public get ActiveLink(): string {
            return this._activeLink;
        }

        /**
         *
         * @param link
         */
        public set ActiveLink(link: string) {
            this._activeLink = link;
        }

    }
}