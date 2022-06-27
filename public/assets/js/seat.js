let errorMsg = ''
if (!movieId || !movieName || !movieDate || !theatreId || !theatreName || !showTimeId || !price || !seatInfo) {
    errorMsg = 'Something has gone wrong please return to home page';
    // What to do ??
}

const screenJSON = JSON.parse(seatInfo)
console.log(screenJSON);
const layout = screenJSON.layout;
const seats = screenJSON.availability;
let seatList = [];

const continueButton = document.getElementById('continueButton');
continueButton.disabled = true;

function addSeats() {
    const seatNos = Object.keys(seats);

    let seatNoIndex = 0;
    for (let row of layout) {

        let rowDiv = document.createElement("div");
        rowDiv.className = "row";
        for (let ele of row) {

            let seatDiv = document.createElement("div");

            if (ele) {
                seatDiv.className = "seat";
                seatDiv.id = seatNos[seatNoIndex];
                let seatNoDisplay = document.createTextNode(seatNos[seatNoIndex]);
                seatDiv.appendChild(seatNoDisplay);
                if (parseInt(seats[seatNos[seatNoIndex]])) {
                    seatDiv.classList.add("occupied");
                }
                seatNoIndex++;
            } else seatDiv.classList.add("hidden")
            rowDiv.appendChild(seatDiv);
        }
        document.getElementById('theatreContainer').appendChild(rowDiv);
    }
}

addSeats();

theatreContainer.addEventListener('click', (e) => {

    if ((e.target.classList.contains(('seat')) || e.target.classList.contains('seat-no')) && !e.target.classList.contains('occupied') && !e.target.classList.contains('hidden')) {
        e.target.classList.toggle('selected');
    }
    updateSelectedCount();
    updateButton();
});

function updateSelectedCount() {
    const selectedSeats = document.querySelectorAll('.row .seat.selected');

    let selectedSeatsList = [];
    for (let seat of selectedSeats) {
        selectedSeatsList.push(seat.id)
    }
    //console.log(selectedSeatsList)
    seatList = selectedSeatsList;
}

function updateButton() {
    if (!seatList.length) continueButton.disabled = true; else continueButton.disabled = false;
}

continueButton.addEventListener('click', e => {

    const summaryObj = {
        movieId: movieId,
        movieName: movieName,
        movieImage: movieImage,
        theatreId: theatreId,
        runtime: runtime,
        language: language,
        screenId: screenId,
        theatreName: theatreName,
        dateTime: movieDate,
        noOfSeats: seatList.length,
        seats: seatList,
        showTimeId: showTimeId,
        price: price
    }

    const form = document.createElement("form");
    const purchaseSummary = document.createElement("input");

    form.method = "POST";
    form.action = "/movies/" + movieId + "/book/seat/pay";

    purchaseSummary.value = JSON.stringify(summaryObj);
    purchaseSummary.type = 'hidden'
    purchaseSummary.name = "Purchase Summary";
    form.appendChild(purchaseSummary);

    document.body.appendChild(form);

    form.submit();
})
