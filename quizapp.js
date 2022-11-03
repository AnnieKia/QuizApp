const appState = {
  current_view : "#intro_view",
  current_quiz : "none",
  current_question: -1,
  current_model: {
    action: "quiz",
    answer: "null"
  },
  studentName: "",
  correctAnswers: 0,
  current_server: ""
}

document.addEventListener('DOMContentLoaded', () => {
  appState.current_view = "#intro_view";
  appState.current_model = {
    action: "quiz"
  }
  update_view(appState);

  document.querySelector("#widget_view").onclick = (e) => {
    handle_widget_event(e)
  }
});

function handle_widget_event(e){
  if(e.target.id != "StudentName"){
  if(appState.current_view == "#intro_view"){
      appState.studentName = document.getElementById("StudentName").value;
      appState.current_server = e.target.dataset.server
      appState.current_quiz= e.target.dataset.action
      appState.current_question = 0
  }else{
    (if e.target.dataset.action == "answer")
  }

  if(appState.current_view == "#question_view_text_input"){
    if(e.target.dataset.action == "answer"){
      isCorrect = check_user_response(e.target.dataset.answer, appState.current_model);
      app.current_question += 1;

    }
  }
  if(appState.current_view == "#question_view_true_false"){
    if (e.target.dataset.action == "answer") {
       // Controller - implement logic.
       isCorrect = check_user_response(e.target.dataset.answer, appState.current_model);

       // Update the state.
       appState.current_question =   appState.current_question + 1;

     }

  }
  loadModel(appState.current_quiz, appState.current_question);
}

}

async function loadModel(quiz, question){
  await fetch (`https://my-json-server.typicode.com/anniekia/quizapp/${quiz}/${question}`)
    .then(response => response.json())
    .then(data => {
      appState.current_model = data;
      setQuestionView(appState);

    })

}

function check_user_response(input, answer){
  if(input == answer){
    return true;
  }
  return false;
}

function update_view(appState){
  const html_element = render_widget(appState.current_model, appState.current_view);
  document.querySelector("#widget_view").innerHTML = html_element;
}


async function setQuestionView(appState) {
  console.log("pog");
  if (appState.current_question == -2){
    appState.current_view = "#end_view";
    return
  }
  await fetch (`https://my-json-server.typicode.com/anniekia/quizapp/${appState.current_quiz}/${appState.current_question}`)
    .then(response => response.json())
    .then(data => {
      appState.current_view = `#question_view_${data.questionType}`
      console.log(appState);
        update_view(appState);
    })


}

const render_widget = (model, view) => {
  template_source = document.querySelector(view).innerHTML;

  var template = Handlebars.compile(template_source)

  var html_widget_element = template({...model,...appState})
  console.log(html_widget_element);
  return html_widget_element
}
