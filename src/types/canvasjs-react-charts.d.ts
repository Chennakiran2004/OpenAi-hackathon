declare module '@canvasjs/react-charts' {
    export interface CanvasJSChartOptions {
        animationEnabled?: boolean;
        title?: {
            text: string;
            fontSize?: number;
            fontFamily?: string;
            fontColor?: string;
        };
        axisX?: {
            title?: string;
            valueFormatString?: string;
            labelFontSize?: number;
            labelFontFamily?: string;
        };
        axisY?: {
            title?: string;
            prefix?: string;
            suffix?: string;
            labelFontSize?: number;
            labelFontFamily?: string;
        };
        theme?: string;
        backgroundColor?: string;
        data?: Array<{
            type: string;
            showInLegend?: boolean;
            name?: string;
            legendText?: string;
            dataPoints: Array<{
                x?: Date | number;
                y: number;
                label?: string;
                color?: string;
                indexLabel?: string;
                indexLabelFontColor?: string;
            }>;
            xValueFormatString?: string;
            yValueFormatString?: string;
            color?: string;
            lineColor?: string;
            markerColor?: string;
            markerSize?: number;
        }>;
        height?: number;
        width?: number;
    }

    export interface CanvasJSChartProps {
        options: CanvasJSChartOptions;
        onRef?: (ref: any) => void;
    }

    export class CanvasJSChart extends React.Component<CanvasJSChartProps> { }

    export const CanvasJS: any;

    const CanvasJSReact: {
        CanvasJS: any;
        CanvasJSChart: typeof CanvasJSChart;
    };

    export default CanvasJSReact;
}
