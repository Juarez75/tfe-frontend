import React from "react";

import { Alert, Button, Modal, ModalHeader } from "react-bootstrap";

class ErrorHappened extends React.Component {
  render() {
    return (
      <ModalHeader style={{ backgroundColor: "#77DD77", color: "#00561B" }}>
        Une erreur est survenue
      </ModalHeader>
    );
  }
}

export default ErrorHappened;
