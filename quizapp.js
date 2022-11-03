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
function sleep(ms){
  return new Promise(resolve => setTimeout(resolve, ms));
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
  const t = e.target.dataset.action
  isCorrect = false;
  if(t == "submit" || t == "answer" || t == "quiz1" || t == "quiz2"){
  if(appState.current_view == "#intro_view"){
      appState.studentName = document.getElementById('StudentName').value;
      appState.current_server = e.target.dataset.server
      appState.current_quiz= e.target.dataset.action
      appState.current_question = 0;
      loadModel(appState);
    }
    else if(appState.current_view == "#feedback_view"){
      appState.current_question = appState.current_question + 1;
      loadModel(appState);
    }else if(appState.current_view == "#end_view"){
      appState = {
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
      update_view(appState);
    }
    else if(appState.current_view == "#question_view_true_false"){
    if(t == "answer"){
      console.log(e.target.dataset.answer);
      isCorrect = check_user_response(e.target.dataset.answer, appState.current_model.correctAnswer);
    }
  }
  else if(appState.current_view == "#question_view_text_input"){
    if (e.target.dataset.action == "submit") {
       // Controller - implement logic.
       const user_response = document.getElementById('answerFieldId').value;
       isCorrect = check_user_response(user_response, appState.current_model.correctAnswer);
       // Update the state
     }
  }
  else if(appState.current_view == "#question_view_multiple_choice"){
    if(e.target.dataset.action == "submit"){
      isCorrect = check_user_response(document.querySelector(`input[name = "${appState.current_model.questionText}"]:checked`).value, appState.current_model.correctAnswer)
    }
  }
  else if(appState.current_view == "#question_view_checkbox"){
    if(e.target.dataset.action == "submit"){
      var answers = [];
      var answerObjects = (document.querySelectorAll(`input[name ="${appState.current_model.id}"]:checked`));
      answerObjects.forEach((answer) => {
        answers.push(answer.dataset.answer);
      });

      isCorrect = check_user_response_list(answers, appState.current_model.correctAnswer);
    }
  }
  else if(appState.current_view == "#question_view_multi_text_input"){
    var textAnswers = [];
    textAnswers.push(document.getElementById('answer_to_first_blank').value);
    textAnswers.push(document.getElementById('answer_to_second_blank').value);
    isCorrect = check_user_response_list(textAnswers, appState.current_model.correctAnswer);
  }
  if(t== "answer" || t == "submit") {
  if(isCorrect){
    appState.current_view = "#correct_view"
    appState.correctAnswers += 1;
    update_view(appState);
    sleep(1000);
    appState.current_question = appState.current_question + 1;
    loadModel(appState);
  }else if(!isCorrect){
    appState.current_view = "#feedback_view"
    update_view(appState);
  }
}

}

}

async function loadModel(appState){
  if(appState.current_question== 20){
    appState.current_view = "#end_view"
    update_view(appState);
  }
  else
  {await fetch (`https://my-json-server.typicode.com/anniekia/${appState.current_server}/${appState.current_quiz}/${appState.current_question}`)
    .then(response => response.json())
    .then(data => {
      appState.current_model = data;
      setQuestionView(appState);

    })
}
}

function check_user_response(input, answer){
  if(input === answer){
    return true;
  }else{
  return false;
}
}

function check_user_response_list(input, answer){
  if(input.length !== answer.length) return false;
  const uniqueValues = new Set([...input,...answer]);
  for(const v of uniqueValues){
    const inputCount = input.filter(e => e===v).length;
    const answerCount = answer.filter(e=> e===v).length;
    if (inputCount !== answerCount) return false;
  }
  return true;
}

function update_view(appState){
  const html_element = render_widget(appState.current_model, appState.current_view);
  document.querySelector("#widget_view").innerHTML = html_element;
}


async function setQuestionView(appState) {

  if (appState.current_question == 20){
    appState.current_view = "#end_view";
    return
  }
  await fetch (`https://my-json-server.typicode.com/anniekia/${appState.current_server}/${appState.current_quiz}/${appState.current_question}`)
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
  return html_widget_element
}
