import { View } from 'react-native';
import LineChart from './LineChart';
import BarChart from './BarChart';
import PieChart from './PieChart';
import ProgressChart from './ProgressChart';
import StackedBarChart from './StackedBarChart';
import ContributionGraph from './ContributionGraph';
import { chartConfig } from './../../../consts/chartConfig';

const Chart = (props: any) => {

    const {properties = {}} = props;    

    const getChartByType = () => {
    switch (properties.type){
        case "LineChart":
            // this is test data, need to discuss about fetching or collect from MetaComponents
            return <LineChart data={{
                labels: ["January", "February", "March", "April", "May", "June"],
                datasets: [
                  {
                    data: [20, 45, 28, 80, 99, 43],
                    color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
                    strokeWidth: 2 // optional
                  }
                ],
                legend: ["Rainy Days"] // optional
              }} chartConfig={chartConfig}/>
        case "BarChart":
            return <BarChart/>
        case "PieChart":
            return <PieChart/>
        case "ProgressChart":
            return <ProgressChart/>
        case "ContributionGraph":
            return <ContributionGraph/>
        case "StackedBarChart":
            return <StackedBarChart/>
        default:
            return <></>
        }
    }

   return <View style={props.style.layout}>
   {getChartByType()}
 </View>
};

export default Chart;
