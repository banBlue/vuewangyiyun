const actions = {
  insertSong({commit, state}, obj) {   //新增歌曲进song
    let newAarr = state.song;
    let flag = false;
    newAarr.forEach(function (e) {
      if ((e.id != undefined) && e.id == obj.id) {
        flag = true;
      }
    });
    if(!flag){
      newAarr.push(Object.assign(obj,{flag: newAarr.length}));
      commit('SET_SONG', newAarr)
    }
    // console.log(state.song);
  }
};
export default actions;
