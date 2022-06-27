let movieFilter = {language: [], genre: []};
const resetFilterMovies = (reload) => {
    console.log("resetChala!!!!");
    movieFilter = {language: [], genre: []};
    document.getElementById("resetBtn").classList.add("hidden");
    document.getElementById("applyBtn").classList.add("hidden");
    if (reload) {
        window.location = "/movies";
    }
};
const applyFilters = () => {
    if (movieFilter) {
        const form = document.createElement("form");
        const filters = document.createElement("input");
        form.method = "POST";
        form.action = "/movies";

        filters.value = JSON.stringify(movieFilter);
        filters.type = "hidden";
        filters.name = "filters";
        form.appendChild(filters);

        document.body.appendChild(form);

        form.submit();
    }
};
const handelDefaultFilters = () => {
    if (movieFilter) {
        movieFilter.language.forEach((lan) => {
            console.log(`lang-${lan}`);
            let doc = document.getElementById(`lang-${lan}`);
            console.log(doc);

            if (doc) {
                doc.setAttribute("checked", true);
            }
        });
        movieFilter.genre.forEach((gen) => {
            let doc = document.getElementById(`genre-${gen}`);
            if (doc) {
                doc.setAttribute("checked", true);
            }
        });
    }
};

const filterMovies = (key, value) => {
    key = key.toLowerCase();
    let resetBtn = document.getElementById("resetBtn");
    let applyBtn = document.getElementById("applyBtn");
    if (resetBtn) {
        resetBtn.classList.remove("hidden");
    }
    if (applyBtn) {
        applyBtn.classList.remove("hidden");
    }
    if (!movieFilter) {
        movieFilter = {language: [], genre: []};
        movieFilter[key].push(value);
    } else {
        if (!movieFilter[key].includes(value)) {
            movieFilter[key].push(value);
        } else {
            movieFilter[key] = movieFilter[key].filter(function (item, index, arr) {
                return item != value;
            });
        }
    }
    console.log({...movieFilter});
};
