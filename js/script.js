(function(window, document, undefined) {

    // pane elements
    var rightPane = document.getElementById('right-pane');
    var leftPane = document.getElementById('left-pane');

    // button and input elements
    var interactors = document.getElementById('interactors');
    var btn = interactors.getElementsByClassName('btn')[0];

    // script elements that correspond to Handlebars templates
    var questionFormTemplate = document.getElementById('question-form-template');
    var questionsTemplate = document.getElementById('questions-template');
    var expandedQuestionTemplate = document.getElementById('expanded-question-template');

    // compiled Handlebars templates
    var templates = {
        renderQuestionForm: Handlebars.compile(questionFormTemplate.innerHTML),
        renderQuestions: Handlebars.compile(questionsTemplate.innerHTML),
        renderExpandedQuestion: Handlebars.compile(expandedQuestionTemplate.innerHTML)
    };


    /* Returns the questions stored in localStorage. */
    function getStoredQuestions() {
        if (!localStorage.questions) {
            // default to empty array
            localStorage.questions = JSON.stringify([]);
        }

        return JSON.parse(localStorage.questions);
    }

    /* Store the given questions array in localStorage.
     *
     * Arguments:
     * questions -- the questions array to store in localStorage
     */
    function storeQuestions(questions) {
        localStorage.questions = JSON.stringify(questions);
    }

    function storeAnotherQuestion(question) {
        var arr = getStoredQuestions();
        arr.push(question);
        storeQuestions(arr);
    }

    function refreshQuestionsList() {
        leftPane.innerHTML = templates.renderQuestions({questions: getStoredQuestions()});
    }

    function storeResponse(questionId, response) {
        var storedQ = getStoredQuestions();
        var storedQLen = storedQ.length;
        var targetIndex;
        var targetQ;
        for (var i = 0; i < storedQLen; i++) {
            if (storedQ[i].id == questionId) {
                targetIndex = i;
                targetQ = storedQ[i];
                storedQ.splice(i, 1);
            }  
        }
        targetQ.responses.push(response);
        storedQ.push(targetQ);
        storeQuestions(storedQ);
        return targetQ;
    }

    function renderExpandedQuestionHelper(questionId) {
        var storedQ = getStoredQuestions();
        var storedQLen = storedQ.length;
        var targetQ;
        for (var i = 0; i < storedQLen; i++) {
            if (storedQ[i].id == questionId)
                targetQ = storedQ[i];
        }
        rightPane.innerHTML = templates.renderExpandedQuestion(targetQ);
        var responseForm = document.getElementById('response-form');
        responseForm.addEventListener("submit", function(event) {
            event.preventDefault();
            var newResponse = {
                name : this.name.value,
                response : this.response.value
            };
            var newQ = storeResponse(questionId, newResponse);
            alert(JSON.stringify(newResponse));
            rightPane.innerHTML = templates.renderExpandedQuestion(newQ);
        });
    }

    renderQuestionFormHelper();

    btn.addEventListener("click", function(event) {
        event.preventDefault();
        renderQuestionFormHelper();
    });

    function renderQuestionFormHelper() {
        rightPane.innerHTML = templates.renderQuestionForm();
        refreshQuestionsList();

        var questionForm = document.getElementById('question-form');
        questionForm.addEventListener("submit", function(event) {
            event.preventDefault();
            var ID = Math.random();
            var newQ = {
                id : ID,
                subject : this.subject.value,
                question : this.question.value,
                responses: []
            };
            storeAnotherQuestion(newQ);
            refreshQuestionsList();
            questionForm.reset();
            var question = document.getElementById(JSON.stringify(ID));

            question.addEventListener("click", function(e) {
                renderExpandedQuestionHelper(e.currentTarget.id);
            });
        });
    }

    var clearButton = document.getElementById('resetButton');
    clearButton.addEventListener("click", function(event) {
        event.preventDefault();
        localStorage.clear();
        refreshQuestionsList();
    });


})(this, this.document);
