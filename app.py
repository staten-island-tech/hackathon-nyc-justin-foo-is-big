from flask import Flask, render_template, request, jsonify
import random

app = Flask(__name__)

# Difficulty settings
DIFFICULTY_SETTINGS = {
    "easy": {"pairs": 4, "attempts": None},
    "medium": {"pairs": 8, "attempts": 20},
    "hard": {"pairs": 12, "attempts": 15},
}

# Sample landmark data (replace URLs with real images)
LANDMARKS = {
    "easy": [
        {"name": "Statue of Liberty", "image": "https://upload.wikimedia.org/wikipedia/commons/a/a1/Statue_of_Liberty_7.jpg"},
        {"name": "Empire State Building", "image": "https://upload.wikimedia.org/wikipedia/commons/9/9e/Empire_State_Building_%28aerial_view%29.jpg"},
        {"name": "Brooklyn Bridge", "image": "https://upload.wikimedia.org/wikipedia/commons/5/5f/Brooklyn_Bridge_Postdlf.jpg"},
        {"name": "Times Square", "image": "https://upload.wikimedia.org/wikipedia/commons/f/f7/Times_Square%2C_New_York_City_%28HDR%29.jpg"},
    ],
    "medium": [
        # Add 8 distinct landmarks (4 pairs * 2)
        {"name": "Central Park", "image": "https://upload.wikimedia.org/wikipedia/commons/e/e6/Central_Park_New_York_City_New_York_23.jpg"},
        {"name": "One World Trade Center", "image": "https://upload.wikimedia.org/wikipedia/commons/9/91/One_World_Trade_Center_2015.jpg"},
        {"name": "The Metropolitan Museum of Art", "image": "https://upload.wikimedia.org/wikipedia/commons/7/77/Metropolitan_Museum_of_Art_%28The_Met%29_entrance.jpg"},
        {"name": "Rockefeller Center", "image": "https://upload.wikimedia.org/wikipedia/commons/0/05/Rockefeller_Center_-_Dec_2014.jpg"},
        {"name": "Grand Central Terminal", "image": "https://upload.wikimedia.org/wikipedia/commons/0/0b/Grand_Central_Terminal_Main_Concourse_2014.jpg"},
        {"name": "Flatiron Building", "image": "https://upload.wikimedia.org/wikipedia/commons/8/82/Flatiron_Building_2010.jpg"},
        {"name": "St. Patrick's Cathedral", "image": "https://upload.wikimedia.org/wikipedia/commons/4/4e/St_Patrick%27s_Cathedral_2013.jpg"},
        {"name": "High Line", "image": "https://upload.wikimedia.org/wikipedia/commons/2/29/High_Line_20th_Street_looking_downtown.jpg"},
    ],
    "hard": [
        # Add 12 distinct landmarks (6 pairs * 2)
        {"name": "Chrysler Building", "image": "https://upload.wikimedia.org/wikipedia/commons/1/10/Chrysler_Building_by_David_Shankbone_edit.jpg"},
        {"name": "New York Public Library", "image": "https://upload.wikimedia.org/wikipedia/commons/0/04/New_York_Public_Library_01.jpg"},
        {"name": "Battery Park", "image": "https://upload.wikimedia.org/wikipedia/commons/5/5c/Battery_Park_from_Battery_Park_City_2.JPG"},
        {"name": "Coney Island", "image": "https://upload.wikimedia.org/wikipedia/commons/a/a1/Coney_Island_Boardwalk_NY.jpg"},
        {"name": "Bryant Park", "image": "https://upload.wikimedia.org/wikipedia/commons/f/f9/Bryant_Park_%28New_York_City%29_002.JPG"},
        {"name": "Columbus Circle", "image": "https://upload.wikimedia.org/wikipedia/commons/f/f7/Columbus_Circle_2015.jpg"},
        {"name": "Flatiron Building", "image": "https://upload.wikimedia.org/wikipedia/commons/8/82/Flatiron_Building_2010.jpg"},
        {"name": "Staten Island Ferry", "image": "https://upload.wikimedia.org/wikipedia/commons/9/9a/Staten_Island_Ferry_at_Whitehall_Terminal_jeh.jpg"},
        {"name": "New York City Hall", "image": "https://upload.wikimedia.org/wikipedia/commons/6/62/NYC_City_Hall.jpg"},
        {"name": "Madison Square Garden", "image": "https://upload.wikimedia.org/wikipedia/commons/3/30/Madison_Square_Garden_2006.jpg"},
        {"name": "Washington Square Park", "image": "https://upload.wikimedia.org/wikipedia/commons/6/6b/Washington_Square_Park_Summer_2013_006.jpg"},
        {"name": "The Cloisters", "image": "https://upload.wikimedia.org/wikipedia/commons/a/a9/The_Cloisters_entrance.jpg"},
    ],
}


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/game')
def game():
    difficulty = request.args.get('difficulty', 'easy').lower()
    if difficulty not in DIFFICULTY_SETTINGS:
        difficulty = 'easy'
    settings = DIFFICULTY_SETTINGS[difficulty]
    return render_template('game.html', difficulty=difficulty, settings=settings)


@app.route('/api/landmarks')
def api_landmarks():
    difficulty = request.args.get('difficulty', 'easy').lower()
    landmarks = LANDMARKS.get(difficulty, LANDMARKS['easy'])
    pairs = DIFFICULTY_SETTINGS.get(difficulty, {"pairs": 4})["pairs"]

    # Select number of pairs
    selected = landmarks[:pairs]

    # Double for pairs, shuffle
    cards = selected * 2
    random.shuffle(cards)

    return jsonify(cards)


if __name__ == '__main__':
    app.run(debug=True)
