const cast = $('#movie-detail-cast');
const cast_left = $('#cast_arrow_left');
const cast_right = $('#cast_arrow_right');
const defaultCastUrl = '/public/assets/images/details/default-cast-image.png'

let castinfo;
let cast_showCount = 6;
let cast_count = 0;
$.ajax({
    type: 'post',
    url: '/details/casts',
    contentType: 'application/json',
    data: JSON.stringify({
        id: movieId
    })
}).then(function (responMessage) {
    if (responMessage.success) {
        cast_left.css('visibility', 'hidden');
        cast_right.css('visibility', 'hidden');
        castinfo = responMessage.castInfo;
        cast_count = 0;
        let link = "";
        if (castinfo.length <= cast_showCount) {
            for (let i = 0; i < castinfo.length; ++i) {
                if (castinfo[i].img.length == 0) castinfo[i].img = defaultCastUrl;

                link += "<li class=\"cast\">" + "<div class=\"cast_img\">" + 
                    "<img src=\"" + castinfo[i].img + "\" alt=\"Cast Image\"></div><h3>" + castinfo[i].name + "</h3><h4>" + castinfo[i].asCharacter + "</h4></li>";

            }
        } else {
            for (let i = 0; i < cast_showCount; ++i) {
                if (castinfo[i].img.length == 0) castinfo[i].img = defaultCastUrl;

                link += "<li class=\"cast\">" + "<div class=\"cast_img\">" + 
                    "<img src=\"" + castinfo[i].img + "\" alt=\"Cast Image\"></div><h3>" + castinfo[i].name + "</h3><h4>" + castinfo[i].asCharacter + "</h4></li>";

            }
            cast_right.css('visibility', 'visible');
        }
        cast.append(link);
    } else {
        cast_left.css('visibility', 'hidden');
        cast_right.css('visibility', 'hidden');
    }

});
cast_right.click(function () {
    ++cast_count;
    cast_left.css('visibility', 'visible');
    let link = "";
    $('#movie-detail-cast  li').remove();
    const remainLength = castinfo.length - cast_count * cast_showCount;
    const beginIndex = cast_count * cast_showCount;
    if (remainLength <= cast_showCount) {
        cast_right.css('visibility', 'hidden');
        for (let i = beginIndex; i < castinfo.length; ++i) {
            if (castinfo[i].img.length == 0) castinfo[i].img = defaultCastUrl;

            link += "<li class=\"cast\">" + "<div class=\"cast_img\">" + 
                "<img src=\"" + castinfo[i].img + "\" alt=\"Cast Image\"></div><h3>" + castinfo[i].name + "</h3><h4>" + castinfo[i].asCharacter + "</h4></li>";

        }
    } else {
        for (let i = beginIndex; i < beginIndex + cast_showCount; ++i) {
            if (castinfo[i].img.length == 0) castinfo[i].img = defaultCastUrl;

            link += "<li class=\"cast\">" + "<div class=\"cast_img\">" + 
                "<img src=\"" + castinfo[i].img + "\" alt=\"Cast Image\"></div><h3>" + castinfo[i].name + "</h3><h4>" + castinfo[i].asCharacter + "</h4></li>";

        }
    }
    cast.append(link);
});
cast_left.click(function () {
    --cast_count;
    cast_right.css('visibility', 'visible');
    let link = "";
    $('#movie-detail-cast  li').remove();
    const beginIndex = cast_count * cast_showCount;
    if (cast_count == 0) {
        cast_left.css('visibility', 'hidden');
    }
    for (let i = beginIndex; i < beginIndex + cast_showCount; ++i) {
        if (castinfo[i].img.length == 0) castinfo[i].img = defaultCastUrl;

        link += "<li class=\"cast\">" + "<div class=\"cast_img\">" + 
            "<img src=\"" + castinfo[i].img + "\" alt=\"Cast Image\"></div><h3>" + castinfo[i].name + "</h3><h4>" + castinfo[i].asCharacter + "</h4></li>";

    }
    cast.append(link);
});
