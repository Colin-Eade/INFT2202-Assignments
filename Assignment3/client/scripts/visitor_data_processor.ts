"use strict";

namespace HarmonyHub {

    /**
     *
     */
    interface Visitor {
        visitDate: string;
        deviceType: 'desktop' | 'mobile';
        newVsReturning: 'new' | 'returning';
        location: string;
    }

    /**
     *
     */
    export class VisitorDataProcessor {

        /**
         *
         * @param callback
         */
        static GetVisitorData(callback: (data: Visitor[]) => void): void {
            $.get("./data/visitor_statistics.json", function (data): void {
                callback(data.visitors);
            });
        }

        /**
         *
         * @param visitors
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
         *
         * @param visitors
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
         *
         * @param visitors
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
