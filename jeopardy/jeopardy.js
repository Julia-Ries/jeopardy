
// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

let categories = [];
const board = [];
let catId = [];
const jServiceAPI = "https://jservice.io/api/";
let width = 6; //category count
let height = 5; //question count 


// async function createButton(){
//     const $button = $("button");
//     const $tDiv = $("#board");
//     $button.textContent = ("Restart")
//     $tDiv.append($button);
//     console.log("button", $button)
// };
// createButton();
    

/** Get NUM_CATEGORIES random category from API.
 *
//Returns array of category ids
//  */
class Category { }
async function getCategoryIds() {
    const response = await axios.get('https://jservice.io/api/categories', 
    { 
        params : {
        count: "100",
        offset: Math.floor(Math.random() * (500 - 1) + 1)
    }

});

    let randomCategories = _.sampleSize(response.data, width)
    // console.log("random categories", randomCategories);
    let categoryIds = randomCategories.map((catObj) => {
        return catObj.id;
    });
    return categoryIds;
}
//getCategoryIds();




/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

 async function getMultipleCategories() {
    categoryArray = [ ];
    let categories = await getCategoryIds();
    for (let categoryId of categories) {
        let fullCategory = await getCategory(categoryId);
        categoryArray.push(fullCategory);
    }
    return categoryArray;
}

 async function getCategory(catId) {
let response = await axios.get('https://jservice.io/api/clues?categories',
{
    params: {
        category: catId,
    }
}); 

let selectFiveQuestions = _.sampleSize(response.data, height);
//selectFiveQuestions.push({ question, answer });
   // response.data.innerHTML = JSON.Stringify(response.data);
   // console.log("data", response.data)
let questionArray = selectFiveQuestions.map((question) => {
    if (question.answer.startsWith ('<i>')){
        question.answer = question.answer.slice(3,-3);
        // console.log(question, question.answer);
  } return {
    question: question.question,
    answer: question.answer,
    showing: null
  }
});
console.log('question array', questionArray);
let categoryQuestions = {
    title: response.data[0].category.title,
    clues: questionArray
}
//innerHTML.JSONStringify(data);
console.log("category questions", categoryQuestions);
console.log("JSON", JSON.stringify(categoryQuestions));
//categoryQuestions.innerHTML = JSON.stringify(categoryQuestions);
return categoryQuestions;

}

//getCategory(catId);

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

//  function makeBoard() {
//     for (let i = 0; i < height; i++) {
//         board[i] = Array(width).fill(null);
//     }
//  }

function fillTable(categories) {
    const htmlBoard = document.getElementById("board");

    let top = document.createElement("tr");
    // top.setAttribute("id", "column-top");
    //top.addEventListener("click", handleClick);

    for(let x = 0; x < width; x++){
        let headCell = document.createElement("td");
        headCell.setAttribute("id", x);
        headCell.style.display = top.append(headCell)
        let cat = categories[x].title;
        // console.log(cat);
        headCell.append(cat);
    }
    htmlBoard.append(top);

    for(let y = 0; y < height; y++){
        const row = document.createElement("tr");
        let $qMark = document.createElement("h2");
        let q = document.createTextNode("?");
        $qMark.appendChild(q);
        for(let x = 0; x < width; x++) {
            let $qMark = document.createElement("h2");
        let q = document.createTextNode("?");
        $qMark.appendChild(q);
        const cell = document.createElement("td");
        cell.setAttribute("id", `${x}-${y}`);
       $qMark.setAttribute("id", `${x}-${y}`);
       row.append(cell);
       cell.append($qMark);
       cell.addEventListener("click", (evt) => {
        console.log('event', evt);
        showQuestionOrAnswer(evt.target.id, categories);
        console.log('eventss', evt.target.id)
       });
        }
        htmlBoard.append(row);
    }
}
//fillTable(categories);


async function initialize (){
    let multipleCategories = await getMultipleCategories();
    
    fillTable(multipleCategories);
}
initialize();

function showQuestionOrAnswer(id, categories){
    let $clickedCell = $(`#${id}`);
    console.log('this is the id', id)
    let category = id.slice(0, 3);
    console.log('want 0', category);
    let question = id.slice(2);

    // shorthand variables for game data
    console.log("categories", categories);
    let theCell = categories[category].clues[question];

    let theQuestion = theCell.question;
    let theAnswer = theCell.answer;

    // check clicked question for what .showing is
    if (theCell.showing === null) { // show the question
        $clickedCell.text(theQuestion);
        theCell.showing = "question";
    }
    else if (theCell.showing === "question") { // show the answer
        $clickedCell.toggleClass("answer")
        $clickedCell.text(theAnswer);
        theCell.showing = "answer";
        $clickedCell.toggleClass("not-allowed");
    }

}

showQuestionOrAnswer();


// function refreshPage() {
//     let button = document.getElementById("btn");
//     button.addEventListener("click", alert('i have clicked'))
// };

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */
function handleClick(evt) {
    // let clickedCell = evt
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */
function showLoadingView() {
    $button.text('Loading...').toggleClass("not-allowed");
    $tDiv.empty();
    let $loading = $("<i>").attr("class", "fas fa-spinner fa-pulse loader");
    $tDiv.append($loading);
}

/** Remove the loading spinner and update the button used to fetch data. */
function hideLoadingView() {
    $button.text("Restart!").toggleClass("not-allowed");
    $tDiv.empty();
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

//  async function setupAndStart() {
//     showLoadingView();
//     await getMultipleCategories();
//     hideLoadingView();
//     addListeners();
// }
// $button.on("click", async () => {
//     setupAndStart();
// });


async function addListeners() {
    const gameTable = $("table");
    gameTable.on('click', 'td', (evt)=>{
        console.log('event', evt);
        showQuestionOrAnswer(evt.target.id);
        //console.log('event', evt.target.id);
    });
}
/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */
 
// TODO; 