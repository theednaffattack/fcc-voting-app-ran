import React from "react";
import PropTypes from "prop-types";
import connect from "./store";
import { UpvoteButton } from "./styles";

const VoteOptionUpvoter = ({ upvote, votes, id }) => (
  <UpvoteButton onClick={() => upvote(id, votes + 1)}>{votes}</UpvoteButton>
);

VoteOptionUpvoter.propTypes = {
  upvote: PropTypes.func.isRequired,
  votes: PropTypes.number,
  id: PropTypes.string.isRequired
};

VoteOptionUpvoter.defaultProps = {
  votes: []
};

export default connect(VoteOptionUpvoter);
