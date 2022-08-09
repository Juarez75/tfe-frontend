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
  Modal,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { withRouter } from "../../withRouter";
import { NavigationBarSociety } from "../Component/NavSociety";
import _, { isUndefined } from "lodash";
import WrongPage from "../Component/WrongPage";
import ErrorHappened from "../Component/ErrorHappened";

class Room_List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      room: [],
      id_user: this.props.router.params.id,
      type: localStorage.getItem("type"),
      color: localStorage.getItem("color"),
      WRONG_PAGE: false,
      ERROR_HAPPENED: false,
      isLoading: true,
    };
    axios
      .get(`http://localhost:3001/society/user/${this.state.id_user}`, {
        withCredentials: true,
      })
      .then((res) => {
        this.setState({ room: res.data, isLoading: false });
      })
      .catch((error) => {
        if (error.response.data == "WRONG_PAGE")
          this.setState({ WRONG_PAGE: true });
        else if (error.response.data == "ERROR") {
          this.setState({ ERROR_HAPPENED: true });
          setTimeout(() => this.setState({ ERROR_HAPPENED: false }), 3500);
        }
      });
  }

  onClick(id) {
    this.props.router.navigate(`/pdf/${id}`, { replace: true });
  }

  render() {
    if (this.state.isLoading) return <></>;
    if (this.state.WRONG_PAGE) return <WrongPage></WrongPage>;
    var color;
    if (this.state.type == 2) return <div>Vous n'avez pas accès à ça</div>;
    const rooms = _.chunk(this.state.room, 3);
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
          <h4>Liste des pièces de l'utilisateur</h4>
          <Button variant="secondary">
            <a id="pdf" target="_blank" href={`/pdf/${this.state.id_user}`}>
              PDF de l'utilisateur
            </a>
          </Button>
          <ListGroup>
            {rooms.map((row, i) => (
              <Row key={i}>
                {row.map((item) => (
                  <Col key={item.id} md={4}>
                    <Card
                      border="dark"
                      className="d-grip mx-1 my-1"
                      style={{
                        backgroundColor:
                          item.id_TagSociety == null
                            ? (color = "#FFFFFF")
                            : (color = item.TagSociety.color),
                      }}
                    >
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
      </div>
    );
  }
}
export default withRouter(Room_List);
