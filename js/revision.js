document.addEventListener("DOMContentLoaded", async () => {

    window.isRevisionPage = true;

    const today = new Date().toISOString().split("T")[0];

    const savedRevision =
        JSON.parse(localStorage.getItem("dailyRevision"));

    // Same day same questions
    if (savedRevision && savedRevision.date === today) {

        renderQuestions(savedRevision.questions);

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

    let revisionQuestions = [];

    for (const file of topicFiles) {

        const response = await fetch(`data/${file}`);

        const questions = await response.json();

        const shuffled =
            [...questions].sort(() => 0.5 - Math.random());

        revisionQuestions.push(
            ...shuffled.slice(0, 3).map(q => ({
                ...q,
                topic: file.replace(".json", "")
            }))
        );
    }

    // Save today's revision set
    localStorage.setItem(
        "dailyRevision",
        JSON.stringify({
            date: today,
            questions: revisionQuestions
        })
    );

    renderQuestions(revisionQuestions);
});