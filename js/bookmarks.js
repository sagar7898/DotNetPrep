document.addEventListener("DOMContentLoaded", async () => {

    const bookmarks =
        JSON.parse(localStorage.getItem("bookmarks")) || [];

    const title =
        document.getElementById("bookmarkTitle");

    title.textContent =
        `⭐ Bookmarked Questions (${bookmarks.length})`;

    if (bookmarks.length === 0) {

        document.getElementById("questionContainer").innerHTML = `
            <div class="alert alert-info">
                No bookmarked questions found.
            </div>
        `;

        return;
    }

    const topicFiles = [
        "csharp.json",
        "aspnetcore.json",
        "aspnetmvc.json",
        "webapi.json",
        "entityframework.json",
        "linq.json",
        "sqlserver.json",
        "oops.json",
        "designpatterns.json",
        "hrquestions.json"
    ];

    let allBookmarkedQuestions = [];

    for (const file of topicFiles) {

        const response =
            await fetch(`data/${file}`);

        const questions =
            await response.json();

        const matchingQuestions = questions
            .filter(q =>
                bookmarks.some(
                    b => b.id === q.id &&
                        b.topic === file
                )
            )
            .map(q => ({
                ...q,
                topic: file
            }));

        allBookmarkedQuestions.push(
            ...matchingQuestions
        );
    }

    renderQuestions(allBookmarkedQuestions);

});