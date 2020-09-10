import * as React from "react";
import { MODULE_COMMON } from "./constants";

const VAR_VIDEOURL = "videourl";

interface ThirdVideoDemoProps {
    context: CodeInContext;
    url?: string;
}

interface ThirdVideoDemoStates {
    loaded?: boolean;
}

var loadCount = 0;

////vjs.zencdn.net/v/oceans.mp4
class ThirdVideoDemo extends React.Component<ThirdVideoDemoProps, ThirdVideoDemoStates> {

    constructor(props, context) {
        super(props, context);
        this.state = {}
    }

    // container: HTMLVideoElement;
    componentDidMount() {
        const common = this.props.context.modules[MODULE_COMMON];
        common.loadScript("//vjs.zencdn.net/7.3.0/video.min.js", (err) => {
            console.log("script loaded");
            if (err) {
                // print useful message
            }
            else {
                if (loadCount > 0) {
                    this.setState({ loaded: true });
                } else {
                    loadCount++;
                }
            }
        });

        common.loadCSS("//vjs.zencdn.net/7.3.0/video-js.min.css", () => {
            if (loadCount > 0) {
                this.setState({ loaded: true });
            } else {
                loadCount++;
            }
        });
    }


    renderThird() {
        const { context } = this.props;
        if (!this.state.loaded) {
            return null;
        }

        const { url } = this.props;

        // if (!this.container) {
        //     const current = ReactDOM.findDOMNode(this);
        //     this.container = document.createElement('video');
        //     this.container.id = "my-player";
        //     this.container.className = "video-js";
        //     this.container.setAttribute("controls", "controls");
        //     this.container.setAttribute("preload", "auto");
        //     current.appendChild(this.container);
        // }

        // if (this.container.hasChildNodes()) {
        //     this.container.childNodes.forEach(n => {
        //         this.container.removeChild(n);
        //     })
        // }

        if (url) {
            const videojs = window["videojs"];
            var myPlayer = videojs('my-player');
            myPlayer.src({ type: 'video/mp4', src: url });
        }

        return <video id="my-player" className="video-js" controls preload="auto"></video>;
    }

    render() {
        const { context } = this.props;
        const { loaded } = this.state;

        const common = context.modules[MODULE_COMMON]
        const { AkSpin } = common;
        if (loaded) {
            return this.renderThird();
        } else {
            return <div>loading...</div>;
        }
        // return <AkSpin spinning={loaded}>
        //     {this.renderThird()}
        // </AkSpin>;
    }
}


export class CodeInApplication implements CodeInComp {
    render(context: CodeInContext, fieldsValues: any, readonly: boolean) {
        return <ThirdVideoDemo context={context} url={fieldsValues[VAR_VIDEOURL]} />;
    }

    requiredFields() {
        return [VAR_VIDEOURL];
    }

    requiredModules() {
        return [];
    }
}