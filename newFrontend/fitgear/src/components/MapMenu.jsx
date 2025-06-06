import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const locations = [
        { name: "10 Sumska St, Kharkiv, Kharkiv Oblast", descript: "(Located in the city center, near Freedom Square.)", position: { lat: 49.993250, lng: 36.232138 } },
        { name: "35 Nauky Ave, Kharkiv, Kharkiv Oblast", descript: "(Situated in the area of the \"Nauka\" metro station.)", position: { lat: 50.015000, lng: 36.220000 } },
        { name: "148 Poltavskyi Shliakh St, Kharkiv, Kharkiv Oblast", descript: "(Located in the railway station district.)" ,position: { lat: 49.981000, lng: 36.250000 } },
    ];

export default function MapMenu() {
    const [selected, setSelected] = useState(locations[0]);

    return (
        <>
            <div className="max-w-[1300px] mx-auto p-6 border border-gray-200 shadow-md">
                <h2 className="text-5xl mb-4">Find a Pickup Point Near You</h2>
                <p className="text-2xl mb-12">Select a nearby location and grab your rented sports equipment in minutes</p>
                <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="flex w-[400px] h-[300px] md:w-[500px] md:h-[400px] overflow-hidden">
                        <LoadScript googleMapsApiKey="AIzaSyDQIq_wuuRuA5hZSbQlsWaY4Tryig3Ji9c">
                            <GoogleMap
                                mapContainerStyle={{ width: "100%", height: "100%" }}
                                center={selected.position}
                                zoom={16}>
                                <Marker position={selected.position} />
                            </GoogleMap>
                        </LoadScript>
                    </div>

                    <div className="w-full md:w-[500px] rounded flex flex-col">
                        {locations.map((loc, i) => (
                            <button
                                key={i}
                                onClick={() => setSelected(loc)}
                                className={`px-4 py-8 border-gray-300 text-left cursor-pointer
                                     hover:bg-gray-200 hover:border-l
                                     transition select-text ${i === locations.length - 1 ? "" : "border-b-3"} 
                                     ${selected.name === loc.name ? "text-yellow-500" : "text-black" }`}
                            >
                                <p className="text-xl">{loc.name}</p>
                                <p className="text-md">{loc.descript}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}