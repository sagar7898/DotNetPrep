let allQuestions = [];

document.addEventListener("DOMContentLoaded", async () => {

    const container = document.getElementById("questionContainer");

    // Agar data-file nahi hai (Bookmarks page)
    // to questions.js yahin stop ho jayega
    if (!container.dataset.file) {
        return;
    }

    const fileName = container.dataset.file;

    const response = await fetch(`data/${fileName}`);

    allQuestions = await response.json();

    renderQuestions(allQuestions);

    const searchBox = document.getElementById("searchQuestion");

    if (searchBox) {

        searchBox.addEventListener("input", function () {

            const keyword = this.value.toLowerCase();

            const filteredQuestions = allQuestions.filter(q =>
                q.question.toLowerCase().includes(keyword) ||
                q.answer.join(" ").toLowerCase().includes(keyword)
            );

            renderQuestions(filteredQuestions);
        });
    }

});

function toggleAnswer(answerId, button) {

    const answer = document.getElementById(answerId);

    if (answer.style.display === "none") {

        answer.style.display = "block";
        button.textContent = "Hide Answer";

    } else {

        answer.style.display = "none";
        button.textContent = "Show Answer";
    }
}

function renderQuestions(questions) {

    const bookmarks = getBookmarks();

    const container =
        document.getElementById("questionContainer");

    let html = "";

    questions.forEach((q, index) => {

        const currentTopic =
            container.dataset.file || q.topic;

        const isBookmarked = bookmarks.some(
            b => b.id === q.id &&
                b.topic === currentTopic
        );

        html += `
            <div class="card mb-3">
                <div class="card-body">

                    ${q.topic ? `
                        <span class="badge bg-info mb-2">
                            ${q.topic}
                        </span>
                    ` : ''}

                    <div class="d-flex justify-content-between align-items-start mb-3">

                        <h5 class="card-title mb-0">
                            Q${index + 1}. ${q.question}
                        </h5>

                        <div class="d-flex align-items-center gap-3">

                            ${!window.isRevisionPage ? `
                                <span
                                    style="cursor:pointer;font-size:22px;"
                                    onclick="toggleBookmark(${q.id}, '${currentTopic}')">

                                    ${isBookmarked ? '⭐' : '☆'}

                                </span>
                            ` : ''}

                            ${window.isRevisionPage ? `
                                <input type="checkbox"
                                       class="form-check-input"
                                       ${isRevisionCompleted(q.id, q.topic) ? 'checked' : ''}
                                       onchange="toggleRevisionQuestion(${q.id}, '${q.topic}')">
                            ` : ''}

                        </div>

                    </div>

                    <button class="btn btn-primary btn-sm"
                            onclick="toggleAnswer('answer-${q.id}', this)">
                        Show Answer
                    </button>

                    <div id="answer-${q.id}" style="display:none;">
                        <hr>

                        <ul class="mb-0 ps-3">
                            ${q.answer.map(point =>
            `<li>${point}</li>`
        ).join("")}
                        </ul>

                    </div>

                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function getBookmarks() {
    return JSON.parse(localStorage.getItem("bookmarks")) || [];
}

function toggleBookmark(questionId, topic) {

    let bookmarks = getBookmarks();

    const existing = bookmarks.find(
        b => b.id === questionId && b.topic === topic
    );

    if (existing) {

        bookmarks = bookmarks.filter(
            b => !(b.id === questionId && b.topic === topic)
        );

    } else {

        bookmarks.push({
            id: questionId,
            topic: topic
        });
    }

    localStorage.setItem(
        "bookmarks",
        JSON.stringify(bookmarks)
    );

    location.reload();
}


function getRevisionData() {

    const today = new Date().toISOString().split("T")[0];

    let revisionData =
        JSON.parse(localStorage.getItem("revisionProgress"));

    if (!revisionData || revisionData.date !== today) {

        revisionData = {
            date: today,
            completed: []
        };

        localStorage.setItem(
            "revisionProgress",
            JSON.stringify(revisionData)
        );
    }

    return revisionData;
}


function isRevisionCompleted(id, topic) {

    const revisionData = getRevisionData();

    return revisionData.completed.some(
        q => q.id === id && q.topic === topic
    );
}



function toggleRevisionQuestion(id, topic) {

    let revisionData = getRevisionData();

    const exists = revisionData.completed.some(
        q => q.id === id && q.topic === topic
    );

    if (exists) {

        revisionData.completed =
            revisionData.completed.filter(
                q => !(q.id === id && q.topic === topic)
            );

    } else {

        revisionData.completed.push({
            id: id,
            topic: topic
        });
    }

    localStorage.setItem(
        "revisionProgress",
        JSON.stringify(revisionData)
    );
}