import React from "react";
import PropTypes from "prop-types";
import connect from "./store";
import { UpvoteButton } from "./styles";

const VoteOptionUpvoter = ({ upvote, voteOption }) => (
  <UpvoteButton onClick={() => upvote(voteOption)} />
);

VoteOptionUpvoter.propTypes = {
  upvote: PropTypes.func.isRequired,
  // votes: PropTypes.number,
  voteOption: PropTypes.string.isRequired
};

// VoteOptionUpvoter.defaultProps = {
//   votes: []
// };

export default connect(VoteOptionUpvoter);
