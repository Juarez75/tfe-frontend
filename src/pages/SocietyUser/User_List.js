import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Button,
  ListGroup,
  Form,
  Col,
  Modal,
  InputGroup,
  ModalTitle,
  ModalFooter,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { withRouter } from "../../withRouter";
import { NavigationBarSociety } from "../Component/NavSociety";
import ErrorHappened from "../Component/ErrorHappened";
import Cross from "../../image/crossBlack.svg";

class User_List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: [],
      visibleUser: [],
      search: "",
      type: localStorage.getItem("type"),
      color: localStorage.getItem("color"),
      ERROR_HAPPENED: false,
      isLoading: true,
      id_user: "",
      modalUnLink: false,
    };
    this.loadData = this.loadData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.unLinkSociety = this.unLinkSociety.bind(this);
    this.loadData();
    this.timer = null;
  }
  loadData() {
    axios
      .get(`http://localhost:3001/society/users`, { withCredentials: true })
      .then((res) => {
        this.setState({
          user: res.data,
          visibleUser: res.data,
          isLoading: false,
        });
      })
      .catch((error) => {
        if (error.response.data == "ERROR") {
          this.setState({ ERROR_HAPPENED: true });
          setTimeout(() => this.setState({ ERROR_HAPPENED: false }), 3500);
        }
      });
  }

  handleChange(event) {
    if (event.target.value !== "") {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        axios
          .post(
            "http://localhost:3001/society/search",
            {
              search: event.target.value,
            },
            {
              withCredentials: true,
            }
          )
          .then((res) => {
            this.setState({ visibleUser: res.data });
          })
          .catch((e) => {
            console.log(e);
          });
      }, 300);
    } else {
      clearTimeout(this.timer);
      this.setState({ visibleUser: this.state.user });
    }
    this.setState({ search: event.target.value });
  }
  unLinkSociety() {
    axios
      .post(
        "http://localhost:3001/society/unlink",
        { id_user: this.state.id_user },
        { withCredentials: true }
      )
      .then(() => {
        this.loadData();
        this.setState({ modalUnLink: false });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    if (this.state.isLoading) return <></>;
    if (this.state.type == 2) return <div>Vous n'avez pas accès à ça</div>;
    return (
      <div>
        <Modal
          show={this.state.ERROR_HAPPENED}
          onHide={() => this.setState({ ERROR_HAPPENED: false })}
        >
          <ErrorHappened></ErrorHappened>
        </Modal>
        <Modal
          show={this.state.modalUnLink}
          onHide={() => this.setState({ modalUnLink: false })}
        >
          <ModalTitle>
            Êtes-vous sûr vous délier cet utilisateur de la société ?
          </ModalTitle>
          <ModalFooter>
            <Button variant="danger" onClick={() => this.unLinkSociety()}>
              Oui
            </Button>
            <Button
              variant="secondary"
              onClick={() => this.setState({ modalUnLink: false })}
            >
              Non
            </Button>
          </ModalFooter>
        </Modal>
        <NavigationBarSociety color={this.state.color} />
        <div id="center_list">
          <h4>Liste des utilisateurs</h4>
          <Col md={5} className="my-1">
            <Form.Control
              name="search"
              value={this.state.search}
              type="text"
              onChange={this.handleChange}
              placeholder="Rechercher"
            />
          </Col>
          <ListGroup>
            {this.state.visibleUser.map((item) => (
              <ListGroup.Item key={item.id}>
                <InputGroup>
                  <Button
                    variant="outline-secondary"
                    onClick={() =>
                      this.props.router.navigate(`/society/user/${item.id}`)
                    }
                  >
                    {item.firstname} {item.lastname}
                  </Button>
                  <Button
                    variant="outline-secondary"
                    style={{ paddingRight: 5, paddingLeft: 5, paddingTop: 0 }}
                    onClick={() =>
                      this.setState({ modalUnLink: true, id_user: item.id })
                    }
                  >
                    <img
                      src={Cross}
                      style={{
                        width: "1rem",
                      }}
                    />
                  </Button>
                </InputGroup>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      </div>
    );
  }
}
export default withRouter(User_List);
