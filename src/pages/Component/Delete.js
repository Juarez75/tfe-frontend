import React from "react";
import {
  ModalBody,
  ModalTitle,
  Button,
  ModalFooter,
  Modal,
} from "react-bootstrap";
import axios from "axios";
import { withRouter } from "../../withRouter";
import ErrorHappened from "./ErrorHappened";

class Delete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: props.url,
      id: props.id,
      name: props.name,
      url_return: props.url_return,
      type: props.type,
      ERROR_HAPPENED: false,
    };
    this.onDeleteOne = this.onDeleteOne.bind(this);
    this.onDeleteMany = this.onDeleteMany.bind(this);
  }

  onDeleteOne() {
    axios
      .post(
        this.state.url,
        {
          id: this.state.id,
        },
        { withCredentials: true }
      )
      .then(() => {
        if (this.state.url_return != "/room/list")
          window.location.reload(false);
        else this.props.router.navigate(this.state.url_return);
      })
      .catch((error) => {
        if (error.response.data == "ERROR") {
          this.setState({ ERROR_HAPPENED: true });
          setTimeout(() => this.setState({ ERROR_HAPPENED: false }), 3500);
        }
      });
  }
  onDeleteMany() {
    axios
      .post(
        this.state.url,
        {
          list: this.state.id,
        },
        { withCredentials: true }
      )
      .then(() => {
        if (this.state.url_return != "/room/list")
          window.location.reload(false);
        else this.props.router.navigate(this.state.url_return);
      })
      .catch((error) => {
        if (error.response.data == "ERROR") {
          this.setState({ ERROR_HAPPENED: true });
          setTimeout(() => this.setState({ ERROR_HAPPENED: false }), 3500);
        }
      });
  }

  render() {
    if (this.state.type == 0) {
      return (
        <>
          <Modal
            show={this.state.ERROR_HAPPENED}
            onHide={() => this.setState({ ERROR_HAPPENED: false })}
          >
            <ErrorHappened></ErrorHappened>
          </Modal>
          <ModalTitle>
            Êtes-vous sûr de supprimer "{this.state.name}" définitivement ?
          </ModalTitle>
          <ModalFooter>
            <Button variant="danger" onClick={this.onDeleteOne}>
              Oui
            </Button>
            <Button
              variant="secondary"
              onClick={() => window.location.reload(false)}
            >
              Non
            </Button>
          </ModalFooter>
        </>
      );
    } else if (this.state.type == 1) {
      return (
        <>
          <ModalTitle>
            Êtes-vous sûr de supprimer {this.state.name} éléments ?
          </ModalTitle>
          <ModalFooter>
            <Button variant="danger" onClick={this.onDeleteMany}>
              Oui
            </Button>
            <Button
              variant="secondary"
              onClick={() => window.location.reload(false)}
            >
              Non
            </Button>
          </ModalFooter>
        </>
      );
    }
  }
}

export default withRouter(Delete);
