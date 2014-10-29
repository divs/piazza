(function(window, document, undefined) {

    // pane elements
    var rightPane = document.getElementById('right-pane');
    var leftPane = document.getElementById('left-pane');

    // button and input elements

    // script elements that correspond to Handlebars templates
    var questionFormTemplate = document.getElementById('question-form-template');
    var questionsTemplate = document.getElementById('questions-template');

    // compiled Handlebars templates
    var templates = {
        renderQuestionForm: Handlebars.compile(questionFormTemplate.innerHTML),
        renderQuestions: Handlebars.compile(questionsTemplate.innerHTML)
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
    
    // TODO: tasks 1-5 and one extension

    // display question form initially
    rightPane.innerHTML = templates.renderQuestionForm();

    // TODO: display question list initially (if there are existing questions)
    var questionForm = document.getElementById('question-form');
    questionForm.addEventListener("submit", function(event) {
        event.preventDefault();
        var newQ = {
            subject : this.subject.value,
            question : this.question.value
        }
        storeQuestions([]);
        storeAnotherQuestion(newQ);
    });

    leftPane.innerHTML = templates.renderQuestions({questions: localStorage.questions});

})(this, this.document);
