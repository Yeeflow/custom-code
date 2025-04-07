import * as React from "react";
import { CDN, MODULE_COMMON } from "./constants";

const data = [
    { item: 'Career & Work', score: 6 },
    { item: 'Physical well-being', score: 6 },
    { item: 'Emotional & Mental Well-being', score: 6 },
    { item: 'Financial Health', score: 2 },
    { item: 'Purpose / Meaning / Spirituality', score: 5 },
    { item: 'Rest and Play', score: 10 },
    { item: 'Family & Relationships', score: 4 },
    { item: 'Personal Growth', score: 6 },
];
interface ChartSampleProps {
    context: CodeInContext;
    fieldsValues: any;
    readonly: boolean;
}

interface ChartSampleStates {
    loaded?: boolean;
    data?: any[];
}

class ChartSample extends React.Component<ChartSampleProps, ChartSampleStates> {

    ref;
    constructor(props, context) {
        super(props, context);
        this.state = { data: data, loaded: false }
    }


    componentWillMount() {
        const common = this.props.context.modules[MODULE_COMMON];
        //Product is using Ant design G2 v4.1.35.  You can find the document reference here: https://g2-v4.antv.vision/en
        common.loadScript(CDN + "g2.4.1.35.min.js", (err) => {
            this.initChart();
        });
    }

    initChart() {
        const G2 = (window as any).G2;
        if (!G2) {
            return;
        }

        const chart = new G2.Chart({
            container: this.ref,
            autoFit: true
        })

        chart.data(data);
        chart.scale('score', {
            min: 0,
            max: 10,
            tickCount: 6
        });
        chart.coordinate('polar', {
            radius: 0.8,
        });

        chart.tooltip({
            shared: true,
            showCrosshairs: true,
            crosshairs: {
                line: {
                    style: {
                        lineDash: [4, 4],
                        stroke: '#333'
                    }
                }
            }
        });
        chart.axis('item', {
            line: null,
            tickLine: null,
            grid: {
                line: {
                    style: {
                        lineDash: null,
                    },
                },
            },
        });
        chart.axis('score', {
            line: null,
            tickLine: null,
            label: false,
            grid: {
                line: {
                    type: 'circle',
                    style: {
                        lineDash: null,
                    },
                },
            },
        });

        chart
            .line()
            .position('item*score')
            .size(2);
        chart
            .point()
            .position('item*score')
            .shape('circle')
            .size(4)
            .style({
                stroke: '#fff',
                lineWidth: 1,
                fillOpacity: 1,
            });
        chart
            .area()
            .position('item*score')
        chart.render();
        this.setState({ loaded: true });
    }


    render() {
        // const ReactDOM = require('react-dom');
        const { context } = this.props;
        const common = context.modules[MODULE_COMMON]
        const { AkSpin } = common;
        const { loaded } = this.state;
        return <AkSpin spinning={!loaded}>
            <div ref={v => this.ref = v} style={{ height: "500px", width: "100%" }}></div>
        </AkSpin>;
    }
}


export class CodeInApplication implements CodeInComp {
    render(context: CodeInContext, fieldsValues: any, readonly: boolean) {
        return <ChartSample context={context} fieldsValues={fieldsValues} readonly={readonly} />;
    }

    requiredFields() {
        return [];
    }

    requiredModules() {
        return [];
    }
}