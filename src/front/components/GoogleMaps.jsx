import React, { useState, useRef, useEffect } from "react";


function GoogleMaps({ lat, lng, setLat, setLng, address, setAddress }) {
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const [search, setSearch] = useState("");

    const fetchAddress = (latitude, longitude) => {
        const key = import.meta.env.VITE_GOOGLE_MAPS_KEY || '';
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${key}`)
            .then(res => res.json())
            .then(data => {
                if (data.status === "OK" && data.results.length > 0) {
                    // Filtrar para evitar códigos Plus y 'Sin Nombre'
                    const result = data.results.find(r =>
                        !/^([A-Z0-9]{4,}\+\w{2,})/.test(r.formatted_address) &&
                        !r.formatted_address.includes('Sin Nombre')
                    );
                    setAddress(result ? result.formatted_address : "");
                } else {
                    setAddress("");
                }
            })
            .catch(() => setAddress(""));
    };

    const fetchCoords = (direccion) => {
        const key = import.meta.env.VITE_GOOGLE_MAPS_KEY || '';
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(direccion)}&key=${key}`)
            .then(res => res.json())
            .then(data => {
                if (data.status === "OK" && data.results.length > 0) {
                    const loc = data.results[0].geometry.location;
                    setLat(loc.lat);
                    setLng(loc.lng);
                    setAddress(data.results[0].formatted_address);
                }
            });
    };

    useEffect(() => {
        fetchAddress(lat, lng);
    }, [lat, lng]);

    useEffect(() => {
        function safeInitMap() {
            if (window.google && window.google.maps && typeof window.google.maps.Map === "function") {
                const center = { lat: lat ? parseFloat(lat) : 20, lng: lng ? parseFloat(lng) : -99 };
                const map = new window.google.maps.Map(mapRef.current, {
                    center,
                    zoom: 5,
                    mapId: "12fb4a783b70dc8349a13bb3"
                });
                if (window.google.maps.marker && window.google.maps.marker.AdvancedMarkerElement) {
                    markerRef.current = new window.google.maps.marker.AdvancedMarkerElement({
                        position: center,
                        map,
                        draggable: true,
                    });
                    map.addListener("click", (e) => {
                        markerRef.current.position = e.latLng;
                        setLat(e.latLng.lat());
                        setLng(e.latLng.lng());
                        fetchAddress(e.latLng.lat(), e.latLng.lng());
                    });
                    markerRef.current.addListener("dragend", (e) => {
                        setLat(e.latLng.lat());
                        setLng(e.latLng.lng());
                        fetchAddress(e.latLng.lat(), e.latLng.lng());
                    });
                } else {
                    markerRef.current = new window.google.maps.Marker({
                        position: center,
                        map,
                        draggable: true,
                    });
                    map.addListener("click", (e) => {
                        markerRef.current.setPosition(e.latLng);
                        setLat(e.latLng.lat());
                        setLng(e.latLng.lng());
                        fetchAddress(e.latLng.lat(), e.latLng.lng());
                    });
                    markerRef.current.addListener("dragend", (e) => {
                        setLat(e.latLng.lat());
                        setLng(e.latLng.lng());
                        fetchAddress(e.latLng.lat(), e.latLng.lng());
                    });
                }
            } else {
                setTimeout(safeInitMap, 100);
            }
        }

        const key = import.meta.env.VITE_GOOGLE_MAPS_KEY || '';
        const scriptId = "google-maps-script";
        const existingScript = document.getElementById(scriptId);
        if (!window.google) {
            if (!existingScript) {
                const script = document.createElement("script");
                script.id = scriptId;
                script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=marker&loading=async`;
                script.async = true;
                script.defer = true;
                script.onload = safeInitMap;
                script.onerror = function () {
                    if (mapRef.current) {
                        mapRef.current.innerHTML = '<div style="color:red;text-align:center;padding:20px;">No se pudo cargar el mapa. Verifica tu conexión o la clave de Google Maps.</div>';
                    }
                };
                document.body.appendChild(script);
            } else {
                existingScript.onload = safeInitMap;
                existingScript.onerror = function () {
                    if (mapRef.current) {
                        mapRef.current.innerHTML = '<div style="color:red;text-align:center;padding:20px;">No se pudo cargar el mapa. Verifica tu conexión o la clave de Google Maps.</div>';
                    }
                };
            }
        } else {
            safeInitMap();
        }
    }, [lat, lng]);

    return (
        <>
            <input
                type="text"
                value={address}
                onChange={e => {
                    setAddress(e.target.value);
                    setSearch(e.target.value);
                }}
                onBlur={() => search && fetchCoords(search)}
                style={{ width: "100%", marginBottom: 8, borderRadius: 8, padding: 8 }}
                placeholder="Dirección"
            />
            <div ref={mapRef} style={{ width: "100%", height: 250, marginBottom: 8, borderRadius: 8 }} />
        </>
    );
}

export default GoogleMaps;
