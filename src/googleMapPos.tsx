import * as React from "react";
import { MODULE_COMMON } from "./constants";

/**Pick location from google map */

const P_ApiKey = "apiKey";
const P_mapId = "mapID"; //google cloud map style
const P_height = "height"; //height of the map
const P_addrField = "addressField"; //address field to search
const P_geoField = "geoField"; //write pos to map

let id = 0;

const DF_MAPID = "DEMO_MAP_ID";

const parseLocation = (val: any, context) => {
    const common = context.modules[MODULE_COMMON];
    const { AkUtil } = common;
    let v = val;
    if (typeof val === "string") {
        v = AkUtil.JSONParse(val); //try to parse it
    }

    if (v) {
        if ("lat" in v && "lng" in v) {
            return {
                lat: v.lat,
                lng: v.lng
            };
        } else if ("latitude" in v && "longitude" in v) {
            return { lat: v.latitude, lng: v.longitude };
        }
    }
}

interface MapSampleProps {
    context: CodeInContext;
    fieldsValues: any;
    readonly: boolean;
}

interface MapSampleStates {
    loaded?: boolean;
}

class MapSample extends React.Component<MapSampleProps, MapSampleStates> {

    divId: string;
    maps;
    map;
    prevMarkerEle;
    prePos = { lat: 0, lng: 0 }
    unmounted = false;

    constructor(props, context) {
        super(props, context);
        console.log("Init Google Map Sample");
        this.state = { loaded: false }
        this.divId = `MapSample_${id++}`;
    }

    setMarker(props: MapSampleProps) {

        const saveGeo = (p) => {
            const isfunc = typeof p.lat === "function";
            props.context.setFieldValue(props.context.params[P_geoField], JSON.stringify({ lat: isfunc ? p.lat() : p.lat, lng: isfunc ? p.lng() : p.lng }));
        }
        const createMarker = (position) => {

            const marker = new this.maps.marker.AdvancedMarkerElement({
                map: this.map,
                position: position,
                gmpDraggable: !props.readonly,
                title: "Drag me to change location"
            });

            marker.addListener('dragend', (event) => {
                const position = marker.position;
                saveGeo(position);
            });

            return marker;
        }


        let v = parseLocation(props.fieldsValues[props.context.params[P_geoField]], props.context);
        if (v) {
            if (v.lat !== this.prePos.lat || v.lng !== this.prePos.lng) {
                //position changed
                this.map.setCenter(v);
                if (this.prevMarkerEle) {
                    this.prevMarkerEle.setPosition(v);
                } else {
                    this.prevMarkerEle = createMarker(v);
                }
            }
        } else {
            const addr = props.fieldsValues[props.context.params[P_addrField]];
            if (addr && addr.length > 0) {
                const request = {
                    textQuery: addr,
                    fields: ['displayName', 'location', 'businessStatus'],
                    includedType: '', // Restrict query to a specific type (leave blank for any).
                    useStrictTypeFiltering: true,
                    isOpenNow: true,
                    language: 'en-US',
                    maxResultCount: 1,
                    minRating: 1,
                };

                this.maps.places.Place.searchByText(request).then(({ places }) => {
                    if (places.length) {
                        const loc = places[0].location;
                        this.map.setCenter(loc);
                        this.prevMarkerEle = createMarker(loc);
                        saveGeo(loc);
                    }
                });
            }
        }
    }

    componentWillReceiveProps(nextProps: Readonly<MapSampleProps>, nextContext: any): void {
        if (this.unmounted) return;
        this.setMarker(nextProps);
    }

    componentWillUnmount() {
        this.unmounted = true;
    }


    componentDidMount() {
        const { context, fieldsValues } = this.props;
        const common = this.props.context.modules[MODULE_COMMON];
        const { AkUtil } = common;

        const initMap = (maps) => {
            this.maps = maps;

            const map = new maps.Map(document.getElementById(this.divId), {
                center: { lat: 0, lng: 0 },
                zoom: 12,
                mapId: context.params[P_mapId] || DF_MAPID
            });
            this.map = map;
            this.setMarker(this.props);

            this.setState({ loaded: true });
        }

        const maps = AkUtil.get(window, "google.maps");

        const onJsLoad = async () => {
            // init map components
            const google = (window as any).google;
            await google.maps.importLibrary("marker");
            await google.maps.importLibrary("places");
            console.log("Google Maps library loaded");
            initMap(google.maps);
        };

        if (maps) {
            //google maps script is already loaded
            onJsLoad();
        } else {
            common.loadScript(`https://maps.googleapis.com/maps/api/js?key=${context.params[P_ApiKey]}&v=beta`, async (err) => {
                if (err) {
                    console.log(err);
                } else {
                    onJsLoad();
                }
            })
        }
    }


    render() {
        const { context } = this.props;
        const common = context.modules[MODULE_COMMON]
        const { AkSpin } = common;
        const { loaded } = this.state;
        return <AkSpin spinning={!loaded}>
            <div id={this.divId} style={{ height: context.params[P_height] || "500px", width: "100%" }}></div>
        </AkSpin >;
    }
}



export class CodeInApplication implements CodeInComp {
    render(context: CodeInContext, fieldsValues: any, readonly: boolean) {
        return <MapSample context={context} fieldsValues={fieldsValues} readonly={readonly} />;
    }

    requiredFields(params) {
        return [params[P_geoField], params[P_addrField]];
    }

    requiredModules() {
        return [];
    }

    inputParameters() {
        return [{
            id: P_ApiKey,
            type: "string",
            desc: "API key of Google Maps JavaScript API"
        },
        {
            id: P_mapId,
            type: "string",
            desc: "You can create a map ID in Google Cloud Platform to customize the map style. Default:DEMO_MAP_ID"
        },
        {
            id: P_height,
            type: "string",
            desc: "Height of the map, default is 500px. You can use px or % as unit. e.g. 400px, 100%"
        },
        {
            id: P_geoField,
            type: "string",
            desc: "Save the position to the variable"
        },
        {
            id: P_addrField,
            type: "string",
            desc: `Use the address field to search location when ${P_geoField} field is empty`
        }
        ] as InputParameter[];
    }
}