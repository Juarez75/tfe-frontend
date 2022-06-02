import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Button,
  ListGroup,
  Col,
  Row,
  ButtonGroup,
  Card,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { withRouter } from "../../withRouter";
import { NavigationBarSociety } from "../View/NavSociety";
import _ from "lodash";

class Room_List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      room: [],
      id_user: this.props.router.params.id,
      type: localStorage.getItem("type"),
      color: localStorage.getItem("color"),
    };
    axios
      .get(`http://localhost:3001/society/user/${this.state.id_user}`, {
        withCredentials: true,
      })
      .then((res) => {
        this.setState({ room: res.data });
      })
      .catch((res) => {
        console.log(res);
      });
  }

  onClick(id) {
    this.props.router.navigate(`/society/room/${id}`);
  }

  render() {
    if (this.state.type == 2) return <div>Vous n'avez pas accès à ça</div>;
    const rooms = _.chunk(this.state.room, 3);
    return (
      <div>
        <NavigationBarSociety color={this.state.color} />
        <h4>Liste des pièces de l'utilisateur</h4>
        <ListGroup>
          {rooms.map((row, i) => (
            <Row key={i}>
              {row.map((item) => (
                <Col key={item.id} md={4}>
                  <Card border="dark" className="d-grip mx-1 my-1">
                    <Card.Title className="mx-auto">{item.name}</Card.Title>
                    <Card.Subtitle className="mx-auto">
                      Nombre de box : {item._count.box}
                    </Card.Subtitle>
                  </Card>
                </Col>
              ))}
            </Row>
          ))}
        </ListGroup>
      </div>
    );
  }
}
export default withRouter(Room_List);
