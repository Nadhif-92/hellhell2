
/* =========================================
   1. STORY DATA
========================================= */

/*const stories = [
    {
        id: 1,
        title: "Story Reading 1",
        description: "An exciting story about a magical forest and its mysterious creatures.",
        status: "Available",
        category: "Fantasy"
    },
    {
        id: 2,
        title: "Story Reading 2",
        description: "A young explorer discovers a hidden island full of secrets.",
        status: "Available",
        category: "Adventure"
    },
    {
        id: 3,
        title: "Story Reading 3",
        description: "A detective investigates a mysterious event in a quiet town.",
        status: "Draft",
        category: "Mystery"
    },
    {
        id: 4,
        title: "Story Reading 4",
        description: "Two friends embark on a journey through an enchanted kingdom.",
        status: "Available",
        category: "Fantasy"
    },
    {
        id: 5,
        title: "Story Reading 5",
        description: "A lost treasure leads a group of explorers into an ancient cave.",
        status: "Available",
        category: "Adventure"
    },
    {
        id: 6,
        title: "Story Reading 6",
        description: "A strange letter arrives at the door of an old library.",
        status: "Draft",
        category: "Mystery"
    },
    {
        id: 7,
        title: "Story Reading 7",
        description: "A little dragon learns how to make friends in a new village.",
        status: "Available",
        category: "Fantasy"
    },
    {
        id: 8,
        title: "Story Reading 8",
        description: "An unexpected journey begins after finding an old map.",
        status: "Available",
        category: "Adventure"
    },
    {
        id: 9,
        title: "Story Reading 9",
        description: "A hidden message reveals the truth behind an old mystery.",
        status: "Available",
        category: "Mystery"
    },
    {
        id: 10,
        title: "Story Reading 10",
        description: "A magical garden changes every time the moon appears.",
        status: "Available",
        category: "Fantasy"
    },
    {
        id: 11,
        title: "Story Reading 11",
        description: "A traveler crosses mountains to discover a forgotten city.",
        status: "Draft",
        category: "Adventure"
    },
    {
        id: 12,
        title: "Story Reading 12",
        description: "A missing painting becomes the center of a strange investigation.",
        status: "Available",
        category: "Mystery"
    },
    {
        id: 13,
        title: "Story Reading 13",
        description: "A young wizard discovers a new power hidden inside an old book.",
        status: "Available",
        category: "Fantasy"
    },
    {
        id: 14,
        title: "Story Reading 14",
        description: "A crew sails across the ocean in search of a distant island.",
        status: "Available",
        category: "Adventure"
    },
    {
        id: 15,
        title: "Story Reading 15",
        description: "Footprints in the snow lead to an unexpected discovery.",
        status: "Draft",
        category: "Mystery"
    }
];
*/

/* =========================================
   2. SETTINGS & ELEMENTS
========================================= */

const itemsPerPage = 10;

let currentPage = 1;

const includedCategories = new Set();
const excludedCategories = new Set();

const storyList = document.getElementById("story-list");
const pagination = document.getElementById("pagination");

const includeFilters = document.getElementById("include-filters");
const excludeFilters = document.getElementById("exclude-filters");

const resetButton = document.getElementById("reset-filters");

const categories = [
    ...new Set(stories.map(story => story.category))
];


/* =========================================
   3. DISPLAY STORIES
========================================= */

function displayStories(data) {
    storyList.replaceChildren();

    if (data.length === 0) {
        const message = document.createElement("p");

        message.className = "empty-message";
        message.textContent = "No stories found.";

        storyList.appendChild(message);
        return;
    }

    data.forEach(story => {
        const article = document.createElement("article");
        article.className = "story";

        // Story title
        const title = document.createElement("h2");
        title.className = "story-title";

        const titleLink = document.createElement("a");
        titleLink.href = `reading.html?id=${story.id}`;
        titleLink.textContent = story.title;

        title.appendChild(titleLink);

        // Description row
        const descriptionRow = document.createElement("div");
        descriptionRow.className = "story-description";

        const description = document.createElement("span");
        description.className = "description-text";

        description.textContent = "content description: " + story.description;
        
        // MORE Button
        const more = document.createElement("a");
        more.className = "more";
        more.href = `reading.html?id=${story.id}`;
        more.textContent = "more";

        // Story status
        const status = document.createElement("p");
        status.className = "story-status";

        status.textContent = "status: " + story.status.toLowerCase();

        // Assemble the elements
        descriptionRow.append(description, more);

        article.append(
            title,
            descriptionRow,
            status
        );

        storyList.appendChild(article);
    });
}


/* =========================================
   4. INCLUDE / EXCLUDE FILTERS
========================================= */

function createFilterOptions(container, selectedSet, type) {
    container.replaceChildren();

    categories.forEach(category => {
        const label = document.createElement("label");
        label.className = "filter-option";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = category;
        checkbox.checked = selectedSet.has(category);

        const text = document.createElement("span");
        text.textContent = category;

        checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
                selectedSet.add(category);

                // Remove the same category from
                // the opposite filter.
                const oppositeSet =
                    type === "include"
                        ? excludedCategories
                        : includedCategories;

                oppositeSet.delete(category);

                renderFilters();
            } else {
                selectedSet.delete(category);
            }

            currentPage = 1;
            renderPage();
        });

        label.append(checkbox, text);
        container.appendChild(label);
    });
}

function renderFilters() {
    createFilterOptions(
        includeFilters,
        includedCategories,
        "include"
    );

    createFilterOptions(
        excludeFilters,
        excludedCategories,
        "exclude"
    );
}


/* =========================================
   5. FILTER STORIES
========================================= */

function getFilteredStories() {
    return stories.filter(story => {
        // If INCLUDE is selected, only show
        // stories from included categories.
        const matchesInclude =
            includedCategories.size === 0 ||
            includedCategories.has(story.category);

        // Exclude selected categories.
        const matchesExclude =
            !excludedCategories.has(story.category);

        return matchesInclude && matchesExclude;
    });
}


/* =========================================
   6. PAGINATION
========================================= */

function createPageButton(label, page, options = {}) {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "page-button";
    button.textContent = label;

    button.disabled = Boolean(options.disabled);

    if (options.active) {
        button.classList.add("active");
        button.setAttribute("aria-current", "page");
    }

    button.addEventListener("click", () => {
        currentPage = page;
        renderPage();
    });

    pagination.appendChild(button);
}

function renderPagination(totalPages) {
    pagination.replaceChildren();

    createPageButton(
        "<",
        Math.max(1, currentPage - 1),
        { disabled: currentPage === 1 }
    );

    for (let page = 1; page <= totalPages; page++) {
        createPageButton(
            String(page),
            page,
            { active: page === currentPage }
        );
    }

    createPageButton(
        ">",
        Math.min(totalPages, currentPage + 1),
        { disabled: currentPage === totalPages }
    );
}


/* =========================================
   7. RENDER CURRENT PAGE
========================================= */

function renderPage() {
    const filteredStories = getFilteredStories();

    const totalPages = Math.max(
        1,
        Math.ceil(filteredStories.length / itemsPerPage)
    );

    // Keep the current page within valid limits.
    currentPage = Math.min(currentPage, totalPages);

    const startIndex = (currentPage - 1) * itemsPerPage;

    const pageStories = filteredStories.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    displayStories(pageStories);
    renderPagination(totalPages);
}


/* =========================================
   8. RESET FILTERS
========================================= */

resetButton.addEventListener("click", () => {
    includedCategories.clear();
    excludedCategories.clear();

    currentPage = 1;

    renderFilters();
    renderPage();
});


/* =========================================
   9. INITIALIZE WEBSITE
========================================= */

renderFilters();
renderPage();
