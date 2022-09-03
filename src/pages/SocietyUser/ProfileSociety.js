import React from "react";
import axios from "axios";
import { withRouter } from "../../withRouter";
import {
  Button,
  Form,
  Row,
  Col,
  InputGroup,
  Modal,
  Alert,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  Tabs,
  Tab,
} from "react-bootstrap";
import { NavigationBarSociety } from "../Component/NavSociety";
import Delete from "../Component/Delete";
import GraphicSociety from "../Component/GraphicSociety";
import { matchPath } from "react-router-dom";

class ProfileSociety extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      mail: "",
      firstname: "",
      lastname: "",
      lastPwd: "",
      newPwd: "",
      monthsGraph: "",
      type: localStorage.getItem("type"),
      id_society: localStorage.getItem("id_society"),
      color: localStorage.getItem("color"),
      EMPTY_FIRSTNAME: false,
      EMPTY_LASTNAME: false,
      EMPTY_MAIL: false,
      EMPTY_PASSWORD: false,
      WRONG_PASSWORD: false,
      success: false,
      isLoading: true,
      modalUnLink: false,
      dataGraphLastMonth: null,
      dataGraphMonth: null,
    };
    this.loadData = this.loadData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onUpdatePwd = this.onUpdatePwd.bind(this);
    this.graphData = this.graphData.bind(this);
    this.graphMonthData = this.graphMonthData.bind(this);
    this.loadData();
    this.graphData();
  }
  loadData() {
    axios
      .get(`http://localhost:3001/society/profile`, {
        withCredentials: true,
      })
      .then((res) => {
        const creation_date = new Date(res.data.creation_date);
        const now_date = new Date();
        var data = [];
        var month = creation_date.getMonth();
        var year = creation_date.getFullYear();
        var monthName;
        while (month != now_date.getMonth() || year != now_date.getFullYear()) {
          switch (month) {
            case 0:
              monthName = "Janvier";
              break;
            case 1:
              monthName = "Février";
              break;
            case 2:
              monthName = "Mars";
              break;
            case 3:
              monthName = "Avril";
              break;
            case 4:
              monthName = "Mai";
              break;
            case 5:
              monthName = "Juin";
              break;
            case 6:
              monthName = "Juillet";
              break;
            case 7:
              monthName = "Août";
              break;
            case 8:
              monthName = "Septembre";
              break;
            case 9:
              monthName = "Octobre";
              break;
            case 10:
              monthName = "Novemre";
              break;
            case 11:
              monthName = "Décembre";
              break;
          }
          data.push({ month: monthName, year: year, monthId: month });
          if (month == 11) {
            month = 0;
            year = year + 1;
          } else month = month + 1;
        }
        switch (month) {
          case 0:
            monthName = "Janvier";
            break;
          case 1:
            monthName = "Février";
            break;
          case 2:
            monthName = "Mars";
            break;
          case 3:
            monthName = "Avril";
            break;
          case 4:
            monthName = "Mai";
            break;
          case 5:
            monthName = "Juin";
            break;
          case 6:
            monthName = "Juillet";
            break;
          case 7:
            monthName = "Août";
            break;
          case 8:
            monthName = "Septembre";
            break;
          case 9:
            monthName = "Octobre";
            break;
          case 10:
            monthName = "Novemre";
            break;
          case 11:
            monthName = "Décembre";
            break;
        }
        data.push({ month: monthName, year: year, monthId: month });
        this.setState({
          id: res.data.id,
          mail: res.data.mail,
          firstname: res.data.firstname,
          lastname: res.data.lastname,
          id_society: res.data.id_society,
          isLoading: false,
          monthsGraph: data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  graphData() {
    const date = new Date();
    axios
      .get("http://localhost:3001/society/graphLastDays", {
        withCredentials: true,
      })
      .then((res) => {
        this.setState({
          dataGraphLastMonth: res.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .post(
        "http://localhost:3001/society/graphMonth",
        {
          month: date.getMonth(),
          year: date.getFullYear(),
        },
        { withCredentials: true }
      )
      .then((res) => {
        this.setState({ dataGraphMonth: res.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  onUpdate() {
    this.setState({
      EMPTY_FIRSTNAME: false,
      EMPTY_LASTNAME: false,
      EMPTY_MAIL: false,
    });

    if (
      this.state.mail == "" ||
      this.state.firstname == "" ||
      this.state.password == ""
    ) {
      if (this.state.mail == "") this.setState({ EMPTY_MAIL: true });
      if (this.state.firstname == "") this.setState({ EMPTY_FIRSTNAME: true });
      if (this.state.lastname == "") this.setState({ EMPTY_LASTNAME: true });
    } else {
      if (this.state.lastname == "" && this.state.type == 2)
        this.setState({ EMPTY_LASTNAME: true });
      else {
        axios
          .post(
            `http://localhost:3001/user/update`,
            {
              mail: this.state.mail,
              firstname: this.state.firstname,
              lastname: this.state.lastname,
            },
            { withCredentials: true }
          )
          .then((res) => {
            window.location.reload(false);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  }
  onUpdatePwd() {
    if (this.state.newPwd != "") {
      axios
        .post(
          `http://localhost:3001/user/updatePwd`,
          {
            lastPwd: this.state.lastPwd,
            newPwd: this.state.newPwd,
          },
          { withCredentials: true }
        )
        .then((res) => {
          window.location.reload(false);
          this.setState({ WRONG_PASSWORD: false });
        })
        .catch((error) => {
          if (error.reponse.data == "WRONG_PASSWORD")
            this.setState({ WRONG_PASSWORD: true });
        });
    } else this.setState({ EMPTY_PASSWORD: true });
  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  graphMonthData(key) {
    const reversedArray = this.state.monthsGraph.slice(0).reverse();
    axios
      .post(
        "http://localhost:3001/society/graphMonth",
        {
          month: reversedArray[key].monthId,
          year: reversedArray[key].year,
        },
        { withCredentials: true }
      )
      .then((res) => {
        this.setState({ dataGraphMonth: res.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  render() {
    if (this.state.isLoading) return <></>;
    return (
      <>
        <NavigationBarSociety color={this.state.color} />
        <div id="center">
          <div>
            <Tabs defaultActiveKey="home">
              <Tab eventKey="home" title="30 derniers jours" id="tag1">
                <h6>
                  Nombre de caisses déménagées durant les 30 derniers jours
                </h6>
                {this.state.dataGraphLastMonth != null ? (
                  <GraphicSociety dataGraph={this.state.dataGraphLastMonth} />
                ) : (
                  ""
                )}
              </Tab>
              <Tab eventKey="profile" title="Mois choisi" id="tag2">
                <Form.Select
                  className="mx-1"
                  style={{ maxWidth: "40vh" }}
                  onChange={(event) => this.graphMonthData(event.target.value)}
                >
                  {this.state.monthsGraph
                    .slice(0)
                    .reverse()
                    .map((item, i) => (
                      <option key={i} value={i}>
                        {item.month} {item.year}
                      </option>
                    ))}
                </Form.Select>
                <h6>Nombre de caisses déménagées durant le mois choisi</h6>
                {this.state.dataGraphMonth != null ? (
                  <GraphicSociety dataGraph={this.state.dataGraphMonth} />
                ) : (
                  ""
                )}
              </Tab>
            </Tabs>

            <div className="profile">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                style={{
                  backgroundColor: this.state.EMPTY_FIRSTNAME ? "#f7786f" : " ",
                }}
                name="firstname"
                value={this.state.firstname}
                type="text"
                onChange={this.handleChange}
                placeholder="Exemple"
              />
            </div>
            <div className="profile">
              <Form.Label>E-mail</Form.Label>
              <Form.Control
                style={{
                  backgroundColor: this.state.EMPTY_MAIL ? "#f7786f" : " ",
                }}
                name="mail"
                value={this.state.mail}
                type="mail"
                onChange={this.handleChange}
                placeholder="exemple@test.be"
              />
            </div>
          </div>
          <Row>
            <Col md={6}>
              <div>
                <Form.Label>Code société</Form.Label>

                <Form.Control
                  name="id_society"
                  value={this.state.id_society}
                  type="number"
                  onChange={this.handleChange}
                  placeholder=""
                  disabled
                  readOnly
                />
              </div>
            </Col>
          </Row>
          {this.state.WRONG_PASSWORD ? (
            <Alert variant="danger">Mot de passe incorrect</Alert>
          ) : (
            " "
          )}
          <Button
            variant="secondary"
            type="button"
            onClick={this.onUpdate}
            style={{ marginTop: "1rem" }}
          >
            Sauvegarder
          </Button>
          <h5 className="h5-profile">Changer de mot de passe</h5>
          <div>
            <div className="profile">
              <Form.Label>Ancien mot de passe</Form.Label>
              <Form.Control
                name="lastPwd"
                value={this.state.lastPwd}
                type="password"
                onChange={this.handleChange}
                placeholder=""
              />
            </div>
            <div className="profile">
              <Form.Label>Nouveau mot de passe</Form.Label>
              <Form.Control
                style={{
                  backgroundColor: this.state.EMPTY_PASSWORD ? "#f7786f" : " ",
                }}
                name="newPwd"
                value={this.state.newPwd}
                type="password"
                onChange={this.handleChange}
                placeholder=""
              />
            </div>
          </div>
          <Modal
            size="sm"
            show={this.state.success}
            onHide={() => this.setState({ success: false })}
          >
            <ModalHeader
              style={{ backgroundColor: "#77DD77", color: "#00561B" }}
              closeButton
            >
              Tag ajouté !
            </ModalHeader>
          </Modal>
          {this.state.WRONG_PASSWORD ? (
            <Alert variant="danger">Mot de passe incorrect</Alert>
          ) : (
            " "
          )}
          <Button variant="secondary" type="button" onClick={this.onUpdatePwd}>
            Sauvegarder
          </Button>
        </div>
      </>
    );
  }
}
export default withRouter(ProfileSociety);
