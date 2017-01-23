angular.module('BackgroundTab', [])
.factory('BackgroundTab', function(){
    function openNewBackgroundTab(tab){
        var a = document.createElement("a");
        a.href = tab;
        var evt = document.createEvent("MouseEvents");
        //the tenth parameter of initMouseEvent sets ctrl key
        evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0,
                                true, false, false, false, 0, null);
        a.dispatchEvent(evt);
    }

    function openTab(tab){
        var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
        console.log('is chrome', is_chrome);
        if(!is_chrome){
            var url = tab;
            var win = window.open(url, '_blank');
        }else{
            openNewBackgroundTab(tab);
        }        
    }
    
    return {open : openTab};
});