import hashlib
import os
from rauth import OAuth2Service
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from dotenv import load_dotenv
from pathlib import Path

app = Flask(__name__)
CORS(app, supports_credentials=True,
     origins=["http://localhost:5173"])

env_path = Path(__file__).parent / "local.env"
load_dotenv(env_path)


@app.route('/')
def hello_world():
    return 'Hello World!'


def get_wakatime_service():
    return OAuth2Service(
        client_id=os.environ.get("WAKA_APP_ID"),
        client_secret=os.environ.get("WAKA_APP_SECRET"),
        name='wakatime',
        authorize_url='https://wakatime.com/oauth/authorize',
        access_token_url='https://wakatime.com/oauth/token',
        base_url='https://wakatime.com/api/v1/'
    )


@app.route("/set_cookie")
def set_cookie():
    resp = make_response(jsonify({"message": "cookie set"}))

    resp.set_cookie(
        "test_cookie",
        "flask_cookie_value",
        httponly=True,
        samesite="None",
        secure=True
    )

    return resp


@app.route("/get_cookie")
def get_cookie():
    cookie = request.cookies.get("test_cookie")
    return jsonify({"cookie_received": cookie})


def parse_form_encoded(text):
    data = {}
    pairs = text.split("&")

    for pair in pairs:
        key, value = pair.split("=", 1)
        data[key] = value

    return data


@app.route("/get_access_token", methods=['POST'])
def get_access_token():
    try:
        code = request.json.get("token")

        service = get_wakatime_service()

        session = service.get_auth_session(
            data={
                "code": code,
                "grant_type": "authorization_code",
                "redirect_uri": "http://localhost:5173/login"
            }
        )
        raw = session.access_token_response.text

        token_data = parse_form_encoded(raw)

        access_token = token_data.get("access_token")
        refresh_token = token_data.get("refresh_token")

        resp = make_response(jsonify({"success": True}))
        resp.set_cookie(
            "access_token",
            access_token,
            httponly=True,
            secure=True,
            samesite="None"
        )

        resp.set_cookie(
            "refresh_token",
            refresh_token,
            httponly=True,
            secure=True,
            samesite="None"
        )

        return resp

    except Exception as e:
        return jsonify({"error": "An error occurred", "details": str(e)}), 500


@app.route("/refresh_token", methods=["POST"])
def refresh_token():
    try:
        data = request.json or {}
        refresh_token = data.get("refresh_token")

        if not refresh_token:
            return jsonify({"error": "Missing refresh_token"}), 400

        service = get_wakatime_service()

        response = service.get_raw_access_token(
            data={
                "grant_type": "refresh_token",
                "refresh_token": refresh_token,
                "client_id": service.client_id,
                "client_secret": service.client_secret,
                "redirect_uri": "http://localhost:5173/login"
            }
        )

        token_data = response.json()

        if response.status_code != 200:
            return jsonify({
                "error": "Failed to refresh token",
                "details": token_data
            }), response.status_code

        return jsonify({
            "access_token": token_data.get("access_token"),
            "refresh_token": token_data.get("refresh_token"),
            "expires_in": token_data.get("expires_in")
        }), 200

    except Exception as e:
        return jsonify({
            "error": "Error refreshing token",
            "details": str(e)
        }), 500


@app.route("/get_stats_data", methods=["POST"])
def get_stats():
    try:
        data = request.json or {}

        token = request.cookies.get("access_token")
        # range = data.get("range")
        start = data.get("start")
        end = data.get("end")

        if not token:
            return jsonify({"error": "Missing token"}), 400

        service = get_wakatime_service()
        session = service.get_session(token)

        summaries_url = f"https://wakatime.com/api/v1/users/current/summaries?start={start}&end={end}"
        all_time_url = "https://wakatime.com/api/v1/users/current/all_time_since_today"

        summaries_response = session.get(summaries_url)
        all_time_response = session.get(all_time_url)

        if summaries_response.status_code == 401 or all_time_response.status_code == 401:
            return jsonify({
                "error": "Unauthorized",
                "message": "Token expired or invalid"
            }), 401

        if not summaries_response.ok or not all_time_response.ok:
            return jsonify({
                "error": "Failed to fetch data",
                "summaries_status": summaries_response.status_code,
                "all_time_status": all_time_response.status_code,
                "summaries_msg": summaries_response.text,
                "all_time_msg": all_time_response.text
            }), 500

        summaries_data = summaries_response.json()
        all_time_data = all_time_response.json()

        dashboard_data = {
            "dailyTotals": summaries_data.get("data", []),
            "allTime": all_time_data.get("data", {})
        }

        return jsonify(dashboard_data), 200

    except Exception as e:
        return jsonify({
            "error": "Error getting stats | Server side",
            "message": str(e)
        }), 500


@app.route("/get_user_data", methods=['POST'])
def get_udata():
    try:
        token = request.cookies.get("access_token")

        if not token:
            return jsonify({"error": "User not logged in"}), 401

        service = get_wakatime_service()
        session = service.get_session(token)
        response = session.get("users/current")

        if response.status_code == 200:
            return jsonify(response.json()), 200

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
            "response_type": "code",
            "state": state,
            "scope": "email read_stats read_summaries"
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
        return jsonify({
            "error from making wakatime request": response.text
        }), response.status_code
    except Exception as e:
        return jsonify({"error (in python)": str(e)}), 500


if __name__ == '__main__':
    app.run(host="localhost", port=5000, debug=True)
