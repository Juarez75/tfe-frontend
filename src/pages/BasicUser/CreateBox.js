import React, { useState } from "react";
import ReactDOM from "react-dom";

// Import React FilePond
import { FilePond, registerPlugin, File } from "react-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond-plugin-image-edit/dist/filepond-plugin-image-edit.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImageResize from "filepond-plugin-image-resize";
import FilePondPluginImageCrop from "filepond-plugin-image-crop";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";

// Register the plugins
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType,
  FilePondPluginImageResize,
  FilePondPluginImageCrop,
  FilePondPluginFileValidateSize
);

// Our app
class CreateBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Set initial files, type 'local' means this is a file
      // that has already been uploaded to the server (see docs)
      files: {
        source: "12345", //i am not sure
        options: {
          type: "local",
          file: {
            name: "hedgehog.jpg",
            size: 189397,
            type: "image/jpeg",
          },
          metadata: {
            poster:
              "http://localhost:3000/uploads/5e5b3895e1ee0b2128aa9eaa_hedgehog.jpg",
          },
        },
      },
    };
  }

  handleInit() {
    console.log("FilePond instance has initialised", this.pond);
  }

  render() {
    return (
      <div className="App">
        <div style={{ width: 300 }}>
          <FilePond
            ref={(ref) => (this.pond = ref)}
            files={this.state.files}
            allowReorder={true}
            server="/api"
            instantUpload={false}
            maxFileSize="3MB"
            name="files"
            id="filePond"
            allowProcess={false}
            acceptedFileTypes={["image/png", "image/jpeg"]}
            imageResizeTargetWidth={300}
            imageCropAspectRatio="1:1"
            onaddfile={(ref) => console.log(ref)}
            oninit={() => this.handleInit()}
            onupdatefiles={(fileItems) => {
              // Set currently active file objects to this.state
              console.log(fileItems);
              this.setState({
                files: fileItems.map((fileItem) => fileItem.file),
              });
            }}
          ></FilePond>
        </div>
      </div>
    );
  }
}
export default CreateBox;
