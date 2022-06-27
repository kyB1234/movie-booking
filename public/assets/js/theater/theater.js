const theater_detail = $('#theater-detail');
const calendar = $('#calendar_list');
const calendar_arrow_left = $('#calendar_arrow_left');
const calendar_arrow_right = $('#calendar_arrow_right');

/**
 * general functions
 */
// short for week and month
const weeks = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const month_day = [['Jan', 31], ['Feb', 28], ['Mar', 31], ['Apr', 30], ['May', 31], ['Jun', 30], ['Jul', 31], ['Aug', 31], ['Sep', 30], ['Oct', 31], ['Nov', 30], ['Dec', 31]]

// leap year
function isleapyear(year) {
    year = parseInt(year);
    if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
        return true;
    }
    return false;
}

// Create Date
function getThreeWeek() {
    let threeWeek = [];
    const todayDate = new Date();
    let curYear = todayDate.getFullYear();
    let curMonth = todayDate.getMonth();
    let curDay = todayDate.getDate();
    let curWeek = todayDate.getDay();
    month_day[1][1] = isleapyear(curYear) ? 29 : 28;
    for (let i = 0; i < 21; ++i) {
        threeWeek[i] = {
            week: 'Today',
            month: curMonth,
            day: curDay,
            year: curYear,
        }
    }
    for (let i = 1; i < 21; ++i) {
        curDay += 1;
        curWeek = (curWeek + 1) % 7;
        threeWeek[i].week = weeks[curWeek];
        if (curDay > month_day[curMonth][1]) {

            if (curMonth == 11) {

                curMonth = 0;
                curYear += 1;
            }
            curDay = 1;
        }
        threeWeek[i].day = curDay;
        threeWeek[i].month = curMonth;
        threeWeek[i].year = curYear;
    }
    return threeWeek;
}

// Generate 7 day
function addCalendar(threeWeek, position) {
    let beginIndex = position * 7;
    let link = "";
    for (let i = beginIndex; i < beginIndex + 7; ++i) {
        link += "<li class=\"theater-calendar-date\" select-date=" +
            threeWeek[i].year + "-" + (threeWeek[i].month + 1) + "-" + threeWeek[i].day + ">" + "<button class=\"theater-calendar-date_btn\">" +
            "<strong class=\"theater-calendar-date_btn_weekday\">" + threeWeek[i].week + "</strong>" +
            "<span class=\"theater-calendar-date_btn_month\">" + month_day[threeWeek[i].month][0] + "</span>" +
            "<span class=\"theater-calendar-date_btn_day\">" + threeWeek[i].day + "</span></button></li>"
    }
    $('#calendar li').remove();
    calendar.append(link);
}

// Convert date to showtime
function getShowtime(date) {
    date = new Date(date);
    let min = date.getMinutes();
    let hr = date.getHours();
    return hr + " : " + min
}

// Format 00:00:00 to front page time
function frontTime(showTimeId) {

    const sti = new Date(showTimeId);
    let stiString = sti.toLocaleTimeString();

    if (stiString.length > 10)
        return stiString.substring(0, 5) + " " + stiString.substring(9,);
    else{
        stiString = "0" + stiString;
        return stiString.substring(0, 5) + " " + stiString.substring(9,);
    }

    return time.substring(0, 5);
}

// Get theater with selected movie and date
function getTheater(id, selectDate) {
    $.ajax({
        type: 'post',
        url: '/theater/screenInfo',
        contentType: 'application/json',
        data: JSON.stringify({
            id: id,
            selectDate: selectDate
        })
    }).then((responMessage) => {
        if (responMessage.success) {
            $('.theater-detail-showtime').remove();
            $('.theater-error').css("visibility", "hidden");
            let screenInfo = responMessage.screenInfo;
            for (let i = 0; i < screenInfo.length; ++i) {
                let screenId = screenInfo[i].screenId;
                $.ajax({
                    type: 'post',
                    url: '/theater/theaterInfo',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        screenId: screenId
                    })
                }).then((responMessage) => {
                    let theaterInfo = responMessage.theaterObj.theaterObj;
                    link = "";
                    link += "<div class=\"theater-detail-showtime\">" + "<div class=\"theater-detail-showtime_header\">" +

                    "<div class=\"theater-detail-showtime_header_name\"><h1>" + theaterInfo.theatreName + "</h1></div>" + 
                    "<div class=\"theater-detail-showtime_header_address\"><p>" + theaterInfo.location + "</p></div></div>" + 
                    "<div class=\"theater-detail-showtime_variants\">" + "<div class=\"theater-detail-showtime_variants_format\">" +
                    "Standard</div>" + "<div class=\"theater-detail-showtime_variants_list_wrapper\">" + 
                    "<ul class=\"theater-detail-showtime_variants_list\">";

                    const showtime = screenInfo[i].showTimes;
                    for (let j = 0; j < showtime.length; ++j) {
                        link += "<li class=\"theater-detail-showtime_variants_time\">" +
                            "<form method=\"post\" action=\"/movies/" + movieId + "/book/seat\">" +
                            "<input type=\"text\" name=\"movieId\" value=\"" + movieId + "\" hidden>" +
                            "<input type=\"text\" name=\"theatreId\" value=\"" + theaterInfo.theatreId + "\" hidden>" +
                            "<input type=\"text\" name=\"screenId\" value=\"" + screenId + "\" hidden/>" +
                            "<input type=\"text\" name=\"showTimeId\" value=\"" + showtime[j].showTimeId + "\" hidden >" +
                            "<button type=\"submit\" class=\"theater-detail-showtime_variants_time_btn\">" +
                            frontTime(showtime[j].showTimeId) + "</button></form></li>";
                    }
                    link += "</ul></div></div></div>";
                    theater_detail.append(link);
                });
            }
        } else {
            console.log('error');
            $('.theater-detail-showtime').remove();
            $('.theater-error').css("visibility", "visible");
        }

    });
}

// click day
function dayClick() {
    const curSelected = $('#calendar li:eq(' + selectIndex + ')');
    curSelected.find(".theater-calendar-date_btn").removeClass("theater-calendar-date_select");
    curSelected.find(".theater-calendar-date_btn_weekday").removeClass("btn_select");
    curSelected.find(".theater-calendar-date_btn_month").removeClass("btn_select");
    curSelected.find(".theater-calendar-date_btn_day").removeClass("btn_select");
    $(this).find(".theater-calendar-date_btn").addClass("theater-calendar-date_select");
    $(this).find(".theater-calendar-date_btn_weekday").addClass("btn_select");
    $(this).find(".theater-calendar-date_btn_month").addClass("btn_select");
    $(this).find(".theater-calendar-date_btn_day").addClass("btn_select");
    selectIndex = $('#calendar_list li').index(this);
    let select_date = $('#calendar li:eq(' + selectIndex + ')').attr("select-date");
    getTheater(movieId, select_date);
}

/**
 * end general function
 */


/**
 * Generate front page
 */
// Position of calendar
let pos = 0;
// Index of selected day
let selectIndex = 0;
// init calender
const threeWeek = getThreeWeek();
addCalendar(threeWeek, pos);
calendar_arrow_left.css('visibility', 'hidden');
calendar_arrow_right.css('visibility', 'visible');
// Initialization selection today
$('#calendar_list li').eq(0).find(".theater-calendar-date_btn").addClass("theater-calendar-date_select");
$('#calendar_list li').eq(0).find(".theater-calendar-date_btn_weekday").addClass("btn_select");
$('#calendar_list li').eq(0).find(".theater-calendar-date_btn_month").addClass("btn_select");
$('#calendar_list li').eq(0).find(".theater-calendar-date_btn_day").addClass("btn_select");
$('#calendar_list li').click(dayClick);
getTheater(movieId, $('#calendar_list li').eq(0).attr("select-date"));
// Load next section of calendar
calendar_arrow_right.click(function () {
    ++pos;
    calendar_arrow_left.css('visibility', 'visible');
    if (pos == 2) calendar_arrow_right.css('visibility', 'hidden');
    addCalendar(threeWeek, pos);
    $('#calendar_list li').click(dayClick);
});
// Load forward section of calendar
calendar_arrow_left.click(function () {
    --pos
    calendar_arrow_right.css('visibility', 'visible');
    if (pos == 0) calendar_arrow_left.css('visibility', 'hidden');
    addCalendar(threeWeek, pos);
    $('#calendar_list li').click(dayClick);
});
/**
 * end generate front page
 */
