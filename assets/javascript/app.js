$(document).ready(function () {

    var GifTastic = function (images) {

        var queryURL = "http://api.giphy.com/v1/gifs/search?q=ryan+gosling&api_key=5aHUfq0wQEZJreua4O5K7J1qBL7S8vzj&limit=10";

        this.play = init;

        function init() {
            createButtons();
            addBtn('unicorn');
            search();
        }

        function createButtons() {
            $.each(images, function (i, val) {
                addBtn(val);
            });
        }

        function addBtn(val) {
            var btn = $('<button>').text(val);
            btn.addClass('btn btn-danger px-3 mx-2');
            $('.d-flex').append(btn);
        }

        function search(str) {
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response) {
                console.log(response);
                $.each(response.data, buildImg);
            });
        }

        function buildImg(i, val) {
            console.log(val.images.original_still);
            var still_obj = val.images.original_still;
            var ani_obj = val.images.original;

            var col = $('<div>').addClass('col-md-4 text-center');
            var img = $('<img>').attr({ 'src': still_obj.url, 'data-state': "still"});
            img.addClass('gif img-fluid p-2');
            img.on("click", aniToggleBtn);
            col.append(img);
            $('.row').append(col);


            // <img src="https://media3.giphy.com/media/W6LbnBigDe4ZG/200_s.gif" data-still="https://media3.giphy.com/media/W6LbnBigDe4ZG/200_s.gif" data-animate="https://media3.giphy.com/media/W6LbnBigDe4ZG/200.gif" data-state="still" class="gif">
        }

        function aniToggleBtn() {
            console.log($(this).attr('data-state'));
            var state = $(this).attr('data-state');
            
        }

        // 
        // 
    }

    var img_arr = ['dog', 'cat', 'parrot'];
    var myGif = new GifTastic(img_arr);
    myGif.play();

})