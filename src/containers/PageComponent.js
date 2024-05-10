import PageComponent from '../components/base/PageComponent';
import {connect} from 'react-redux';

function mapStateToProps(state, { componentId, navigation, page}) {
    const storeLayout = state.project?.definition?.components[componentId];

    return {
        storeLayout,
        componentId,
        navigation,
        page,
     };
}

function mapDispatchToProps(dispatch) {
    // add methods here
  return {

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PageComponent);
