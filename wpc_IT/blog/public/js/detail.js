/**
 * Created by sony on 2017/3/17.
 */

(function() {
    /*
     *
     * detail
     *
     * */
    var comment = document.getElementsByClassName('comment')[0];
    var area = document.getElementsByClassName('area')[0];
    var publish = document.getElementsByClassName('publish')[0];
    comment.onclick = function() {
        area.style.display = "block";
    }
    publish.onclick = function() {
        area.style.display = "none";
    }
})()
