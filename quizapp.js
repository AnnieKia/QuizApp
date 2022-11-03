const appState = {
  current_view : "#intro-view",
  current_quiz : "none",
  current_question: -1,
  current_model: {}
}

document.addEventListener('DOMContentLoaded', () => {
  appState.current_view = "#intro-view";
  appState.current_model = {
    action: "quiz"
  }
  update_view(appState);

  document.querySelector("#widget_view").onclick = (e) => {
    handle_widget_event(e)
  }
});

function handle_widget_event(e){
  if(appState.current_view == "#intro_view"){

      appState.current_quiz= e.target.dataset.action
      appState.current_question = 0
      appState.current_model = loadModel(appState.current_quiz, appState.current_question);
      setQuestionView(appState);

      update_view(appState);

  }

  if(appState.current_view == "#question_view_text_input"){
    if(e.target.dataset.action == "answer"){
      isCorrect = check_user_response(e.target.dataset.answer, appState.current_model);

      app.current_question += 1;
      appState.current_model = loadModel()
    }
  }
  if(appState.current_view == "#question_view_true_false")
}

function loadModel(quiz, question){
  const response = await fetch(`https://my-json-server.typicode.com/anniekia/quizapp/${quiz}/${current_question}`);
    const question = await response.json();

    return questionText;
}
check_user_response(input, answer){
  if(input == answer){
    return true;
  }
  return false;
}
