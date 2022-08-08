import axios from "axios";
import React from "react";
import { withRouter } from "../../withRouter";
import { NavigationBarSociety } from "../Component/NavSociety";
import { NavigationBar } from "../Component/NavUser";
import Box from "../../image/box.svg";
import { Button, Form } from "react-bootstrap";
import Cross from "../../image/cross.svg";

class BoxByQR extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: localStorage.getItem("color"),
      typeUser: localStorage.getItem("type"),
      idBox: props.router.params.id,
      nameBox: "",
      stateBox: "",
      isLoading: true,
      image: "",
      url_img: "",
    };
    this.loadData = this.loadData.bind(this);
    this.loadData();
  }
  loadData() {
    axios
      .get(`http://localhost:3001/box/qrcode/${this.state.idBox}`, {
        withCredentials: true,
      })
      .then((res) => {
        this.setState({
          nameBox: res.data.name,
          stateBox: res.data.state,
          isLoading: false,
          url_img: res.data.url_img,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  handleChange(state) {
    axios
      .post(
        "http://localhost:3001/box/state",
        {
          id: this.state.idBox,
          state: state,
        },
        { withCredentials: true }
      )
      .then(() => {
        this.setState({ stateBox: state });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    if (this.state.isLoading) return <></>;
    return (
      <>
        {this.state.typeUser == 1 ? (
          <NavigationBarSociety color={this.state.color} />
        ) : (
          <NavigationBar color={this.state.color} />
        )}
        <div id="center">
          <h4>{this.state.nameBox}</h4>
          <div id="test">
            <img
              src={this.state.url_img == null ? Box : this.state.url_img}
              id="box"
            ></img>
            <img src={Cross} id="crossImg"></img>
          </div>
          <div className="mb-3">
            <Form.Check
              inline
              label="Neutre"
              type="radio"
              id="check-box-0"
              checked={this.state.stateBox == 0}
              onChange={() => this.handleChange(0)}
            />
            <Form.Check
              inline
              label="Déménagée"
              type="radio"
              id="check-box-1"
              checked={this.state.stateBox == 1}
              onChange={() => this.handleChange(1)}
            />
            <Form.Check
              inline
              label="Vide"
              type="radio"
              id="check-box-2"
              checked={this.state.stateBox == 2}
              onChange={() => this.handleChange(2)}
            />
          </div>
          {this.state.typeUser == 1 ? (
            ""
          ) : (
            <Button
              variant="secondary"
              onClick={() =>
                this.props.router.navigate(`/box/${this.state.idBox}`)
              }
            >
              Vers la box
            </Button>
          )}
        </div>
      </>
    );
  }
}
export default withRouter(BoxByQR);
