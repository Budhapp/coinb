import { View, ViewProps } from 'react-native';

import {
    PieChart as Pie
  } from "react-native-chart-kit";

const PieChart = (props) => {

    const {data, chartConfig} = props;    

   return (
   <Pie
     data={data}
     width={300} // from react-native
     height={220}
    //  yAxisLabel="$"
    //  yAxisSuffix="k"
     yAxisInterval={1} // optional, defaults to 1
     chartConfig={chartConfig}
     bezier
   />)
};

export default PieChart;
