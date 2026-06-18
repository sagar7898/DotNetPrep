document.addEventListener("DOMContentLoaded", async () => {

    const files = [
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

    const quickNotes = [
        "Middleware processes requests and responses in ASP.NET Core.",
        "LINQ helps write readable and concise data queries.",
        "Dependency Injection improves maintainability and testability.",
        "Entity Framework Core simplifies database operations.",
        "Stored Procedures can improve performance and security."
    ];

    const interviewTips = [
        "Always explain answers with a real project example.",
        "Keep answers short and structured in 3-4 points.",
        "If you don't know an answer, explain the related concept.",
        "Mention practical use cases whenever possible.",
        "Focus on clarity rather than complex terminology."
    ];

    const topicMappings = [
        { file: "csharp.json", id: "csharpCount" },
        { file: "aspnetcore.json", id: "aspnetcoreCount" },
        { file: "webapi.json", id: "webapiCount" },
        { file: "sqlserver.json", id: "sqlserverCount" },
        { file: "linq.json", id: "linqCount" },
        { file: "entityframework.json", id: "entityframeworkCount" }
    ];

    for (const topic of topicMappings) {

        const response = await fetch(`data/${topic.file}`);

        const questions = await response.json();

        document.getElementById(topic.id).textContent =
            `${questions.length} Questions`;
    }

    let totalQuestions = 0;
    let allQuestions = [];

    for (const file of files) {

        const response = await fetch(`data/${file}`);

        const questions = await response.json();

        totalQuestions += questions.length;

        allQuestions.push(...questions);
    }

    // Total Questions
    document.getElementById("totalQuestions").textContent =
        totalQuestions;

    // Bookmarks Count
    const bookmarks =
        JSON.parse(localStorage.getItem("bookmarks")) || [];

    document.getElementById("bookmarkCount").textContent =
        bookmarks.length;

    // Question of Day
    const today = new Date();

    const dayNumber =
        Math.floor(today.getTime() / 86400000);

    const question =
        allQuestions[dayNumber % allQuestions.length];

    document.getElementById("questionOfDay").textContent =
        question.question;

    // Quick Note
    document.getElementById("quickNote").textContent =
        quickNotes[dayNumber % quickNotes.length];

    // Interview Tip
    document.getElementById("interviewTip").textContent =
        interviewTips[dayNumber % interviewTips.length];


    const revisionData =
        JSON.parse(localStorage.getItem("revisionProgress")) || {
            completed: []
        };

    const completedCount =
        revisionData?.completed?.length || 0;

    document.getElementById("todayRevisionCount")
        .textContent = `${completedCount} / 30`;
});