var res = {
    plist1:"res/Plist1.plist",
    Plist1_png:"res/Plist1.png",
    bg1_jpg:'res/bg1.jpg'
};

var musicRes = 
{
	game_music_ogg : "res/Music/game_music.ogg",
	game_music2_ogg : "res/Music/game_music2.ogg",
	mouse0_ogg : "res/Music/mouse0.ogg",
	no_hit_ogg : "res/Music/no_hit.ogg",
	over_music_ogg : "res/Music/over_music.ogg",
	second_music_ogg : "res/Music/second_music.ogg",
	time_music_ogg : "res/Music/time_music.ogg",
}

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
for (var i in musicRes) {
    g_resources.push(musicRes[i]);
}