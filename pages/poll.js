/*eslint-disable */
import Polls from "../components/Polls";
import PollList from "../components/PollList";
import withData from "../libraries/withData";
import DefaultCon from "../containers/Default";

export default withData(props => (
  <DefaultCon title="Create Poll" {...props}>
    <Polls />
    <PollList />
  </DefaultCon>
));
/* eslint-enable */
