import PollInfo from "../components/PollInfo";
import withData from "../libraries/withData";
import DefaultCon from "../containers/Default";

export default withData(props => (
  <DefaultCon title={decodeURIComponent(props.url.query.pollTitle)} {...props}>
    <PollInfo
      pollId={props.url.query.pollId}
      pollTitle={props.url.query.pollTitle}
    />
  </DefaultCon>
));
