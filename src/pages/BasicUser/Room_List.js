import React from "react";
import axios from "axios";
import {
  Button,
  ListGroup,
  DropdownButton,
  Dropdown,
  ButtonGroup,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { withRouter } from "../../withRouter";
import { NavigationBar } from "../View/NavUser";
import _ from "lodash";

class Room_List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      room: [],
      type: localStorage.getItem("type"),
      color: localStorage.getItem("color"),
    };
    axios
      .get(`http://localhost:3001/room/list`, { withCredentials: true })
      .then((res) => {
        this.setState({ room: res.data });
      })
      .catch(function (error) {
        console.log(error.response.data);
      });
  }

  onCreate() {
    this.props.router.navigate("/room/create");
  }

  onClick(id) {
    this.props.router.navigate(`/room/${id}`);
  }

  render() {
    const rooms = _.chunk(this.state.room, 3);
    if (this.state.type == 1) return <div>Vous n'avez pas accès à ça</div>;
    return (
      <div>
        <NavigationBar color={this.state.color} />
        <h4>Liste des pièces</h4>
        <Button variant="outline-secondary" onClick={() => this.onCreate()}>
          Add new room
        </Button>
        {rooms.map((row, i) => (
          <Row key={i}>
            {row.map((item) => (
              <Col key={item.id} md={4}>
                <div className="d-grip">
                  <ButtonGroup className=" my-2 mx-auto d-grid">
                    <Button
                      variant="secondary"
                      onClick={() => this.onClick(item.id)}
                    >
                      <h5>{item.name}</h5>
                    </Button>
                  </ButtonGroup>
                </div>
              </Col>
            ))}
          </Row>
        ))}
      </div>
    );
  }
}
export default withRouter(Room_List);
