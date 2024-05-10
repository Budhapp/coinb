import {
    StackedBarChart as StackedBar
  } from "react-native-chart-kit";

const StackedBarChart = (props) => {

    const {data, chartConfig} = props;    

   return (
   <StackedBar
     data={data}
     width={300}
     height={220}
     chartConfig={chartConfig}
     bezier
   />)
};

export default StackedBarChart;
