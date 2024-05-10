import { ProgressChart as Progress } from "react-native-chart-kit";

const ProgressChart = (props) => {

    const {data, chartConfig} = props;    

    return (
        <Progress
            data={data}
            width={300}
            height={220}
            strokeWidth={16}
            radius={32}
            chartConfig={chartConfig}
            hideLegend={false}
            />)
};

export default ProgressChart;
