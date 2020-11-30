  
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials #To access authorised Spotify data
import pprint
import sys
import webbrowser
import spotipy.util as util 
import json



def export_playlists(playlist):
    export_data = []
    for playlist in playlists['items']:
        if playlist['owner']['id'].lower() == username.lower():
            playlistObj = {
                "name" : playlist['name'],
                "uri": playlist['uri'],
            }
            export_data.append(playlistObj)
    listToStr = ' '.join(map(str, export_data)) 
    y = json.dumps(export_data)
    print(y)        
client_id = "5a50ec388e014dda8c475275e7a39631"
client_secret = "58ce595bfef64775aea3a7a32bd83116"
client_credentials_manager = SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager) #spotify object to access API
username = sys.argv[1]
playlists = sp.user_playlists(username)
export_playlists(playlists)
