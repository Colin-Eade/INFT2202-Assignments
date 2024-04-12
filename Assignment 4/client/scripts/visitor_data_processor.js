"use strict";
var HarmonyHub;
(function (HarmonyHub) {
    class VisitorDataProcessor {
        static GetVisitorData(callback) {
            $.get("./data/visitor_statistics.json", function (data) {
                callback(data.visitors);
            });
        }
        static GetCountsByMonthYear(visitors) {
            let monthlyData = {};
            visitors.sort((a, b) => new Date(a.visitDate)
                .getTime() - new Date(b.visitDate).getTime());
            visitors.forEach(visitor => {
                let monthYear = new Date(visitor.visitDate)
                    .toLocaleString('default', { month: 'long', year: 'numeric' });
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
        static GetTotalVisitsOverTime(visitors) {
            let monthlyData = {};
            let cumulativeData = {};
            let cumulativeTotal = 0;
            visitors.sort((a, b) => new Date(a.visitDate)
                .getTime() - new Date(b.visitDate).getTime());
            visitors.forEach(visitor => {
                let monthYear = new Date(visitor.visitDate)
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
        static GetLocationCounts(visitors) {
            let locationCounts = {};
            let totalVisits = 0;
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
    HarmonyHub.VisitorDataProcessor = VisitorDataProcessor;
})(HarmonyHub || (HarmonyHub = {}));
//# sourceMappingURL=visitor_data_processor.js.map