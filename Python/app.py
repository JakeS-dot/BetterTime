from datetime import datetime
import hashlib
import os
from rauth import OAuth2Service
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

load_dotenv('local.env')


@app.route('/')
def hello_world():
    return 'Hello World!'


@app.route('/process_json', methods=['POST'])
def process_json():
    try:
        request_data = request.get_json()
        json_data = request_data['jsonData']
        day1 = request_data['day1']
        day2 = request_data['day2']

        # Access the "days" key in the JSON
        days_data = json_data.get("days", {})
        data = {}
        days_0 = days_data[0]["date"]

        # Parse the strings to datetime objects
        day1 = datetime.strptime(day1, "%Y-%m-%dT%H:%M:%S.%fZ")
        day2 = datetime.strptime(day2, "%Y-%m-%dT%H:%M:%S.%fZ")

        # Calculate the absolute difference in days

        date0 = datetime.strptime(days_0, "%Y-%m-%d")

        # Subtract dates
        i = int(abs(date0 - day1).days)
        day2 = int(abs(day1 - day2).days) + i

        print(i, day2)
        a = 0
        while i <= day2:
            print(i)
            data[a] = days_data[i]
            print(data[a])
            i += 1
            a += 1

        return jsonify(data), 200
    except KeyError as e:
        return jsonify({'error': f'JSON key not found: {e}'}), 401
    except ValueError:
        return jsonify({'error': 'Not Valid WakaTime Data'}), 402
    except IndexError:
        return jsonify({'error': 'Date (presumably) not found'}), 403
    except Exception as e:
        return jsonify({'error': "Flask - " + str(e)}), 400


def get_wakatime_service():
    return OAuth2Service(
        client_id=os.environ.get("VITE_WAKA_APP_ID"),
        client_secret=os.environ.get("VITE_WAKA_APP_SECRET"),
        name='wakatime',
        authorize_url='https://wakatime.com/oauth/authorize',
        access_token_url='https://wakatime.com/oauth/token',
        base_url='https://wakatime.com/api/v1/'
    )


@app.route("/get_access_token", methods=['POST'])
def get_access_token():
    try:
        data = request.json
        token = data.get("token")

        headers = {'Accept': 'application/x-www-form-urlencoded'}
        service = get_wakatime_service()
        service.get_auth_session(headers=headers, data={
            "code": token, 'grant-type': 'authorization-code',
            'redirect_uri': 'http://localhost:5173/login'})
        return 200

    except Exception as e:
        return jsonify({"error": "An error occurred", "details": str(e)}), 500


def create_dump(token):
    try:
        service = get_wakatime_service()
        dump_url = "https://wakatime.com/api/v1/users/current/data_dumps"

        session = service.get_session(token)
        response = session.post(
            dump_url,
            json={
                "type": "daily",
                "email_when_finsihed": False
            },
            headers={"Content-Type": "application/json"}
        )
        print(response.json())
        return response
    except Exception as e:
        return Exception("Error creating dump: " + str(e))


@app.route("/get_dumps", methods=['POST'])
def get_dumps():
    try:
        token = request.json
        token = token["token"][0]["token"]
        service = get_wakatime_service()
        session = service.get_session(token)
        response = session.get("users/current/data_dumps")

        if response.json()['data'] == []:
            app.logger.info('**Creating a dump**')
            create_dump(token)

        if response.status_code == 200:
            return jsonify(response.json()), 200
        else:
            return jsonify({
                           "error": "Failed to retrieve user data",
                           "details": response.json()
                           }), response.status_code

    except Exception as e:
        return jsonify({"error": "An error occurred", "details": str(e)}), 500


@app.route("/get_user_data", methods=['POST'])
def get_udata():
    try:
        token = request.json
        token = token.get("token")
        service = get_wakatime_service()
        session = service.get_session(token)
        response = session.get("users/current")

        if response.status_code == 200:
            return jsonify(response.json()), 200
        else:
            return jsonify({
                           "error": "Failed to retrieve user data",
                           "details": response.json()
                           }), response.status_code
    except Exception as e:
        return jsonify({"error": "An error occurred", "details": str(e)}), 500


@app.route("/get_login_link")
def login():
    try:
        service = get_wakatime_service()
        redirect_uri = "http://localhost:5173/login"
        state = hashlib.sha1(os.urandom(40)).hexdigest()

        params = {
            "redirect_uri": redirect_uri,
            "response_type": "token",
            "state": state,
            "scope": 'email, read_heartbeats'
        }

        url = service.get_authorize_url(**params)
        return jsonify({"url": url}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/revoke_token", methods=['POST'])
def logout():
    try:
        data = request.get_json()
        uid = data.get("uid")

        if not uid:
            return jsonify({"error": "User ID is required"}), 400

        service = get_wakatime_service()
        revoke_url = "https://wakatime.com/oauth/revoke"

        session = service.get_session()
        response = session.post(
            revoke_url,
            data={
                "client_id": service.client_id,
                "client_secret": service.client_secret,
                "user_id": uid
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        if response.status_code == 200:
            return jsonify({"message": "Token revoked successfully"}), 200
        else:
            return jsonify({"error from making wakatime request":
                            response.text}), response.status_code
    except Exception as e:
        return jsonify({"error (in python)": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
