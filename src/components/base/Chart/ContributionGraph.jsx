import { ContributionGraph as Contribution } from "react-native-chart-kit";

const ContributionGraph = (props) => {

    const {data, chartConfig} = props;    

   return (
   <Contribution
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

export default ContributionGraph;
