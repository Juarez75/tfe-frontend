import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button, ListGroup, Form, Col, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { withRouter } from "../../withRouter";
import { NavigationBarSociety } from "../Component/NavSociety";
import ErrorHappened from "../Component/ErrorHappened";

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
    };
    this.loadData = this.loadData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.loadData();
  }
  loadData() {
    axios
      .get(`http://localhost:3001/society/users`, { withCredentials: true })
      .then((res) => {
        this.setState({ user: res.data, visibleUser: res.data });
      })
      .catch((error) => {
        if (error.response.data == "ERROR") {
          this.setState({ ERROR_HAPPENED: true });
          setTimeout(() => this.setState({ ERROR_HAPPENED: false }), 3500);
        }
      });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
    if (event.target.value !== "") {
      const results = this.state.user.filter((user) => {
        return (
          user.firstname
            .toLowerCase()
            .startsWith(event.target.value.toLowerCase()) ||
          user.lastname
            .toLowerCase()
            .startsWith(event.target.value.toLowerCase())
        );
      });
      this.setState({ visibleUser: results });
    } else {
      this.setState({ visibleUser: this.state.user });
    }
  }

  render() {
    if (this.state.type == 2) return <div>Vous n'avez pas accès à ça</div>;
    return (
      <div>
        <Modal
          show={this.state.ERROR_HAPPENED}
          onHide={() => this.setState({ ERROR_HAPPENED: false })}
        >
          <ErrorHappened></ErrorHappened>
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
                <Button
                  variant="outline-dark"
                  onClick={() =>
                    this.props.router.navigate(`/society/user/${item.id}`)
                  }
                >
                  {item.firstname} {item.lastname}
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      </div>
    );
  }
}
export default withRouter(User_List);
