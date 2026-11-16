function searchStory(inputId) {

    // Mengambil input dari search bar
    const keyword = document.getElementById(inputId).value.trim().toLowerCase();

    // Mencari cerita berdasarkan judul
    const result = stories.find(story => story.title.toLowerCase() === keyword);

    // Jika cerita ditemukan
    if (result) {

        window.location.href = "./pages/reading.html?id=" + result.id;

    } else {

        alert("Story not found!");

    }

}
