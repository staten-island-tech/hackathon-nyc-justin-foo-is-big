from flask import Flask, render_template

app = Flask(__name__)

        {"name": "Grand Central Terminal", "image": "https://upload.wikimedia.org/wikipedia/commons/0/0b/Grand_Central_Terminal_Main_Concourse_2014.jpg"},
@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)