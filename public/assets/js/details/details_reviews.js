const review = $('#movie-detail-reviews');
const review_left = $('#review_arrow_left');
const review_right = $('#review_arrow_right');
let reviewinfo;
let review_showCount = 2;
let review_count = 0;
const defaultUserUrl = '/public/assets/images/details/noimguser.png'
$.ajax({
    type: 'post',
    url: '/details/reviews',
    contentType: 'application/json',
    data: JSON.stringify({
        id: movieId
    })
}).then(function (responMessage) {
    if (responMessage.success) {
        review_left.css('visibility', 'hidden');
        review_right.css('visibility', 'hidden');
        reviewinfo = responMessage.reviewInfo;
        review_count = 0;
        let review_link = "";
        if (reviewinfo.length <= review_showCount) {
            for (let i = 0; i < reviewinfo.length; ++i) {
                if (reviewinfo[i].userImgSrc.length == 0) reviewinfo[i].userImgSrc = defaultUserUrl;

                review_link += "<li class=\"review\">" + "<div class=\"review-wrapper\">" + "<div class=\"review-info\">" + 
                "<div class=\"reviewer-header\">" + "<div class=\"reviewer\">" + "<div class=\"reviewer-img\">" + 
                "<img src=\"" + reviewinfo[i].userImgSrc + "\" alt=\"User Image\"></div>" + "<div class=\"reviewer-name\"><h3>" + 
                reviewinfo[i].userName + "</h3></div></div></div>" + "<div class=\"review-content\"><p>" + 
                reviewinfo[i].userReview + "</p></div></div></div></li>";

            }
        } else {
            for (let i = 0; i < review_showCount; ++i) {
                if (reviewinfo[i].userImgSrc.length == 0) reviewinfo[i].userImgSrc = defaultUserUrl;

                review_link += "<li class=\"review\">" + "<div class=\"review-wrapper\">" + "<div class=\"review-info\">" + 
                "<div class=\"reviewer-header\">" + "<div class=\"reviewer\">" + "<div class=\"reviewer-img\">" + 
                "<img src=\"" + reviewinfo[i].userImgSrc + "\" alt=\"User Image\"></div>" + "<div class=\"reviewer-name\"><h3>" + 
                reviewinfo[i].userName + "</h3></div></div></div>" + "<div class=\"review-content\"><p>" + 
                reviewinfo[i].userReview + "</p></div></div></div></li>";

            }
            review_right.css('visibility', 'visible');
        }
        review.append(review_link);
    } else {
        review_left.css('visibility', 'hidden');
        review_right.css('visibility', 'hidden');
    }
});

review_right.click(function () {
    ++review_count;
    review_left.css('visibility', 'visible');
    let review_link = "";
    $('#movie-detail-reviews li').remove();
    const remainLength = reviewinfo.length - review_count * review_showCount;
    const beginIndex = review_count * review_showCount;
    if (remainLength <= review_showCount) {
        review_right.css('visibility', 'hidden');
        for (let i = beginIndex; i < reviewinfo.length; ++i) {
            if (reviewinfo[i].userImgSrc.length == 0) reviewinfo[i].userImgSrc = defaultUserUrl;

            review_link += "<li class=\"review\">" + "<div class=\"review-wrapper\">" + "<div class=\"review-info\">" + 
            "<div class=\"reviewer-header\">" + "<div class=\"reviewer\">" + "<div class=\"reviewer-img\">" + 
            "<img src=\"" + reviewinfo[i].userImgSrc + "\" alt=\"User Image\"></div>" + "<div class=\"reviewer-name\"><h3>" + 
            reviewinfo[i].userName + "</h3></div></div></div>" + "<div class=\"review-content\"><p>" + 
            reviewinfo[i].userReview + "</p></div></div></div></li>";

        }
    } else {
        for (let i = beginIndex; i < review_showCount; ++i) {
            if (reviewinfo[i].userImgSrc.length == 0) reviewinfo[i].userImgSrc = defaultUserUrl;

            review_link += "<li class=\"review\">" + "<div class=\"review-wrapper\">" + "<div class=\"review-info\">" + 
            "<div class=\"reviewer-header\">" + "<div class=\"reviewer\">" + "<div class=\"reviewer-img\">" + 
            "<img src=\"" + reviewinfo[i].userImgSrc + "\" alt=\"User Image\"></div>" + "<div class=\"reviewer-name\"><h3>" + 
            reviewinfo[i].userName + "</h3></div></div></div>" + "<div class=\"review-content\"><p>" + 
            reviewinfo[i].userReview + "</p></div></div></div></li>";

        }
    }
    review.append(review_link);
});
review_left.click(function () {
    --review_count;
    review_right.css('visibility', 'visible');
    let review_link = "";
    $('#movie-detail-reviews  li').remove();
    const beginIndex = review_count * review_showCount;
    if (review_count == 0) {
        review_left.css('visibility', 'hidden');
    }
    for (let i = beginIndex; i < review_showCount; ++i) {
        if (reviewinfo[i].userImgSrc.length == 0) reviewinfo[i].userImgSrc = defaultUserUrl;

        review_link += "<li class=\"review\">" + "<div class=\"review-wrapper\">" + "<div class=\"review-info\">" + 
        "<div class=\"reviewer-header\">" + "<div class=\"reviewer\">" + "<div class=\"reviewer-img\">" + 
        "<img src=\"" + reviewinfo[i].userImgSrc + "\" alt=\"User Image\"></div>" + "<div class=\"reviewer-name\"><h3>" + 
        reviewinfo[i].userName + "</h3></div></div></div>" + "<div class=\"review-content\"><p>" + 
        reviewinfo[i].userReview + "</p></div></div></div></li>";

    }
    review.append(review_link);
});
