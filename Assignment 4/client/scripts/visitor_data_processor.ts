"use strict";

namespace HarmonyHub {

    /**
     * Represents the structure of a visitor's data.
     */
    interface Visitor {
        visitDate: string;
        deviceType: 'desktop' | 'mobile';
        newVsReturning: 'new' | 'returning';
        location: string;
    }

    /**
     * Provides static methods to process and analyze visitor data.
     */
    export class VisitorDataProcessor {

        /**
         * Fetches visitor data from the visitor_statistics.json file and passes it to the provided callback function.
         *
         * @param callback - A function to be called with the fetched visitor data.
         */
        static GetVisitorData(callback: (data: Visitor[]) => void): void {
            $.get("./data/visitor_statistics.json", function (data): void {
                callback(data.visitors);
            });
        }

        /**
         * Aggregates visitor data by month and year, providing counts of total visitors, device types used,
         * and new vs returning visitors for each time period.
         *
         * @param visitors - An array of Visitor objects to aggregate.
         * @returns An object mapping each month and year to the aggregated visitor statistics for that period.
         */
        static GetCountsByMonthYear(visitors: Visitor[]): Record<string, {
            visitors: number,
            deviceTypes: { desktop: number, mobile: number },
            newVsReturning: { new: number, returning: number }
        }> {
            let monthlyData: Record<string, {
                visitors: number,
                deviceTypes: { desktop: number, mobile: number },
                newVsReturning: { new: number, returning: number }
            }> = {};

            visitors.sort((a: Visitor, b: Visitor) => new Date(a.visitDate)
                .getTime() - new Date(b.visitDate).getTime());

            visitors.forEach(visitor => {
                let monthYear: string = new Date(visitor.visitDate)
                    .toLocaleString('default', {month: 'long', year: 'numeric'});

                if (!monthlyData[monthYear]) {
                    monthlyData[monthYear] = {
                        visitors: 0,
                        deviceTypes: { desktop: 0, mobile: 0 },
                        newVsReturning: { new: 0, returning: 0 },
                    };
                }
                monthlyData[monthYear].visitors += 1;
                monthlyData[monthYear].deviceTypes[visitor.deviceType] += 1;
                monthlyData[monthYear].newVsReturning[visitor.newVsReturning] += 1;
            });
            return monthlyData;
        }

        /**
         * Calculates the cumulative total of visits over time, sorted by month and year.
         *
         * @param visitors - An array of Visitor objects to process.
         * @returns A record mapping each month and year to the cumulative total of visits up to that time.
         */
        static GetTotalVisitsOverTime(visitors: Visitor[]): Record<string, number> {
            let monthlyData: Record<string, number> = {};
            let cumulativeData: Record<string, number> = {};
            let cumulativeTotal: number = 0;

            visitors.sort((a: Visitor, b: Visitor) => new Date(a.visitDate)
                .getTime() - new Date(b.visitDate).getTime());

            visitors.forEach(visitor => {
                let monthYear: string = new Date(visitor.visitDate)
                    .toLocaleString('default', { month: 'long', year: 'numeric' });
                if (!monthlyData[monthYear]) {
                    monthlyData[monthYear] = 0;
                }
                monthlyData[monthYear] += 1;
            });

            Object.keys(monthlyData).forEach(monthYear => {
                cumulativeTotal += monthlyData[monthYear];
                cumulativeData[monthYear] = cumulativeTotal;
            });
            return cumulativeData;
        }

        /**
         * Counts the number of visits from each location.
         *
         * @param visitors - An array of Visitor objects to analyze.
         * @returns A record mapping locations to the number of visits from each location.
         */
        static GetLocationCounts(visitors: Visitor[]): Record<string, number> {
            let locationCounts: Record<string, number> = {};
            let totalVisits: number = 0;

            visitors.forEach(visitor => {
                if (!locationCounts[visitor.location]) {
                    locationCounts[visitor.location] = 0;
                }
                locationCounts[visitor.location] += 1;
                totalVisits += 1;
            });
            return locationCounts;
        }
    }
}
