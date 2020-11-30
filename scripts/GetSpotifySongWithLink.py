  
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials #To access authorised Spotify data
import pprint
import sys
import webbrowser
import spotipy.util as util 
import json

def export_song_info(url):
    export_data = []
    song = sp.track(url)
    playlistObj = {
        "name": song['name'],
        "artists": song['artists'][0]['name'],
    }
    z = json.dumps(playlistObj)
    print(z)
            
client_id = "5a50ec388e014dda8c475275e7a39631"
client_secret = "58ce595bfef64775aea3a7a32bd83116"
client_credentials_manager = SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager) #spotify object to access API
url = sys.argv[1]
export_song_info(url)