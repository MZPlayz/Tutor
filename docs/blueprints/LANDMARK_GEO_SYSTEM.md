# Landmark Geo-System

- **The Problem:** Dhaka/Narayanganj house numbers are useless for navigation.
- **The Solution:** Search is radius-based, but "Arrival" is Landmark-based.
- **Data Collection:** Every booking stores a `landmark_description`. 
- **Validation:** If `landmark` contains words like "IDK" or "None," the booking is flagged for student correction.