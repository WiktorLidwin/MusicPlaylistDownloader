import spotipy
from spotipy.oauth2 import SpotifyClientCredentials #To access authorised Spotify data
import pprint
import sys
import webbrowser
import spotipy.util as util
client_id = "5a50ec388e014dda8c475275e7a39631"
client_secret = "58ce595bfef64775aea3a7a32bd83116"
client_credentials_manager = SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager) #spotify object to access API
name = "{Eminem}" #chosen artist
result = sp.search(name) #search query
print(result['tracks']['items'][0]['artists'])

token = util.prompt_for_user_token(username='wiktortheboss', scope='playlist-modify-private,playlist-modify-public',
                                   client_id='5a50ec388e014dda8c475275e7a39631',
                                   client_secret='58ce595bfef64775aea3a7a32bd83116',
                                   redirect_uri='http://localhost:8888/callback')

if len(sys.argv) > 1:
    search_str = sys.argv[1]
else:
    search_str = 'Worth it'

result = sp.search(search_str)
#pprint.pprint(result['tracks']['items'][0]['artists'])


client_credentials_manager = SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager) #spotify object to access API

user = 'wiktortheboss'


playlists = sp.user_playlists(user)

# while playlists:
#     for i, playlist in enumerate(playlists['items']):
#         print("%4d %s %s" % (i + 1 + playlists['offset'], playlist['uri'],  playlist['name']))
#     if playlists['next']:
#         playlists = sp.next(playlists)
#     else:
#         playlists = None

def show_tracks(results):
    for i, item in enumerate(results['items']):
        track = item['track']
        print("   %d %32.32s %s" % (i, track['artists'][0]['name'], track['name']))



if True:
    username = "wiktortheboss"


    playlists = sp.user_playlists(username)
    for playlist in playlists['items']:
        if playlist['owner']['id'] == username:
            print()
            print(playlist['name'])
            print('  total tracks', playlist['tracks']['total'])
            results = sp.user_playlist(username, playlist['id'], fields="tracks,next")
            tracks = results['tracks']
            show_tracks(tracks)
            while tracks['next']:
                tracks = sp.next(tracks)
                show_tracks(tracks)
