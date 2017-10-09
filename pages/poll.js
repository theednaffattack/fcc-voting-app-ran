/*eslint-disable */
import Polls from "../components/Polls";
import withData from "../libraries/withData";
import DefaultCon from "../containers/Default";

export default withData(props => (
  <DefaultCon title="Create Poll" {...props}>
    <Polls />
  </DefaultCon>
));
/* eslint-enable */
