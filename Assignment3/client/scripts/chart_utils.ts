"use strict";

namespace HarmonyHub {

    /**
     *
     */
    export class ChartUtils {

        /**
         *
         */
        static chart: Chart | null = null;

        /**
         *
         * @param data
         */
        static RenderCountsBarChart(data: Record<string, {
            visitors: number,
            deviceTypes: { desktop: number, mobile: number },
            newVsReturning: { new: number, returning: number }
        }>): void {

            this.DestroyActiveChart();

            let labels = Object.keys(data)
                .sort((a: string, b: string) => new Date(a).getTime() - new Date(b).getTime());

            let datasets: {
                label: string;
                data: number[];
                backgroundColor: string;
                borderColor: string;
                borderWidth: number;
            }[] = [
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

            let canvas = $("#chart")[0] as HTMLCanvasElement;
            let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

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

        /**
         *
         * @param data
         */
        static RenderVisitsOverTimeChart(data: Record<string, number>): void {

            this.DestroyActiveChart();

            let labels: string[] = Object.keys(data)
                .sort((a: string, b: string) => new Date(a).getTime() - new Date(b).getTime());

            let datasets: {
                label: string
                data: number[];
                backgroundColor: string;
                borderColor: string;
                borderWidth: number;
                fill: boolean;
            }[] = [
                {
                    label: 'Total Visits Over Time',
                    data: labels.map(label => data[label]),
                    backgroundColor: 'rgba(0, 123, 255, 0.2)',
                    borderColor: 'rgba(0, 123, 255, 1)',
                    borderWidth: 2,
                    fill: true
                }
            ];

            let canvas = $("#chart")[0] as HTMLCanvasElement;
            let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

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

        /**
         *
         * @param data
         */
        static RenderLocationPieChart(data: Record<string, number>): void {

            this.DestroyActiveChart();

            let labels = Object.keys(data).sort((a: string, b: string) => data[b] - data[a]);
            let { backgroundColors, borderColors } = this.GenerateColorSets(Object.keys(data).length);

            let datasets: {
                data: number[];
                backgroundColor: string[];
                borderColor: string[];
                borderWidth: number;
            }[] = [
                {
                data: labels.map(label => data[label]),
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1
            }];

            let canvas = $("#chart")[0] as HTMLCanvasElement;
            let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

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

        /**
         *
         */
        static DestroyActiveChart(): void {
            if (this.chart) {
                this.chart.destroy();
            }
        }

        /**
         *
         * @param dataLength
         */
        static GenerateColorSets(dataLength: number): { backgroundColors: string[], borderColors: string[] } {
            let backgroundColors: string[] = [];
            let borderColors: string[] = [];

            for (let i: number = 0; i < dataLength; i++) {
                let hue: number = (360 * i / dataLength) % 360;
                let saturation: number = 75;
                let lightness: number = 50;

                let backgroundColor: string = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.5)`;
                let borderColor: string = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

                backgroundColors.push(backgroundColor);
                borderColors.push(borderColor);
            }
            return { backgroundColors, borderColors };
        }
    }
}
