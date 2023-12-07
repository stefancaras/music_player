import os
with open("music_list.js", "w") as my_file:
    my_file.write('export const music_list = ')
    my_file.write(str(list(map(lambda e: e[:-4], os.listdir('../music')))))