import axios from "axios";
import React from "react";
import { QrReader as QrScan } from "react-qr-reader";
import { withRouter } from "../../withRouter";
import { NavigationBarSociety } from "../Component/NavSociety";
import { Modal } from "react-bootstrap";
import { NavigationBar } from "../Component/NavUser";

class QrReader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: localStorage.getItem("color"),
      typeUser: localStorage.getItem("type"),
      impossibleToRead: false,
      wrongQR: false,
    };
  }

  render() {
    var firstTime = true;
    var timer;
    return (
      <>
        {this.state.typeUser == 1 ? (
          <NavigationBarSociety color={this.state.color} />
        ) : (
          <NavigationBar color={this.state.color} />
        )}
        <div id="center">
          <h4>Scan de QR code</h4>
          <div style={{ color: "#F00020", display: "inline-block" }}>
            {this.state.impossibleToRead ? "Impossible de lire le QR code" : ""}
            {this.state.wrongQR
              ? "Ce qr code ne peut pas être lu par cette application"
              : ""}
          </div>
          <div style={{ width: 300, marginTop: 50 }}>
            <QrScan
              delay={300}
              id="qrscan"
              style={{ width: 300 }}
              onResult={(result, error) => {
                if (!!result) {
                  if (isNaN(result)) {
                    console.log("error " + result.text);
                    this.setState({ wrongQR: true });
                  } else this.props.router.navigate(`/box/QR/${result.text}`);
                }
                firstTime = true;
                clearTimeout(timer);

                if (!!error) {
                  if (
                    firstTime &&
                    !this.state.impossibleToRead &&
                    !this.state.wrongQR
                  ) {
                    firstTime = false;
                    timer = setTimeout(() => {
                      this.setState({ impossibleToRead: true });
                    }, 5000);
                  }
                }
              }}
            />
          </div>
        </div>
      </>
    );
  }
}
export default withRouter(QrReader);
