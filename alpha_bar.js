var initProgress = function(callback){
    new scale("#progress-button","#all-progress","#current-progress", callback);
};

scale = function(btn, bar, cur_bar, callback){
    this.btn = $(btn);
    this.bar = $(bar);
    this.cur_bar = $(cur_bar);
    this.btnWidth = this.btn[0].offsetWidth;
    this.minLength = this.bar.offset().left;
    this.maxLength = this.minLength + this.bar.width();
    this.init();
    this.onProgressChanged = callback;
};

scale.prototype = {
    init : function(){
        var f = this;
        var moving = false;
        f.btn.mousedown(function (e) {
            moving = true;
        });
        $(document).mousemove(function (e) {
            if(moving){
                var moveX = e.originalEvent.x;
                var percent;
                if(moveX < f.minLength){
                    moveX = f.minLength;
                }else if(moveX > f.maxLength){
                    moveX = f.maxLength;
                }




                percent = ((moveX - f.minLength)*100)/(f.maxLength - f.minLength);
                f.btn.html(parseInt(percent));
                f.cur_bar.css("width",(percent+(f.btnWidth/2*100/(f.maxLength - f.minLength)))+"%");
                f.onProgressChanged(percent);
            }
        });
        $(document).mouseup(function (e) {
            moving = false;
        });
        return f;
    }
};