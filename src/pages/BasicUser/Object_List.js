import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Button,
  ListGroup,
  DropdownButton,
  Dropdown,
  ButtonGroup,
  Modal,
} from "react-bootstrap";
import { withRouter } from "../../withRouter";
import { NavigationBar } from "../Component/NavUser";
import Delete from "../Component/Delete";
import ErrorHappened from "../Component/ErrorHappened";

class Box_List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      objects: [],
      type: localStorage.getItem("type"),
      color: localStorage.getItem("color"),
      showDelete: false,
      id_data: "",
      url_data: "",
      name_data: "",
      url_return: "",
      type_delete: "",
      ERROR_HAPPENED: false,
      isLoading: true,
    };
    axios
      .get(`http://localhost:3001/object/list`, { withCredentials: true })
      .then((res) => {
        this.setState({ objects: res.data, isLoading: false });
      })
      .catch((error) => {
        if (error.response.data == "ERROR") {
          this.setState({ ERROR_HAPPENED: true });
          setTimeout(() => this.setState({ ERROR_HAPPENED: false }), 3500);
        }
      });
  }

  onDelete(id, name) {
    this.setState({
      url_data: "http://localhost:3001/object/delete",
      id_data: id,
      name_data: name,
      showDelete: true,
      url_return: "",
      type_delete: 0,
    });
  }
  onModify(id) {
    this.props.router.navigate(`/object/modify/${id}`);
  }

  render() {
    if (this.state.type == 1) return <div>Vous n'avez pas accès à ça</div>;
    if (this.state.isLoading) return <></>;
    return (
      <div>
        <Modal
          show={this.state.showDelete}
          onHide={() => this.setState({ showDelete: false })}
        >
          <Delete
            id={this.state.id_data}
            url={this.state.url_data}
            name={this.state.name_data}
            url_return={this.state.url_return}
            type={this.state.type_delete}
          />
        </Modal>
        <Modal
          show={this.state.ERROR_HAPPENED}
          onHide={() => this.setState({ ERROR_HAPPENED: false })}
        >
          <ErrorHappened></ErrorHappened>
        </Modal>
        <NavigationBar color={this.state.color} />
        <div id="center_list">
          <h4>Liste des box</h4>
          <ListGroup>
            {this.state.objects.map((item) => (
              <ListGroup.Item key={item.id}>
                {item.name}
                <ButtonGroup>
                  <DropdownButton title="" variant="light">
                    <Dropdown.Item onClick={() => this.onModify(item.id)}>
                      Modifier
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => this.onDelete(item.id, item.name)}
                    >
                      Supprimer
                    </Dropdown.Item>
                  </DropdownButton>
                </ButtonGroup>
                <div>
                  <small>Box : {item.box.name} </small>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      </div>
    );
  }
}
export default withRouter(Box_List);
