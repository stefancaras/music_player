import os
with open("../music_list.js", "w") as my_file:
    playlist = str(sorted([*map(lambda e: e[:-4], os.listdir('../music'))], key=str.lower))
    my_file.write('export const music_list = ' + playlist)
