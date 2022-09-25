import React from "react";
import { Map, Marker } from "pigeon-maps";
import { Modal } from "antd";

export function appMap({
  gps,
}: {
  gps: { latitude: number; longitude: number };
}) {
  Modal.info({
    content: (
      <Map
        height={300}
        width={450}
        defaultCenter={[gps?.latitude, gps?.longitude]}
        defaultZoom={13}
      >
        <Marker
          width={40}
          anchor={[gps?.latitude, gps?.longitude]}
          color="red"
        />
      </Map>
    ),
    onOk() {},
    closable: true,
    style: { display: "flex", justifyContent: "center", alignItems: "center" },
    icon: null,
  });
  //   return (
  //     <Modal
  //       visible={visible}
  //       onCancel={onCancel}
  //       style={{
  //         display: "flex",
  //         justifyContent: "center",
  //         alignItems: "center",
  //       }}
  //     >
  //       <Map
  //         height={300}
  //         width={450}
  //         defaultCenter={[gps.latitude, gps.longitude]}
  //         defaultZoom={13}
  //       >
  //         <Marker width={50} anchor={[gps.latitude, gps.longitude]} />
  //       </Map>
  //     </Modal>
  //   );
}
