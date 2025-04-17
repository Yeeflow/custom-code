import * as React from "react";
import { CDN, MODULE_COMMON } from "./constants";

interface GPSInfo {
    latitude: number;
    longitude: number;
}

interface ImgUploadSampleProps {
    context: CodeInContext;
    fieldsValues: any;
    readonly: boolean;
}

interface ImgUploadSampleStates {
    loading?: boolean;
    gpsInfo?: GPSInfo;
    msg?: string;
}

class ImgUploadSample extends React.Component<ImgUploadSampleProps, ImgUploadSampleStates> {

    ref;
    constructor(props, context) {
        super(props, context);
        this.state = { loading: true }
    }


    componentWillMount() {
        const common = this.props.context.modules[MODULE_COMMON];
        common.loadScript(CDN + "exif-reader.js", (err) => {
            console.log("ExifReader library loaded");
            this.setState({ loading: false });
        });
    }

    async beforeUpload(file) {
        return new Promise((resolve, reject) => {
            const failed = (msg) => {
                AkNotification.error({
                    message: "Tip",
                    description: "No GPS info found in the image!"
                });
                this.setState({ gpsInfo: null, msg });
                this.onChange(null);
                resolve(false);
            }


            const { context } = this.props;
            const common = context.modules[MODULE_COMMON];
            const { AkNotification, AkUtil } = common;
            if (file) {
                const EXIF = (window as any).ExifReader;
                if (!EXIF) {
                    failed("EXIF library not loaded!");
                    return;
                }

                const that = this;

                EXIF.load(file).then(tags => {
                    console.log("EXIF data: ", tags);

                    let latitude = AkUtil.get(tags, 'GPSLatitude.description');
                    const latitudeRef = AkUtil.get(tags, 'GPSLatitudeRef.value.0');
                    let longitude = AkUtil.get(tags, 'GPSLongitude.description');
                    const longitudeRef = AkUtil.get(tags, 'GPSLongitudeRef.value.0');
                    if (latitude && longitude && latitudeRef && longitudeRef) {

                        if (latitudeRef === 'S') {
                            latitude = -latitude;
                        }
                        if (longitudeRef === 'W') {
                            longitude = -longitude;
                        }

                        that.setState({ gpsInfo: { latitude, longitude }});
                        resolve(true);
                        return;
                    }
                }).catch((e) => {
                    failed(e.message);
                });

            } else {
                failed("No file selected!");
            }
        });
    }

    onChange(url) {
        const { context } = this.props;
        context.setFieldValue(context.params["varId"], url);
    }

    render() {
        // const ReactDOM = require('react-dom');
        const { context } = this.props;
        const common = context.modules[MODULE_COMMON]
        const { AkSpin, AkUpload, FileUploadMethod, AkNotification, FileUpLoadCommon, AkButton } = common;
        const { loading, gpsInfo, msg } = this.state;



        const customRequest = (options: any) => {
            options.isImg = true;

            FileUploadMethod.UpLoadFile(options).then((d) => {
                let url = FileUpLoadCommon.getDownloadUrl(d, { isImg: true });
                this.onChange(url);
            }, (onrejected) => {
                AkNotification.error({
                    message: "Tip   ",
                    description: onrejected.Message
                });
                this.onChange(null);
            });
        }

        //Do not set accept="image/*" in AkUpload, it will cause the GPS values removed in Android
        return <AkSpin spinning={loading} style={{ width: "100%", height: "100%" }}>
            <AkUpload showUploadList={false} listType="picture"
                beforeUpload={this.beforeUpload.bind(this)}
                customRequest={customRequest}
                multiple={false}>
                <AkButton>Upload</AkButton>
            </AkUpload>
            {gpsInfo ? <div>
                <div>GPS Info:</div>
                <div>Latitude: {gpsInfo.latitude}</div>
                <div>Longitude: {gpsInfo.longitude}</div>
            </div> : <div>No GPS Info</div>}
            <div>
                <label>Messages:</label>
                <div>{msg}</div>
            </div>
        </AkSpin>
    }
}


export class CodeInApplication implements CodeInComp {
    render(context: CodeInContext, fieldsValues: any, readonly: boolean) {
        return <ImgUploadSample context={context} fieldsValues={fieldsValues} readonly={readonly} />;
    }

    requiredFields() {
        return [];
    }

    requiredModules() {
        return [];
    }

    inputParameters() {
        return [{
            id: "varId",
            type: "string",
            desc: "ID of the image variable"
        }] as InputParameter[];
    }
}