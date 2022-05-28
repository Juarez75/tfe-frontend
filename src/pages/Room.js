import React from "react";
import { withRouter } from "../withRouter";

class Room extends React.Component {
  constructor(props) {
    super(props);

    const roomId = props.router.params.id;
    // Récupérer la room
  }

  render() {
    return <div>{this.props.router.params.id}</div>;
  }
}

export default withRouter(Room);
