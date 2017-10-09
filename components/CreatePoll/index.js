/*eslint-disable */
import React from "react";
import PropTypes from "prop-types";
import { Form, SubmitButton } from "./styles";
import { Router } from "../../routes";
import connect from "./store";

class CreateForm extends React.Component {
  static propTypes = {
    mutations: PropTypes.shape({
      createPoll: PropTypes.func.isRequired
    }).isRequired
  };

  handleSubmit = e => {
    e.preventDefault();

    const title = e.target.elements.title.value;
    let options = e.target.elements.options.value;

    if (title === "" || options === "") {
      // eslint-disable-next-line no-alert
      window.alert("Both fields are required.");
      return false;
    }

    this.props.mutations.createPoll(title, options);

    // reset form
    e.target.elements.title.value = "";
    e.target.elements.options.value = "";

    Router.pushRoute("/polls");
  };

  render = () => (
    <Form onSubmit={this.handleSubmit}>
      <h1>Add new poll</h1>
      <input placeholder="title" name="title" />
      <textarea placeholder="options" name="options" cols="40" rows="5" />
      <SubmitButton type="submit">Submit</SubmitButton>
    </Form>
  );
}

export default connect(CreateForm);
/* eslint-enable */
