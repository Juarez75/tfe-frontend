import React, { useRef, useState } from "react";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { actualisation: "Bonjour" };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    return (
      <div>
        <input
          name="actualisation"
          value={this.state.actualisation}
          type="text"
          onChange={this.handleChange}
        />
        <p>{this.state.actualisation}</p>
      </div>
    );
  }
}
export default App;
