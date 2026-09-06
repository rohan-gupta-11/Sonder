const mapElement = document.getElementById("map");

if (mapElement) {
    const coordinates = mapElement.dataset.coordinates
        .split(",")
        .map(Number);

    const location = mapElement.dataset.location;

    const map = L.map("map").setView(
        [coordinates[1], coordinates[0]],
        13
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.marker([coordinates[1], coordinates[0]])
        .addTo(map)
        .bindPopup(location)
        .openPopup();
}