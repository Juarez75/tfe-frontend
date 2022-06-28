import React from "react";
import { withRouter } from "../../withRouter";
import { Alert, Button } from "react-bootstrap";

class WrongPage extends React.Component {
  render() {
    return (
      <>
        <Alert variant="danger">
          <Alert.Heading>Page inexistante</Alert.Heading>
          <p>
            Cette page est inexistante ou a subi une erreur, veuilliez retourner
            à l'accueil
          </p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button
              onClick={() => this.props.router.navigate("/room/list")}
              variant="outline-danger"
            >
              Page d'accueil
            </Button>
          </div>
        </Alert>
      </>
    );
  }
}

export default withRouter(WrongPage);
