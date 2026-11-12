
/* =========================================
   1. GET STORY ID FROM URL
========================================= */

const params = new URLSearchParams(window.location.search);

const storyId = Number(params.get("id"));


/* =========================================
   2. FIND SELECTED STORY
========================================= */

const selectedStory = stories.find(
    story => story.id === storyId
);


/* =========================================
   3. GET HTML ELEMENTS
========================================= */

const titleElement =
    document.getElementById("story-title");

const subtitleElement =
    document.getElementById("story-subtitle");

const authorElement =
    document.getElementById("story-author");

const publishedElement =
    document.getElementById("story-published");

const modifiedElement =
    document.getElementById("story-modified");

const commentsElement =
    document.getElementById("story-comments");

const bodyElement =
    document.getElementById("story-body");

const noteElement =
    document.getElementById("story-note");

const chapterList =
    document.getElementById("chapter-list");


/* =========================================
   4. DISPLAY STORY INFORMATION
========================================= */

function displayStory(story) {

    // Page title
    document.title = story.title + " - Story Reading";

    // Story information
    titleElement.textContent = story.title;
    subtitleElement.textContent = story.subtitle;

    authorElement.textContent = story.author;
    publishedElement.textContent = story.published;
    modifiedElement.textContent = story.modified;
    commentsElement.textContent = story.comments;

    // Story note
    noteElement.textContent = story.note;


    // Story paragraphs
    bodyElement.replaceChildren();

    story.paragraphs.forEach((paragraph, index) => {

        const p = document.createElement("p");

        p.textContent = paragraph;

        p.id = `chapter-${index + 1}`;

        bodyElement.appendChild(p);

    });


    // Chapter navigation
    chapterList.replaceChildren();

    story.chapters.forEach((chapter, index) => {

        const link = document.createElement("a");

        link.textContent = chapter;

        // Link to the corresponding paragraph.
        // Chapters without a matching paragraph
        // return to the beginning of the story.
        const targetIndex = Math.min(
            index,
            story.paragraphs.length - 1
        );

        link.href = `#chapter-${targetIndex + 1}`;

        chapterList.appendChild(link);

    });

}


/* =========================================
   5. HANDLE MISSING STORY
========================================= */

if (selectedStory) {

    displayStory(selectedStory);

} else {

    titleElement.textContent = "STORY NOT FOUND";

    subtitleElement.textContent =
        "The requested story could not be found.";

    bodyElement.textContent =
        "Please return to the Story List and select another story.";

    document.title = "Story Not Found";

}


/* =========================================
   6. SEARCH STORIES
========================================= */

const searchInput =
    document.getElementById("search-input");

searchInput.addEventListener("keydown", event => {

    if (event.key === "Enter") {

        const keyword = searchInput.value
            .trim()
            .toLowerCase();

        const result = stories.find(story =>
            story.title.toLowerCase().includes(keyword)
        );

        if (result) {

            window.location.href =
                `reading.html?id=${result.id}`;

        } else {

            alert("Story not found!");

        }

    }

});
