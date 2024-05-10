import { LineChart as Line } from "react-native-chart-kit";

const LineChart = (props) => {

    const {data, chartConfig} = props;    

   return (
   <Line
     data={data}
     width={300} // from react-native
     height={220}
     chartConfig={chartConfig}
     bezier
     style={{
       marginVertical: 8,
       borderRadius: 16
     }}
   />)
};

export default LineChart;
