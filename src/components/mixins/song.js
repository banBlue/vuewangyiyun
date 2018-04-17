export const mixinsSong = {
  watch:{
    song() {
      if(this.song.length != 0) {
        this.$refs.msilder.style.paddingBottom = 40 + "px";
        this.$nextTick(function() {
          if(this.Bscroll){
            this.Bscroll.refresh()
          }
        })
      }else {
        this.$refs.msilder.style.paddingBottom = 0 + "px";
        this.$nextTick(function() {
          if(this.Bscroll){
            this.Bscroll.refresh()
          }
        })
      }
    }
  },
  methods:{
    BottomPd(){
      if(this.song.length>0)this.$refs.msilder.style.paddingBottom = 40 + "px";
    }
  }
}
