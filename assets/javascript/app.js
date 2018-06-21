$(document).ready(function () {

    var GifTastic = function (images) {

        this.play = init;

        function init() {
            createButtons();
            addBtn('unicorn');
            search("Ryan Gosling");
        }

        function createButtons() {
            $.each(images, function (i, val) {
                addBtn(val);
            });
        }

        function addBtn(val) {
            var btn = $('<button>').text(val);
            btn.addClass('btn btn-danger px-3 mx-2');
            btn.on("click", newSearch);
            $('.d-flex').append(btn);
        }

        function newSearch(){
            clearImages();
            search($(this).text());
        }

        function search(str) {
            str = str.replace(" ", "+");
            $.ajax({
                url: "http://api.giphy.com/v1/gifs/search?q="+str.toLowerCase()+"&api_key=5aHUfq0wQEZJreua4O5K7J1qBL7S8vzj&limit=10",
                method: "GET"
            }).then(function (response) {
                console.log(response);
                $.each(response.data, buildImg);
            });
        }

        function buildImg(i, val) {
            var still_obj = val.images.fixed_height_still;

            var col = $('<div>').addClass('col-md-4 text-center');
            var img = $('<img>').attr({ 'src': still_obj.url, 'data-state': "still" });
            img.addClass('gif img-fluid p-2');
            img.on("click", aniToggleBtn);
            col.append(img);
            $('.row').append(col);

        }

        function aniToggleBtn() {
            var img = $(this);
            var state = img.attr('data-state');
            var url = img.attr('src').split('.');
            if (state === "still") {
                url[2] = url[2].replace('_s', "_d");
                img.attr({ src: url.join('.'), 'data-state': 'animate' });
            } else {
                url[2] = url[2].replace('_d', "_s");
                img.attr({ src: url.join('.'), 'data-state': 'still' });
            }
        }

        function clearImages(){
            $('.row').empty();
        }

        // 
        // 
    }

    var list = ['dog', 'cat', 'parrot'];
    var myGif = new GifTastic({list_arr:list, });
    myGif.play();

})