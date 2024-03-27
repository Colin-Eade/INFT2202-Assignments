"use strict";
var HarmonyHub;
(function (HarmonyHub) {
    class ChartUtils {
        static chart = null;
        static RenderCountsBarChart(data) {
            this.DestroyActiveChart();
            let labels = Object.keys(data)
                .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
            let datasets = [
                {
                    label: 'Total Visitors',
                    data: [],
                    backgroundColor: 'rgba(0, 123, 255, 0.2)',
                    borderColor: 'rgba(0, 123, 255, 1)',
                    borderWidth: 1
                },
                {
                    label: 'New Visitors',
                    data: [],
                    backgroundColor: 'rgba(40, 167, 69, 0.2)',
                    borderColor: 'rgba(40, 167, 69, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Returning Visitors',
                    data: [],
                    backgroundColor: 'rgba(255, 193, 7, 0.2)',
                    borderColor: 'rgba(255, 193, 7, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Desktop Devices',
                    data: [],
                    backgroundColor: 'rgba(220, 53, 69, 0.2)',
                    borderColor: 'rgba(220, 53, 69, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Mobile Devices',
                    data: [],
                    backgroundColor: 'rgba(255, 159, 26, 0.2)',
                    borderColor: 'rgba(255, 159, 26, 1)',
                    borderWidth: 1
                }
            ];
            labels.forEach(label => {
                let monthData = data[label];
                datasets[0].data.push(monthData.visitors);
                datasets[1].data.push(monthData.newVsReturning.new);
                datasets[2].data.push(monthData.newVsReturning.returning);
                datasets[3].data.push(monthData.deviceTypes.desktop);
                datasets[4].data.push(monthData.deviceTypes.mobile);
            });
            let canvas = $("#chart")[0];
            let ctx = canvas.getContext('2d');
            this.chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
        static RenderVisitsOverTimeChart(data) {
            this.DestroyActiveChart();
            let labels = Object.keys(data)
                .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
            let datasets = [
                {
                    label: 'Total Visits Over Time',
                    data: labels.map(label => data[label]),
                    backgroundColor: 'rgba(0, 123, 255, 0.2)',
                    borderColor: 'rgba(0, 123, 255, 1)',
                    borderWidth: 2,
                    fill: true
                }
            ];
            let canvas = $("#chart")[0];
            let ctx = canvas.getContext('2d');
            this.chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                }
            });
        }
        static RenderLocationPieChart(data) {
            this.DestroyActiveChart();
            let labels = Object.keys(data).sort((a, b) => data[b] - data[a]);
            let { backgroundColors, borderColors } = this.GenerateColorSets(Object.keys(data).length);
            let datasets = [
                {
                    data: labels.map(label => data[label]),
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 1
                }
            ];
            let canvas = $("#chart")[0];
            let ctx = canvas.getContext('2d');
            this.chart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                }
            });
        }
        static DestroyActiveChart() {
            if (this.chart) {
                this.chart.destroy();
            }
        }
        static GenerateColorSets(dataLength) {
            let backgroundColors = [];
            let borderColors = [];
            for (let i = 0; i < dataLength; i++) {
                let hue = (360 * i / dataLength) % 360;
                let saturation = 75;
                let lightness = 50;
                let backgroundColor = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.5)`;
                let borderColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
                backgroundColors.push(backgroundColor);
                borderColors.push(borderColor);
            }
            return { backgroundColors, borderColors };
        }
    }
    HarmonyHub.ChartUtils = ChartUtils;
})(HarmonyHub || (HarmonyHub = {}));
//# sourceMappingURL=chart_utils.js.map