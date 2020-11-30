  
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials #To access authorised Spotify data
import pprint
import sys
import webbrowser
import spotipy.util as util 
import json

def getAllTracks(url):
    Songs = []
    
    results = sp.playlist_tracks(url)
    tracks = results['items']
    while results['next']:
        results = sp.next(results)
        tracks.extend(results['items'])
    for track in tracks:
        song = {
            "name": track['track']['name'],
            "artists": track['track']['artists'][0]['name'],
        }
        Songs.append(song)
        # print(str(track['track']['name']),str(track['track']['artists'][0]['name']))
    print(json.dumps(Songs))
    

            
client_id = "5a50ec388e014dda8c475275e7a39631"
client_secret = "58ce595bfef64775aea3a7a32bd83116"
client_credentials_manager = SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager) #spotify object to access API

link = sys.argv[1]
getAllTracks(link)
