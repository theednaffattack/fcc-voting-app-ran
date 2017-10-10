/*eslint-disable */

// import moment from "moment";
import PropTypes from "prop-types";
import { Section, A } from "./styles";
import connect from "./store";

// USE BELOW VOTE OPTION MAPPING (NEEDED TO VOTE) // {allOptions.map((option, index) => ())}

const PollInfo = ({ loading, Poll, error, pollTitle, pollId }) => {
  if (loading) {
    return (
      <Section>
        <h1>Loading...</h1>
      </Section>
    );
  }

  if (error) {
    console.log(error); // eslint-disable-line no-console
    console.log(pollId); // eslint-disable-line no-console
    window.alert("Load error, check console"); // eslint-disable-line no-alert
    return;
  }

  const voteOptions = Poll.options.map((option, index) => <div>{option}</div>);

  return (
    <Section>
      <h1>{Poll.title}</h1>
      <div>
        <span>
          ID: <b>{Poll.id}</b>
        </span>
        <span>&nbsp;|&nbsp;</span>
        {voteOptions}
      </div>
      <p>{/** TODO: put the list of questions here */}</p>
    </Section>
  );
};

PollInfo.propTypes = {
  loading: PropTypes.bool.isRequired,
  Poll: PropTypes.object,
  error: PropTypes.object,
  pollId: PropTypes.string.isRequired,
  pollTitle: PropTypes.string.isRequired
};

PollInfo.defaultProps = {
  Poll: null,
  error: null
};

export default connect(PollInfo);
/* eslint-enable */
