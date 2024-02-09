function determineGridSize(size) {
  var gridSize = Math.floor(size / 100);
  return Math.max(gridSize, 3);
}

function getGridSize() {
  var width = $(window).width();
  var height = $(window).height();

  //scaling based on height for more grid (more grid more fun)
  let scale = height < 600 ? Math.min(width, height) : Math.max(width, height);

  var gridSize = determineGridSize(scale);

  return gridSize;
}

function adjustButtons() {
  let gridSize = getGridSize();

  console.log("gridSize", gridSize);
  $(".buttonContainer").empty();

  for (var i = 0; i < gridSize * gridSize; i++) {
    $(".buttonContainer").append(
      '<li id="list' + (i + 1) + `" class="button btn">+</li>`
    );
  }

  $(".button").css({
    width: "10px",
    height: "10px",
  });

  $(".buttonContainer").css({
    display: "grid",
    "grid-template-columns": `repeat(${gridSize}, 10px)`,
    "column-gap": "4rem",
  });
}

function modalContentGenerator() {
  const content = [
    "Played by 2 People. (Other people can watch)",
    "Scalable grid by shrink or enlarge browser screen",
    "For grid more than 5x5 (means 6x6 and more), winning condition is having 5 tiles consecutively selected",
    "For grid below than 5x5 (means 4x4 and 3x3), winning condition is having tiles consecutively selected based on board size",
    "More feature incoming!! (Maybe)",
    "Contact me at : mursyidanluthfan@gmail.com",
  ];

  for (let i = 0; i < content.length; i++) {
    $(".modal-body ul").append(`<li>${content[i]}</li>`);
  }
}

function mainComponent() {
  const WINNING_SCORE = 5;
  let boardSize = getGridSize();
  var player = "o";
  var count = 0;
  var wins = { o: 0, x: 0 };

  adjustButtons();
  modalContentGenerator();

  console.log("size board =>", boardSize);

  function checkWin(player) {
    const maxSequence = boardSize > WINNING_SCORE ? WINNING_SCORE : boardSize;
    let win = false;

    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col <= boardSize - maxSequence; col++) {
        let sequenceWin = true;
        for (let offset = 0; offset < maxSequence; offset++) {
          if (
            !$(
              `#game li:nth-child(${row * boardSize + col + offset + 1})`
            ).hasClass(player)
          ) {
            sequenceWin = false;
            break;
          }
        }
        if (sequenceWin) return true;
      }
    }

    for (let col = 0; col < boardSize; col++) {
      for (let row = 0; row <= boardSize - maxSequence; row++) {
        let sequenceWin = true;
        for (let offset = 0; offset < maxSequence; offset++) {
          if (
            !$(
              `#game li:nth-child(${(row + offset) * boardSize + col + 1})`
            ).hasClass(player)
          ) {
            sequenceWin = false;
            break;
          }
        }
        if (sequenceWin) return true;
      }
    }

    for (let row = 0; row <= boardSize - maxSequence; row++) {
      for (let col = 0; col <= boardSize - maxSequence; col++) {
        let sequenceWin = true;
        for (let offset = 0; offset < maxSequence; offset++) {
          if (
            !$(
              `#game li:nth-child(${
                (row + offset) * boardSize + col + offset + 1
              })`
            ).hasClass(player)
          ) {
            sequenceWin = false;
            break;
          }
        }
        if (sequenceWin) return true;
      }
    }

    for (let row = maxSequence - 1; row < boardSize; row++) {
      for (let col = 0; col <= boardSize - maxSequence; col++) {
        let sequenceWin = true;
        for (let offset = 0; offset < maxSequence; offset++) {
          if (
            !$(
              `#game li:nth-child(${
                (row - offset) * boardSize + col + offset + 1
              })`
            ).hasClass(player)
          ) {
            sequenceWin = false;
            break;
          }
        }
        if (sequenceWin) return true;
      }
    }

    return win;
  }

  function resetGame() {
    $("#game li").text("+").removeClass("disable o x btn-primary btn-info");
    count = 0;
  }

  function updateScore(player) {
    wins[player]++;
    $("#" + player + "_win").text(wins[player]);
  }

  function switchPlayer() {
    player = player === "o" ? "x" : "o";
  }

  function makeMove(cell) {
    if (!$(cell).hasClass("disable")) {
      $(cell)
        .text(player)
        .addClass(
          "disable " + player + (player === "o" ? " btn-primary" : " btn-info")
        );
      count++;
      if (checkWin(player)) {
        alert(player.toUpperCase() + " wins");
        updateScore(player);
        resetGame();
      } else if (count === getGridSize() * getGridSize()) {
        alert("It's a tie.");
        resetGame();
      } else {
        switchPlayer();
      }
    } else {
      alert("Already selected");
    }
  }

  $("#game li").click(function () {
    makeMove(this);
  });

  $("#reset").click(resetGame);

  $("#openModal").click(function () {
    $("#guideModal").show();
  });

  $("#closeModal").click(function () {
    $("#guideModal").hide();
  });

  $(window).click(function (event) {
    var modal = $("#guideModal");
    if (event.target.id === modal.attr("id")) {
      modal.hide();
    }
  });
}

let resizeTimer;

$(window).resize(function () {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(mainComponent, 250);
});

$(document).ready(function () {
  mainComponent();
});
