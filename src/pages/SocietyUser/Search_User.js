import React from "react";
import { withRouter } from "../../withRouter";
import {
  ListGroup,
  Form,
  ButtonGroup,
  DropdownButton,
  Dropdown,
  Button,
} from "react-bootstrap";
import axios from "axios";
import { NavigationBar } from "../View/NavUser";

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: [],
      search: "",
    };
    this.handleChange = this.handleChange.bind(this);
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
          console.log(res.data);
          this.setState({
            user: res.data,
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      this.setState({ user: [] });
    }
  }
  onClick(id, name) {
    this.props.router.navigate(`/society/user/${id}`);
  }
  render() {
    return (
      <div>
        <NavigationBar />
        <h4>Recherche</h4>
        <Form.Control
          name="search"
          value={this.state.search}
          type="text"
          onChange={this.handleChange}
          placeholder="Search"
        />
        <h5>Utilisateurs :</h5>
        <ListGroup>
          {this.state.user.map((item) => (
            <ListGroup.Item key={item.id}>
              <ButtonGroup>
                <Button variant="light" onClick={() => this.onClick(item.id)}>
                  {item.firstname} {item.lastname}
                </Button>
              </ButtonGroup>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    );
  }
}
export default withRouter(Search);
