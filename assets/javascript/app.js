$(document).ready(function () {

    var GifTastic = function (options) {

        var selImg;
        var selNum;
        var topics = [];

        this.play = init;

        function init() {
            $("#searchBtn").on("click", searchBtnPress);
            $('#searchInput').keypress(function (e) {
                var key = e.which;
                if (key == 13) {
                    $('#searchBtn').click();
                    return false;
                }
            });
            $("#removeBtn").on("click", clearBtnPress);
            $("#stopBtn").on("click", stopBtnPress);
            //
            createButtons();
        }

        /* ===================  BUTTONS ===================== */
        function searchBtnPress(e) {
            e.preventDefault();
            var val = $('#searchInput').val();
            $('#searchInput').val('');
            addBtn(val, true);
        }

        function clearBtnPress(e) {
            e.preventDefault();
            topics = [];
            clearImages();
            $('.d-flex').empty();
        }

        function stopBtnPress(e) {
            e.preventDefault();
            if (selImg) selImg.click();
        }

        function createButtons() {
            $.each(options.topics, function (i, val) {
                var trigger = (i === 0);
                addBtn(val, trigger);
            });
        }

        function addBtn(val, trigger) {
            if (!notDuplicate(val)) {
                clearImages();
                $('.title').text("You've already selected " + titleStr(val));
                return;
            }
            topics.push(titleStr(val));
            var btn = $('<button>').text(titleStr(val));
            btn.addClass('btn btn-danger px-3 m-2');
            btn.on("click", newSearch);
            $('.d-flex').append(btn);
            if (trigger) btn.click();
        }

        /* =================== SEARCH ===================== */
        function newSearch() {
            clearImages();
            search($(this).text());
        }

        function search(str) {
            str = verifyStr(str);
            //
            $.ajax({
                url: "https://api.giphy.com/v1/gifs/search?q=" + str.toLowerCase() + "&api_key=5aHUfq0wQEZJreua4O5K7J1qBL7S8vzj&limit=" + options.limit,
                method: "GET"
            }).then(function (response) {
                // console.log(response);
                if (response.data.length > 0) {
                    $('.title').text(titleStr(str));
                    $.each(response.data, buildImg);
                } else {
                    $('.title').text('Sorry, your search returned 0 results.');
                    $(".d-flex button:last-child").remove()
                }
            });
        }

        /* ===================  IMAGES & INTERACTION ===================== */
        function buildImg(i, val) {
            var still_obj = val.images.fixed_height_still;
            var __w = still_obj.width;
            var __h = still_obj.height;

            var col = $('<div>').addClass('col-md-4 text-center');
            var img = $('<img>').attr({ id: "img" + i, 'src': still_obj.url, 'data-state': "still", width: __w, height: __h });
            img.addClass('gif img-fluid p-2');
            img.on("click", aniToggleBtn);
            col.append(img);
            col.append('<p>rating: ' + val.rating + '</p>');
            $('.row').append(col);

        }

        function aniToggleBtn() {
            var url;
            if (selImg !== undefined && selImg.attr('data-state') != 'still') {
                url = selImg.attr('src').split('.');
                url[2] = url[2].replace('_d', "_s");
                selImg.attr({ src: url.join('.'), 'data-state': 'still' });
                selImg.removeClass('selected');
                selImg = undefined;
                if (selNum === $(this).attr('id')) return;
            }
            selImg = $(this);
            selNum = $(this).attr('id');
            var state = selImg.attr('data-state');
            url = selImg.attr('src').split('.');
            if (state === "still") {
                url[2] = url[2].replace('_s', "_d");
                selImg.attr({ src: url.join('.'), 'data-state': 'animate' });
                selImg.addClass('selected');
            }
        }

        function clearImages() {
            $('.title').text('');
            $('.row').empty();
        }

        /* =================== STRING FORMATTING ===================== */
        function notDuplicate(str) {
            var isDup = true;
            $.each(topics, function (i, val) {
                if (titleStr(str) === val) {
                    isDup = false;
                    return false;
                }
            });
            return isDup;
        }

        function verifyStr(str) {
            var arr = str.split(" ");
            var temp_arr = [];
            $.each(arr, function (i, val) {
                if (val.length > 0) temp_arr.push(val);
            });
            return temp_arr.join("+");
        }

        function titleStr(str) {
            var arr;
            str = verifyStr(str);
            if (str.indexOf('+') > -1) {
                arr = str.split('+');
            } else {
                str = str.substr(0, 1).toUpperCase() + str.substr(1);

                return str;
            }
            var temp_arr = [];
            $.each(arr, function (i, val) {
                temp_arr.push(val.substr(0, 1).toUpperCase() + val.substr(1));
            });
            return temp_arr.join(" ");
        }

        // 
        // 
    }

    var list = ['Neil Patrick Harris', 'Amy Poehler', 'Samuel L Jackson', 'Tina Fey', 'Terry Crews'];
    var myGif = new GifTastic({ topics: list, limit: 10 });
    myGif.play();

});