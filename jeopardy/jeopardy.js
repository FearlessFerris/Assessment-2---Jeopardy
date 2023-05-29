

let categories = [];
const NUM_CATEGORIES = 6;
const NUM_QUESTIONS_PER_CAT = 5;






async function getCategoryIds() {
    const response = await axios.get('http://jservice.io/api/categories?count=100');

    let catId = response.data.map(function(c){
        return c.id
    })

    console.log(_.sampleSize(catId, NUM_CATEGORIES));
    return _.sampleSize(catId, NUM_CATEGORIES);

}






async function getCategory(catId) {
    const response = await axios.get(`https://jservice.io/api/category?id=${catId}`);

    let cat = response.data;
    let totalClues = cat.clues;
    let clueList = _.sampleSize(totalClues, NUM_QUESTIONS_PER_CAT);

    let clues = clueList.map(c => ({
        question: c.question,
        answer: c.answer,
        showing: null,
    }));

    console.log( cat.title, clues );
    return { title: cat.title, clues };
}






async function fillTable() {

$('#jeopardy').append('<thead>');
let $tr = $('<tr>');
for ( let i = 0; i < NUM_CATEGORIES; i++ ) {
  $tr.append($('<th>').text(categories[i].title));
}

$('#jeopardy').append($tr);
$('#jeopardy').append('<tbody>');

for ( let clueId = 0; clueId < NUM_QUESTIONS_PER_CAT; clueId++ ) {
  let $tr = $('<tr>');

  for ( let catId = 0; catId < NUM_CATEGORIES; catId++ ) {
    $tr.append($('<td>').attr('id', `${catId} - ${clueId}`).text('?'));
  }

  $('#jeopardy tbody').append($tr);

  } 
}






function handleClick(evt) {
    let id = evt.target.id;
    let [catId, clueId] = id.split(" - ");
    let clue = categories[catId].clues[clueId];

  
    let msg;
  
    if (!clue.showing) {
      msg = clue.question;
      clue.showing = "question";
    } else if (clue.showing === "question") {
      msg = clue.answer;
      clue.showing = "answer";
    } else {
      return
    }
    $('#' + `${catId}\\ -\\ ${clueId}`).html(msg);
}






function showLoadingView() {

  $('window').ready(function(){

    const $loader = $('.loader');

    $loader.addClass('loader-hidden');
    $loader.on('transitionend', function() {
      $('body').remove($loader);

    });
  })
}






function restartGame() {

  let $btn = $('#restart');

  $($btn).click(function() {
    location.reload();
    console.log(click);
  })

}






async function setupAndStart() {
  let catIds = await getCategoryIds();

  categories = [];

  for (let catId of catIds) {
    categories.push(await getCategory(catId));
  }

  fillTable();
}






$(async function () {

  showLoadingView();
  restartGame();
  setupAndStart();
  $("#jeopardy").on("click", "td", handleClick);

}
);

