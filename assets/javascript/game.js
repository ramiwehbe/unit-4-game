
let yourCharChosen = false;
let fightRound = 0;
let urHP = 0;
let urBaseAttackPwr = 0;
let urAttackPwr = 0;
let enemyCntrAttackPwr = 0;
let enemyHP = 0;
let win = new Audio('assets/audio/win.mp3');
let losing = new Audio('assets/audio/losing.mp3');
let punch = new Audio('assets/audio/punch.mp3');

function resetPoints() {
  urHP = $("#urCharacter").children().children("h5").data("health-points");
  urBaseAttackPwr = $("#urCharacter").children().children("h5").data("base-attack-power");
  urAttackPwr = $("#urCharacter").children().children("h5").data("attack-power");
  enemyCntrAttackPwr = $("#enemyCharacter").children().children("h5").data("counter-attack-power");
  enemyHP = $("#enemyCharacter").children().children("h5").data("health-points");
}

function displayHealthPoints() {
  $("#textResultCtnr").html("<span id=\"textResult\">" + "Your health is " + urHP +
    "\<br><id=\"textResult\">" + "Enemy health is " + enemyHP + "\<br>" +
    "<id=\"textResult\">" + "Your attack power is " + urBaseAttackPwr + "\<br>" +
    "<id=\"textResult\">" + "Enemy counter attack power is " + enemyCntrAttackPwr + "</span>");

  $("#urCharacter").children().children("div.card-body").children(".card-text").text(urHP + " Health Points");
  $("#enemyCharacter").children().children("div.card-body").children(".card-text").text(enemyHP + " Health Points");


}

function logEveryonesHealth() {
  console.log("Your health is " + urHP);
  console.log("Your Base Attack Power is " + urBaseAttackPwr);
  console.log("Enemy Attack Power is " + enemyCntrAttackPwr);
  console.log("Enemy Health Power is " + enemyHP);
}

function toggleFightBtn(isOn) {
  if (isOn) {
    $("#fightBtn").attr("disabled", "disabled").toggleClass("disabled", true);
  } else {
    $("#fightBtn").removeAttr("disabled").toggleClass("disabled");
  }
}

function updateScoreBoard(result, lastEnemyName) {
  if (result === "won") {
    $("#textResultCtnr").html("<span id=\"textResult\">You have defeated " + lastEnemyName +
      "\<br><id=\"textResult\">Game Over!! You have Won!!\<br>" +
      "<button id=\"newGameBtn\" class=\"btn btn-primary\">" + "New Game</button>" + "</span>");
    win.play();
  } else if (result === "lost") {
    $("#textResultCtnr").html("<span id=\"textResult\">You have lost !!\<br>" +
      "<button id=\"newGameBtn\" class=\"btn btn-primary\">" + "New Game</button></span>");
    losing.play();
  } else {
    $("#textResultCtnr").html("<span id=\"textResult\">You have defeated " + lastEnemyName +
      "\<br><id=\"textResult\">Choose your next enemy</span>");
    win.play();
  }
}

function addNewGameEvent() {
  $("#newGameBtn").on("click", function () {
    window.location.reload();
  });
}

function isGameOver() {
  if (enemyHP <= 0) {
    //Enemy has lost

    var lastEnemyName = $("#enemyCharacter").children().children("h5").text();
    $("#enemyCharacter").children().remove();

    if (fightRound < 2) {
      updateScoreBoard("inprogress", lastEnemyName);
    }
    else {
      updateScoreBoard("won", lastEnemyName);
      addNewGameEvent();
    }
    $(".backstage a").toggleClass("disabled", false);
    toggleFightBtn(true);
    fightRound++;
  }
  else if (urHP <= 0) {
    //You have lost
    updateScoreBoard("lost", lastEnemyName);
    addNewGameEvent();
    toggleFightBtn(true);
  }
}

function resizeContainers(elem, from, to) {
  return elem.removeClass(from).addClass(to);
}

function fight() {

  console.log("************ Before deduction ***************");
  logEveryonesHealth();

  $("#urCharacter").children().children("h5").data("health-points", urHP - enemyCntrAttackPwr);
  $("#enemyCharacter").children().children("h5").data("health-points", enemyHP - urBaseAttackPwr);
  $("#urCharacter").children().children("h5").data("base-attack-power", urBaseAttackPwr + urAttackPwr);

  resetPoints();

  console.log("************ After deduction ***************");

  logEveryonesHealth();
  displayHealthPoints(urHP, enemyHP);

  isGameOver();
}

$("a").on("click", function (event) {

  var currentContainer = $(this).parent().parent();
  if (!yourCharChosen) {
    //choosing your character
    $(this).toggleClass("disabled", true).toggleClass('background-color', 'red');
    currentContainer.removeClass("backstage");
    resizeContainers(currentContainer, "col-xs-3", "col-xs-4")
    $("#urCharacter").append(currentContainer);
    $("#titleLetter").text("Choose enemy character");
    resizeContainers($(".backstage"), "col-xs-3", "col-xs-4");
    $(this).replaceWith('<div id="urCharacterLabel">Your Character<div>');
    yourCharChosen = true;
  } else {
    //choosing enemy character
    $(this).toggleClass("disabled", true);
    currentContainer.removeClass("backstage");
    if (fightRound == 0) {
      $("#enemyCharacter").append(currentContainer);
      resizeContainers($(".backstage"), "col-xs-4", "col-xs-6");
      $("#fightBtnCtnr").append(
        '<button id="fightBtn" class="btn btn-danger">Fight</button>'
      );
      $("button#fightBtn").on("click", function () {
        punch.play();
        fight();

      });
      $("#titleLetter").text("Fight!");
      resetPoints();
      displayHealthPoints();
    } else if (fightRound == 1) {
      toggleFightBtn(false);
      resizeContainers($(".backstage"), "col-xs-6", "col-xs-12");
      resizeContainers(currentContainer, "col-xs-6", "col-xs-4")
      $("#enemyCharacter").append(currentContainer);
      resetPoints();
      displayHealthPoints();
    } else if (fightRound == 2) {
      toggleFightBtn(false);
      resizeContainers(currentContainer, "col-xs-12", "col-xs-4")
      $("#enemyCharacter").append(currentContainer);
      resetPoints();
      displayHealthPoints();
    }
    $(this).replaceWith('<div id="enemyCharacterLabel">Your Enemy<div>');
    $(".backstage a").toggleClass("disabled", true);
  }
});
