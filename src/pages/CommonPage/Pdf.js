import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Image,
} from "@react-pdf/renderer";
import axios from "axios";
import WrongPage from "../Component/WrongPage";
import ErrorHappened from "../Component/ErrorHappened";
import { Modal } from "react-bootstrap";

import { withRouter } from "../../withRouter";
import _, { isUndefined } from "lodash";
import Fragile from "../../image/fragile.png";
class Pdf extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      box: [],
      id: parseInt(this.props.router.params.id),
      isDataFetch: false,
      WRONG_PAGE: false,
      ERROR_HAPPENED: false,
    };
    axios
      .post(
        process.env.REACT_APP_URL_API + "/user/pdf",
        {
          id_user: this.state.id,
        },
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res.data);
        this.setState({ box: res.data, isDataFetch: true });
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
  render() {
    if (this.state.WRONG_PAGE) return <WrongPage></WrongPage>;
    if (!this.state.isDataFetch) return null;
    const rows = _.chunk(this.state.box, 5);
    var color;
    const style = StyleSheet.create({
      viewer: {
        width: window.innerWidth, //the pdf viewer will take up all of the width and height
        height: window.innerHeight,
      },
      title: {
        fontSize: 30,
        textDecoration: "underline",
      },
    });
    return (
      <>
        <Modal
          show={this.state.ERROR_HAPPENED}
          onHide={() => this.setState({ ERROR_HAPPENED: false })}
        >
          <ErrorHappened></ErrorHappened>
        </Modal>
        <PDFViewer style={style.viewer}>
          <Document>
            {rows.map((row, i) => (
              <Page size="A4">
                <View>
                  <Text style={style.title}>
                    Liste de {this.state.box[0].user.firstname}{" "}
                    {this.state.box[0].user.lastname}{" "}
                  </Text>
                </View>

                {row.map((item, i) => (
                  <View
                    key={i}
                    style={{
                      border: "solid",
                      borderColor: "black",
                      borderWidth: "10px",
                      position: "relative",
                      backgroundColor:
                        item.room.id_TagSociety == null
                          ? (color = "#FFFFFF")
                          : (color = item.room.TagSociety.color),
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      maxHeight: "210",
                      maxWidth: "560",
                    }}
                  >
                    <Text
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: 150,
                      }}
                    >
                      {item.room.id_TagSociety == null ? item.room.name : ""}
                    </Text>
                    <Text
                      style={{
                        fontSize: "80",
                        maxLines: "1",
                        maxWidth: "350",
                        flexShrink: "1",
                        textOverflow: "clip",
                      }}
                    >
                      {item.name}
                    </Text>
                    <Text>
                      {item.fragile ? (
                        <Image
                          style={{
                            height: "130",
                            width: "130",
                          }}
                          src={Fragile}
                        />
                      ) : (
                        ""
                      )}
                    </Text>

                    <Image
                      src={
                        "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" +
                        item.id
                      }
                      style={{ height: "130", width: "130" }}
                    ></Image>
                  </View>
                ))}
              </Page>
            ))}
          </Document>
        </PDFViewer>
      </>
    );
  }
}
export default withRouter(Pdf);
