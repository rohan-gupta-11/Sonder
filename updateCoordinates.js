const mongoose = require("mongoose");
const axios = require("axios");
const Listing = require("./models/listing.js");
require("dotenv").config();

const dbUrl = "mongodb://127.0.0.1:27017/wanderlust";

async function updateCoordinates() {
    try {
        await mongoose.connect(dbUrl);
        console.log("Connected to MongoDB");

        const listings = await Listing.find({
            $or: [
                { geometry: { $exists: false } },
                { "geometry.coordinates": { $exists: false } }
            ]
        });

        console.log(`Listings needing coordinates: ${listings.length}`);

        for (let i = 0; i < listings.length; i++) {
            const listing = listings[i];

            console.log(
                `\n[${i + 1}/${listings.length}] Processing: ${listing.location}, ${listing.country}`
            );

            try {
                const response = await axios.get(
                    "https://nominatim.openstreetmap.org/search",
                    {
                        params: {
                            q: `${listing.location}, ${listing.country}`,
                            format: "json",
                            limit: 1
                        },
                        headers: {
                            "User-Agent": "Wanderlust/1.0"
                        }
                    }
                );

                if (response.data.length > 0) {
                    const longitude = parseFloat(response.data[0].lon);
                    const latitude = parseFloat(response.data[0].lat);

                    listing.geometry = {
                        type: "Point",
                        coordinates: [longitude, latitude]
                    };

                    await listing.save();

                    console.log(
                        `✓ Saved: ${latitude}, ${longitude}`
                    );
                } else {
                    console.log(
                        `✗ Location not found: ${listing.location}, ${listing.country}`
                    );
                }

                // Wait 1 second before the next request
                await new Promise(resolve => setTimeout(resolve, 1000));

            } catch (error) {
                console.log(
                    `✗ Error processing ${listing.location}:`,
                    error.message
                );
            }
        }

        console.log("\n=================================");
        console.log("Coordinate update completed!");
        console.log("=================================");

    } catch (error) {
        console.error("Database error:", error);
    } finally {
        await mongoose.connection.close();
        console.log("MongoDB connection closed");
    }
}

updateCoordinates();