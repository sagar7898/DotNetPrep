let currentQuestions = [];

document.addEventListener("DOMContentLoaded", () => {

    loadQuestions("coding-csharp.json", "csharpContainer");

    document.getElementById("csharp-tab")
        .addEventListener("click", () => {

            loadQuestions(
                "coding-csharp.json",
                "csharpContainer"
            );

        });

    document.getElementById("linq-tab")
        .addEventListener("click", () => {

            loadQuestions(
                "coding-linq.json",
                "linqContainer"
            );

        });

    document.getElementById("sql-tab")
        .addEventListener("click", () => {

            loadQuestions(
                "coding-sql.json",
                "sqlContainer"
            );

        });

});
async function loadQuestions(fileName, containerId) {

    const response =
        await fetch(`data/${fileName}`);

    currentQuestions =
        await response.json();

    renderQuestions(
        currentQuestions,
        containerId
    );

}
function renderQuestions(questions, containerId) {

    const container = document.getElementById(containerId);

    let html = "";

    questions.forEach((q, index) => {

        html += `
        
            <div class="card mb-4">

                <div class="card-body">

                    <h5 class="card-title mb-3">
                        Q${index + 1}. ${q.question}
                    </h5>

                   <button class="btn btn-primary btn-sm"
                            onclick="toggleSolution('solution-${containerId}-${q.id}', this)">
                        Show Solution
                   </button>

                    <div id="solution-${containerId}-${q.id}" class="mt-4" style="display:none;">

                        <hr>

                        <h6 class="fw-bold">
                            Short Answer
                        </h6>

                        <p>
                            ${q.shortAnswer}
                        </p>

                        <hr>

                        <h6 class="fw-bold">
                            Explanation
                        </h6>

                        <p>
                            ${q.detailedAnswer}
                        </p>

                        <hr>

                        <div class="d-flex justify-content-between align-items-center mb-2">

                            <h6 class="fw-bold mb-0">
                                Source Code
                            </h6>

                            <button class="btn btn-outline-secondary btn-sm"
                                    onclick="copyCode('${containerId}-${q.id}')"
                                    id="copyBtn-${containerId}-${q.id}">
                                📋 Copy Code
                            </button>

                        </div>

                       <pre class="rounded"> <code class="language-csharp" id="code-${containerId}-${q.id}">${q.code} </code></pre>

                    </div>

                </div>

            </div>

        `;
    });

    container.innerHTML = html;
    Prism.highlightAll();

}

function toggleSolution(solutionId, button) {

    const solution =
        document.getElementById(solutionId);

    if (solution.style.display === "none") {

        solution.style.display = "block";
        button.textContent = "Hide Solution";

    }
    else {

        solution.style.display = "none";
        button.textContent = "Show Solution";

    }

}

function copyCode(id) {

    const code =
        document.getElementById(`code-${id}`).innerText;

    navigator.clipboard.writeText(code);

    const button =
        document.getElementById(`copyBtn-${id}`);

    button.innerHTML = "✅ Copied";

    setTimeout(() => {

        button.innerHTML = "📋 Copy Code";

    }, 2000);
}