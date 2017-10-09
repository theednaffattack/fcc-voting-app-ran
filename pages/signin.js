/*eslint-disable */
import SignInForm from "../components/SignInForm";
import withData from "../libraries/withData";
import DefaultCon from "../containers/Default";

export default withData(props => (
  <DefaultCon title="Sign In" {...props}>
    <pre>
      {!props.initialState
        ? "No initialState present"
        : props.initialState.auth.token
          ? "Check this token: 👉🏾 👉🏾 👉🏾 " + props.initialState.auth.token
          : "Not Authenticated... 😫 😫 😫"}
    </pre>
    {!props.initialState
      ? "No initialState present"
      : props.initialState.auth.authenticated
        ? "Authenticated! 👍🏾 👍🏾 👍🏾"
        : "Not Authenticated... 😫 😫 😫"}
    <SignInForm />
  </DefaultCon>
));
/* eslint-enable */
