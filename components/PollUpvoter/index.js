import React from "react";
import PropTypes from "prop-types";
import connect from "./store";
import { UpvoteButton } from "./styles";

const PollUpvoter = ({ upvote, votes, id }) => (
  <UpvoteButton onClick={() => upvote(id, votes + 1)}>{votes}</UpvoteButton>
);

PollUpvoter.propTypes = {
  upvote: PropTypes.func.isRequired,
  votes: PropTypes.number,
  id: PropTypes.string.isRequired
};

PollUpvoter.defaultProps = {
  votes: []
};

export default connect(PollUpvoter);
