const mutations = {
  ics(state, id) {
    state.playRecId = id;
  },
  SET_SONG(state, newAarr) {
    state.song = newAarr;
  },
  setSource(state, id) {
    // console.log(id);
    state.source = id;
  },
  setMode(state,str){
    state.mode = str;
  },
  spliceSong(state,arrSong){    //替换掉song数组
    state.song = arrSong;
  }
};

export default mutations;
