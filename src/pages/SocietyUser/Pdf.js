import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Image,
  Svg,
} from "@react-pdf/renderer";
import axios from "axios";

import { withRouter } from "../../withRouter";
import _, { isUndefined, sortedLastIndex } from "lodash";
import { Col, Row, Card, Modal } from "react-bootstrap";
import { ModifyBox } from "../Component/ModifiyBox";
import Fragile from "../../image/fragile.png";
class Pdf extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      box: [],
      id: parseInt(this.props.router.params.id),
      isDataFetch: false,
    };
    axios
      .post(
        "http://localhost:3001/society/pdf",
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
        console.log(error);
      });
  }
  render() {
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
                      backgroundColor: isUndefined(item.room.TagOnRoom[0])
                        ? (color = "#FFFFFF")
                        : (color = item.room.TagOnRoom[0].tag.color),
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      maxHeight: "210",
                      maxWidth: "560",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: "85",
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
                          src={Fragile}
                          style={{ height: "117", width: "110" }}
                        />
                      ) : (
                        ""
                      )}
                      <Text
                        style={{ fontSize: "117", backgroundColor: "white" }}
                      >
                        {item.room.stage}
                      </Text>
                    </Text>
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
