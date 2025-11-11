import * as React from "react";
import { MODULE_COMMON } from "./constants";


const P_ApiKey = "apiKey";
const P_mapId = "mapID"; //google cloud map style
const P_height = "height"; //height of the map
const p_listID = "listID";
const P_geoField = "geoField";
const P_titleField = "titleField";
const P_fromVar = "fromVar";
const P_selectedVar = "selectedVar";
const P_idsFilter = "idsFilter";

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
        } else {
            return v;
        }
    }
}
function fitMapToPath(path, maps, map) {
    const { LatLngBounds } = maps;
    const bounds = new LatLngBounds();
    path.forEach((point) => {
        bounds.extend(point);
    });
    map.fitBounds(bounds);
}
let existingMarkers;
let mapPolylines;
const computeRoute = async (from, to, mode, maps, map, context) => {
    if (!from || !to || !maps || !map) return;

    from = parseLocation(from, context);
    to = parseLocation(to, context);

    if (existingMarkers && existingMarkers.length > 0) {
        existingMarkers.forEach(marker => {
            marker.setMap(null);
        });
        existingMarkers = null;
    }

    if (mapPolylines && mapPolylines.length > 0) {
        mapPolylines.forEach(polyline => {
            polyline.setMap(null);
        });
        mapPolylines = null;
    }

    const { Route, RouteMatrix } = maps.routes;

    // Define a simple directions request.
    const request = {
        origin: from,
        destination: to,
        travelMode: mode || 'DRIVING',
        fields: ['path', 'legs'], //path
    };

    // Call computeRoutes to get the directions.
    const { routes } = await Route.computeRoutes(request);

    console.log("Computed routes:", routes);
    if (routes.length === 0) {
        return;
    }

    // Use createPolylines to create polylines for the route.
    mapPolylines = routes[0].createPolylines();
    // Add polylines to the map.
    mapPolylines.forEach((polyline) => polyline.setMap(map));

    fitMapToPath(routes[0].path, maps, map);

    // Add markers to start and end points.
    existingMarkers = await routes[0].createWaypointAdvancedMarkers({ map });


    // // Render navigation instructions.
    // const directionsPanel = document.getElementById("directions-panel");

    // if (!routes || routes.length === 0) {
    //     if (directionsPanel) {
    //         directionsPanel.textContent = "No routes available.";
    //     }
    // }

    // const route = routes[0];
    // if (!route.legs || route.legs.length === 0) {
    //     if (directionsPanel) {
    //         directionsPanel.textContent = "The route has no legs.";
    //     }
    //     return;
    // }

    // const fragment = document.createDocumentFragment();

    // route.legs.forEach((leg, index) => {
    //     const legContainer = document.createElement("div");
    //     legContainer.className = "directions-leg";
    //     legContainer.setAttribute("aria-label", `Leg ${index + 1}`);

    //     // Leg Title
    //     const legTitleElement = document.createElement("h3");
    //     legTitleElement.textContent = `Leg ${index + 1} of ${route.legs.length}`;
    //     legContainer.appendChild(legTitleElement);

    //     if (leg.steps && leg.steps.length > 0) {
    //         // Add steps to an ordered list
    //         const stepsList = document.createElement("ol");
    //         stepsList.className = "directions-steps";

    //         leg.steps.forEach((step, stepIndex) => {
    //             const stepItem = document.createElement("li");
    //             stepItem.className = "direction-step";
    //             stepItem.setAttribute("aria-label", `Step ${stepIndex + 1}`);

    //             // Maneuver
    //             if (step.maneuver) {
    //                 const maneuverNode = document.createElement("p");
    //                 maneuverNode.textContent = step.maneuver;
    //                 maneuverNode.className = "maneuver";
    //                 stepItem.appendChild(maneuverNode);
    //             }

    //             // Distance and Duration
    //             if (step.localizedValues) {
    //                 const distanceNode = document.createElement("p");
    //                 distanceNode.textContent = `${step.localizedValues.distance} (${step.localizedValues.staticDuration})`;
    //                 distanceNode.className = "distance";
    //                 stepItem.appendChild(distanceNode);
    //             }

    //             // Instructions
    //             if (step.instructions) {
    //                 const instructionsNode = document.createElement("p");
    //                 instructionsNode.textContent = step.instructions;
    //                 instructionsNode.className = "instruction";
    //                 stepItem.appendChild(instructionsNode);
    //             }

    //             stepsList.appendChild(stepItem);
    //         });
    //         legContainer.appendChild(stepsList);
    //     }

    //     fragment.appendChild(legContainer);
    //     directionsPanel.appendChild(fragment);
    // });
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
    positions;
    prevMarkerEle;
    prevMarkerId;
    prePos = { lat: 0, lng: 0 }
    unmounted = false;
    prevMarkers = [];

    constructor(props, context) {
        super(props, context);
        console.log("Init Google Map Sample");
        this.state = { loaded: false }
        this.divId = `MapSample_${id++}`;
    }

    route(props) {
        this.setState({ loaded: false });
        computeRoute(props.context.getFieldValue(props.context.params[P_fromVar]), this.prevMarkerEle && this.prevMarkerEle.position, 'DRIVING', this.maps, this.map, props.context).then(() => {
            if (this.unmounted) return;
            this.setState({ loaded: true });
        });
    }
    setMarker(props: MapSampleProps) {
        if (!this.maps || !this.positions || this.positions.length === 0) return;

        const { context, fieldsValues } = props;
        const common = context.modules[MODULE_COMMON];
        const { AkUtil, ContentListApi } = common;

        if (this.prevMarkers && this.prevMarkers.length > 0) {
            // remove previous markers
            this.prevMarkers.forEach(marker => {
                marker.setMap(null);
            });
            this.prevMarkers = [];
        }

        const ids = AkUtil.JSONParse(fieldsValues[context.params[P_idsFilter]]);
        let showDict;
        if (ids && Array.isArray(ids) && ids.length > 0) {
            showDict = {};
            ids.forEach(id => showDict[id] = true);
        }

        let geoArr = [];

        const setScale = (scale) => {
            if (this.prevMarkerEle) {
                const pin = new this.maps.marker.PinElement({
                    scale
                });
                this.prevMarkerEle.content = pin.element;
            }
        }
        const createMarker = (obj) => {

            const marker = new this.maps.marker.AdvancedMarkerElement({
                map: this.map,
                position: obj.Geo,
                gmpClickable: true,
                title: obj.Title
            });

            marker.addListener('click', (event) => {
                if (this.prevMarkerEle === marker) return;

                setScale(1.0);
                this.prevMarkerEle = marker;
                this.prevMarkerId = obj.Id;
                setScale(1.5);

                if (P_selectedVar in context.params) {
                    context.setFieldValue(context.params[P_selectedVar], obj.Id);
                }

                this.route(props);
            });

            return marker;
        }

        this.positions.forEach(p => {
            if (showDict && !(p.Id in showDict)) return;

            geoArr.push(p.Geo);
            this.prevMarkers.push(createMarker(p));
        });

        if (geoArr.length > 0) {
            fitMapToPath(geoArr, this.maps, this.map);
        }

        this.setState({ loaded: true });
    }

    componentWillReceiveProps(nextProps: Readonly<MapSampleProps>, nextContext: any): void {
        if (this.unmounted) return;

        let oldFrom = this.props.fieldsValues[this.props.context.params[P_fromVar]];
        let oldIds = this.props.fieldsValues[this.props.context.params[P_idsFilter]];
        let newFrom = nextProps.fieldsValues[nextProps.context.params[P_fromVar]];
        let newIds = nextProps.fieldsValues[nextProps.context.params[P_idsFilter]];

        if (oldFrom !== newFrom) {
            this.route(nextProps);
        }

        if (oldIds !== newIds) {
            this.setMarker(nextProps);
        }

    }

    componentWillUnmount() {
        this.unmounted = true;
    }


    componentDidMount() {
        const { context, fieldsValues } = this.props;
        const common = this.props.context.modules[MODULE_COMMON];
        const { AkUtil, ContentListApi } = common;

        const f_title = context.params[P_titleField];
        const f_geo = context.params[P_geoField];

        const suReq = {
            AppID: 41,
            ListID: context.params[p_listID],
            Verification: false,
            Columns: ["ListDataID", f_title, f_geo],
            pageIndex: 0,
            pageSize: 100
        };
        ContentListApi.GetDataByListID(suReq).then(d => {
            if (d.Status === 0) {
                if (d.Data && d.Data.length) {
                    this.positions = [];
                    for (var i = 0; i < d.Data.length; i++) {
                        const item = d.Data[i];
                        if (item[f_geo]) {
                            this.positions.push({
                                Id: item["ListDataID"],
                                Title: item[f_title],
                                Geo: AkUtil.JSONParse(item[f_geo])
                            });
                        }
                    }

                    this.setMarker(this.props);
                }
            } else {
                console.log("Failed to load data: ", d.Message);
            }
        });

        const initMap = (maps) => {
            this.maps = maps;

            const map = new maps.Map(document.getElementById(this.divId), {
                center: { lat: 0, lng: 0 },
                zoom: 12,
                mapId: context.params[P_mapId] || DF_MAPID
            });
            this.map = map;
            this.setMarker(this.props);
        }

        const maps = AkUtil.get(window, "google.maps");

        const onJsLoad = async () => {
            // init map components
            const google = (window as any).google;
            await google.maps.importLibrary("marker");
            await google.maps.importLibrary("routes");
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
        </AkSpin>;
    }
}



export class CodeInApplication implements CodeInComp {
    render(context: CodeInContext, fieldsValues: any, readonly: boolean) {
        return <MapSample context={context} fieldsValues={fieldsValues} readonly={readonly} />;
    }

    requiredFields(params) {
        return [params[P_fromVar], params[P_idsFilter]];
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
            id: p_listID,
            type: "string",
            desc: "ID of list stored location records"
        },
        {
            id: P_titleField,
            type: "string",
            desc: "Field ID of list to store title of the location"
        },
        {
            id: P_geoField,
            type: "string",
            desc: "Field ID of list to store the geo location"
        },
        {
            id: P_fromVar,
            type: "string",
            desc: "Variable ID to route from"
        },
        {
            id: P_selectedVar,
            type: "string",
            desc: "Variable ID to save selected item ID"
        },
        {
            id: P_idsFilter,
            type: "string",
            desc: "Optional, a variable ID that contains an array of IDs to filter the records from the list"
        }
        ] as InputParameter[];
    }
}