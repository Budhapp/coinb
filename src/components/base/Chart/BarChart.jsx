import { BarChart as Bar } from "react-native-chart-kit";

const BarChart = (props) => {

    const {data, chartConfig} = props;    

   return (
   <Bar
     data={data}
     width={300} // from react-native
     height={220}
     yAxisInterval={1} // optional, defaults to 1
     chartConfig={chartConfig}
     bezier
   />)
};

export default BarChart;
