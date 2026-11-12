
/* =====================================
   1. GET SEARCH ELEMENTS
===================================== */

const searchWrappers = document.querySelectorAll(
    ".search-wrapper"
);


/* =====================================
   2. SEARCH FUNCTION
===================================== */

function searchStories(keyword) {

    const query = keyword.trim().toLowerCase();

    // Jangan mencari jika input kosong
    if (!query) {
        return [];
    }

    return stories.filter(story => {

        const searchableText = [
            story.title,
            story.subtitle,
            story.description,
            story.author,
            story.category
        ].join(" ").toLowerCase();

        return searchableText.includes(query);

    });

}


/* =====================================
   3. DISPLAY SEARCH RESULTS
===================================== */

function displaySearchResults(wrapper, results) {

    const resultContainer =
        wrapper.querySelector(".search-results");

    resultContainer.replaceChildren();

    if (results.length === 0) {

        const message = document.createElement("div");

        message.className = "no-results";
        message.textContent = "No stories found.";

        resultContainer.appendChild(message);

        resultContainer.classList.add("show");

        return;
    }


    results.forEach(story => {

        const link = document.createElement("a");

        link.className = "search-result-item";

        link.href = `reading.html?id=${story.id}`;


        // Story title
        const title = document.createElement("div");

        title.className = "result-title";
        title.textContent = story.title;


        // Story description
        const description = document.createElement("div");

        description.className = "result-description";
        description.textContent = story.description;


        // Add elements
        link.append(title, description);

        resultContainer.appendChild(link);

    });


    resultContainer.classList.add("show");

}


/* =====================================
   4. CLOSE SEARCH RESULTS
===================================== */

function closeSearchResults() {

    document.querySelectorAll(".search-results").forEach(result => {

        result.classList.remove("show");

    });

}


/* =====================================
   5. CONNECT BOTH SEARCH BARS
===================================== */

searchWrappers.forEach(wrapper => {

    const input = wrapper.querySelector(".search-input");

    const button = wrapper.querySelector(".search-button");

    const resultContainer =
        wrapper.querySelector(".search-results");


    // Live search while typing
    input.addEventListener("input", () => {

        const keyword = input.value;

        // Synchronize both search bars
        searchWrappers.forEach(otherWrapper => {

            const otherInput =
                otherWrapper.querySelector(".search-input");

            if (otherInput !== input) {
                otherInput.value = keyword;
            }

        });


        if (keyword.trim() === "") {

            resultContainer.replaceChildren();

            resultContainer.classList.remove("show");

            closeSearchResults();

            return;
        }


        const results = searchStories(keyword);

        displaySearchResults(wrapper, results);

        // Close the other search dropdown
        searchWrappers.forEach(otherWrapper => {

            if (otherWrapper !== wrapper) {

                otherWrapper.querySelector(
                    ".search-results"
                ).classList.remove("show");

            }

        });

    });


    // Search button
    button.addEventListener("click", () => {

        const results = searchStories(input.value);

        if (results.length > 0) {

            window.location.href =
                `reading.html?id=${results[0].id}`;

        } else if (input.value.trim() !== "") {

            displaySearchResults(wrapper, []);

        }

    });


    // Press Enter to open first result
    input.addEventListener("keydown", event => {

        if (event.key === "Enter") {

            event.preventDefault();

            const results = searchStories(input.value);

            if (results.length > 0) {

                window.location.href =
                    `reading.html?id=${results[0].id}`;

            } else if (input.value.trim() !== "") {

                displaySearchResults(wrapper, []);

            }

        }


        // Close dropdown with Escape
        if (event.key === "Escape") {

            closeSearchResults();

        }

    });

});


/* =====================================
   6. CLICK OUTSIDE TO CLOSE
===================================== */

document.addEventListener("click", event => {

    const clickedInsideSearch =
        event.target.closest(".search-wrapper");

    if (!clickedInsideSearch) {

        closeSearchResults();

    }

});
   