import * as React from "react";
import { MODULE_COMMON } from "./constants";

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
        common.loadScript("https://cdn.jsdelivr.net/npm/exif-js", (err) => {
            console.log("EXIF library loaded");
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
            const { AkNotification } = common;
            if (file) {
                const EXIF = (window as any).EXIF;
                if (!EXIF) {
                    failed("EXIF library not loaded!");
                    return;
                }

                const that = this;


                EXIF.getData(file, function (this) {
                    try {
                        const d = this;
                        if (d) {
                            console.log("EXIF data: ", d);

                            const latitude = EXIF.getTag(d, 'GPSLatitude');
                            const latitudeRef = EXIF.getTag(d, 'GPSLatitudeRef');
                            const longitude = EXIF.getTag(d, 'GPSLongitude');
                            const longitudeRef = EXIF.getTag(d, 'GPSLongitudeRef');

                            if (latitude && longitude && latitudeRef && longitudeRef) {
                                const latDegrees = latitude[0];
                                const latMinutes = latitude[1];
                                const latSeconds = latitude[2];
                                const lngDegrees = longitude[0];
                                const lngMinutes = longitude[1];
                                const lngSeconds = longitude[2];

                                let decimalLatitude = latDegrees + latMinutes / 60 + latSeconds / 3600;
                                let decimalLongitude = lngDegrees + lngMinutes / 60 + lngSeconds / 3600;

                                if (latitudeRef === 'S') {
                                    decimalLatitude = -decimalLatitude;
                                }
                                if (longitudeRef === 'W') {
                                    decimalLongitude = -decimalLongitude;
                                }

                                that.setState({ gpsInfo: { latitude: decimalLatitude, longitude: decimalLongitude, }, msg: JSON.stringify(EXIF.getAllTags(d)) });
                                resolve(true);
                                return;
                            }
                        }
                    } catch (e) {
                        failed(JSON.stringify(e));
                    }
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

        return <AkSpin spinning={loading} style={{ width: "100%", height: "100%" }}>
            <AkUpload accept="image/*" showUploadList={false} listType="picture"
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