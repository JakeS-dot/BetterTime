# BetterTime!
## A remake of the WakaTime software with an upgraded feature set, and no premium paywalls!
> [!NOTE]
> This software is not *in any way* meant to replace/devalue WakaTime!!! I love WakaTime so much and you should too! Support them [here](https://wakatime.com/pricing). 

### Why? 
I've always had a problem with the fact that I couldn't view data past only **14** days, and I wanted a couple extra features

### Whats new?
 - Support to look back for any time range
 - (tbd)
 - (tbd)
   

### Architecture
```
Tailwind Vite + TS Frontend
   │
   ▼
Python Flask endpoint
   │
   ├─ Gets Authorization From User Login
   ├─ Calls WakaTime endpoints
   └─ Processes Endpoints
   │
   ▼
JSON Response - put into charts on frontend
```

----------

## Installing
#### Go to the website
TODO: add link here

Just go [here!](https://example.com) 
#### Locally
1. Clone the repository with git
2. [Create an app](https://wakatime.com/apps) via WakaTime and copy your *Client ID and Secret*
3. Make a file in the `Python` directory called `local.env`
4. In the file, paste in this, replacing the placeholder info with your info
```
WAKA_APP_ID=your_app_id_here
WAKA_APP_SECRET=waka_sec...here
```
5. Run the command `npm run dev` in the root directory
6. In a separate window, run `python3 app.py` to run the back-end (Flask Server) in the same file where you should've put your .env file
7. Boom!
