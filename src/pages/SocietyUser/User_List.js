import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button, ListGroup, Form, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { withRouter } from "../../withRouter";
import { NavigationBarSociety } from "../Component/NavSociety";

class User_List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: [],
      search: "",
      type: localStorage.getItem("type"),
      color: localStorage.getItem("color"),
    };
    this.loadData = this.loadData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.loadData();
  }
  loadData() {
    axios
      .get(`http://localhost:3001/society/users`, { withCredentials: true })
      .then((res) => {
        this.setState({ user: res.data });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
    if (event.target.value !== "") {
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
          this.setState({
            user: res.data,
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      this.loadData();
    }
  }

  render() {
    if (this.state.type == 2) return <div>Vous n'avez pas accès à ça</div>;
    return (
      <div>
        <NavigationBarSociety color={this.state.color} />
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
          {this.state.user.map((item) => (
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
    );
  }
}
export default withRouter(User_List);
