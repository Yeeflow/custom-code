import * as React from "react";
import { MODULE_BIZCHARTS, MODULE_COMMON, MODULE_MOMENT } from "./constants";

const data = [
    { genre: 'Sports', sold: 275 },
    { genre: 'Strategy', sold: 115 },
    { genre: 'Action', sold: 120 },
    { genre: 'Shooter', sold: 350 },
    { genre: 'Other', sold: 150 }
];
const cols = {
    sold: { alias: 'Sales' },
    genre: { alias: 'Game Type' }
};

interface ChartSampleProps {
    context: CodeInContext;
    fieldsValues: any;
    readonly: boolean;
}

interface ChartSampleStates {
    data?: any[];
}

class ChartSample extends React.Component<ChartSampleProps, ChartSampleStates> {

    constructor(props, context) {
        super(props, context);
        this.state = { data: data}
    }


    render() {
        const { context } = this.props;
        const bizcharts = context.modules[MODULE_BIZCHARTS];
        const common = context.modules[MODULE_COMMON]
        const { AkSpin } = common;
        const { Chart, Axis, Legend, Tooltip, Geom } = bizcharts;
        const { data } = this.state;
        return <AkSpin spinning={!data}>
            <Chart height={400} data={data} scale={cols} forceFit>
                <Axis name="genre" />
                <Axis name="sold" />
                <Legend position="top" dy={-20} />
                <Tooltip />
                <Geom type="interval" position="genre*sold" color="genre" />
            </Chart>
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
        return [MODULE_BIZCHARTS, MODULE_MOMENT];
    }
}