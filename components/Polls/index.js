/*eslint-disable */
import React from "react";
import PropTypes from "prop-types";
// import { Form, SubmitButton } from "./styles";
import CreatePoll from "../../components/CreatePoll";
import { Router } from "../../routes";
import connect from "./store";

// const authDiv = ({ authenticated }) => {
//   <div>{authenticated ? "YOU ARE AUTHENTICATED" : "Nope, not Auth"}</div>;
// };

const Polls = ({ authenticated, actions: { logout } }) => (
  <div>
    <div>
      <p>fcc-voting Below are polls hosted by fcc-voting.</p>
      <p>Select a poll to see the results and vote, or make a new poll!</p>
    </div>
    <pre>{JSON.stringify(authenticated, null, 2)}</pre>
    {authenticated ? <CreatePoll authenticated={authenticated} /> : "Not auth"}
  </div>
);

// Polls.defaultProps = {
//   authenticated: false
// };

Polls.propTypes = {
  authenticated: PropTypes.bool,
  actions: PropTypes.shape({
    logout: PropTypes.func.isRequired
  }).isRequired
};

export default connect(Polls);
/* eslint-enable */
