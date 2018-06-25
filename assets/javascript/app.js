$(document).ready(function () {

    var GifTastic = function (options) {

        var selImg;
        var selNum;
        var topics = [];
        var newLimit = options.limit;

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
            var val = $('#searchInput').val().trim();
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
            newLimit = options.limit;
            search($(this).text(), options.limit);
        }

        function seeMoreGifs(e) {
            e.preventDefault();
            console.log("see more gifs");
            var name = $('.title').text();
            clearImages();
            newLimit += options.limit;
            search(name, newLimit);
        }

        function search(str, limit) {
            str = verifyStr(str);
            console.log("search: "+str);
            //
            $.ajax({
                url: "https://api.giphy.com/v1/gifs/search?q=" + str.toLowerCase() + "&api_key=5aHUfq0wQEZJreua4O5K7J1qBL7S8vzj&limit=" + limit,
                method: "GET"
            }).then(function (response) {
                console.log(response);
                if (response.data.length > 0) {
                    $('.title').text(titleStr(str));
                    $.each(response.data, buildImg);
                    addMoreBtn();
                } else {
                    $('.title').text('Sorry, your search returned 0 results.');
                    $(".d-flex button:last-child").remove()
                }
            });
        }

        /* ===================  IMAGES & INTERACTION ===================== */
        function buildImg(i, val) {
            var still_obj = val.images.fixed_height_still;

            var card = $('<div>').addClass('card');

            card.append(`<img class="card-img-top gif" src="` + still_obj.url + `" id=img` + i + `" data-state="still" alt="` + val.title + `">
            <div class="card-body">
                <h5 class="card-title">`+ val.title + `</h5>
                <h6 class="card-subtitle mb-2 text-muted">Rating: `+ val.rating + `</h6>
                <p class="card-text">Click on the image to see it animate. <br><br>id: `+ val.id + ` <br>
                url: <a href="`+ val.bitly_url + `" target="_blank">` + val.bitly_url + `</a></p>
            </div>
            <div class="card-footer">
            <a class="btn btn-danger btn-block" href="`+ val.images.original.url + `" download="giphy.gif">Download</a>
            </div>`);
            card.find('img').on("click", aniToggleBtn);
            card.find('a').on("click", function (e) {
                e.preventDefault();
                var url = $(this).attr('href');
                window.open(url, '_blank');
            });
            $('.card-columns').append(card);
        }

        function addMoreBtn() {
            var card = $('<div>').addClass('card');
            card.append(`<div class="card-body"><button class="btn btn-outline-info btn-block">See More Gifs</button></div>`)
            card.find('button').on("click", seeMoreGifs);
            $('.card-columns').append(card);

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
            $('.card-columns').empty();
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