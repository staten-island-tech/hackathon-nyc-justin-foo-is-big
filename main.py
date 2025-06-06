from flask import Flask, render_template, jsonify
import requests
import random

app = Flask(__name__)

# Sample API endpoint (You can replace this with a real one like NYC Open Data or a static JSON file hosted elsewhere)
API_URL = "https://data.cityofnewyork.us/resource/43nn-pn8j.json"  # NYC landmarks (replace with your own if needed)

# Fetch landmark data
@app.route("/api/landmarks")
def get_landmarks():
    try:
        response = requests.get(API_URL)
        landmarks = response.json()

        # Filter and select only needed data (e.g., name, location, image)
        simplified = [
            {
                "name": landmark.get("landmark_name", "Unknown"),
                "borough": landmark.get("borough", "Unknown")
            }
            for landmark in landmarks if "landmark_name" in landmark
        ]

        # Shuffle and pair for memory match (only 8 pairs)
        selected = random.sample(simplified, min(8, len(simplified)))
        card_pairs = selected + selected
        random.shuffle(card_pairs)

        return jsonify(card_pairs)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Home page
@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)