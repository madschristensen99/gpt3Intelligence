  const numberOfWeeks = 10;

class Player {
  constructor(name, position, rating) {
    this.name = name;
    this.position = position;
    this.rating = rating;
  }
}

const availablePlayers = [
  // Add more players as needed
  { name: "Player 1", position: "QB", rating: 90 },
  { name: "Player 2", position: "RB", rating: 85 },
  { name: "Player 3", position: "WR", rating: 88 },
  { name: "Player 4", position: "TE", rating: 82 },
  { name: "Player 5", position: "DE", rating: 89 },
  { name: "Player 6", position: "LB", rating: 87 },
  { name: "Player 7", position: "CB", rating: 91 },
  { name: "Player 8", position: "S", rating: 86 },
  { name: "Player 9", position: "K", rating: 80 },
  { name: "Player 10", position: "P", rating: 81 },
  { name: "Player 11", position: "QB", rating: 88 },
  { name: "Player 12", position: "RB", rating: 83 },
  { name: "Player 13", position: "WR", rating: 86 },
  { name: "Player 14", position: "TE", rating: 80 },
  { name: "Player 15", position: "DE", rating: 87 },
  { name: "Player 16", position: "LB", rating: 85 },
  { name: "Player 17", position: "CB", rating: 89 },
  { name: "Player 18", position: "S", rating: 84 },
  { name: "Player 19", position: "K", rating: 78 },
  { name: "Player 20", position: "P", rating: 79 },
  // Add even more players if necessary
];


class Team {
  constructor(name) {
    this.name = name;
    this.roster = [];
  }

  draftPlayer(playerIndex) {
    const player = availablePlayers[playerIndex];
    this.roster.push(player);
    return player;
  }
}

const myTeam = new Team("My Team");
const otherTeams = [
  new Team("Team A"),
  new Team("Team B"),
  new Team("Team C"),
];
const allTeams = [myTeam, ...otherTeams];

function updatePlayerList() {
  const availablePlayersList = document.getElementById("available-players");
  const myTeamList = document.getElementById("my-team");

  availablePlayersList.innerHTML = '';
  myTeamList.innerHTML = '';

  availablePlayers.forEach((player, index) => {
    const listItem = document.createElement("li");
    const button = document.createElement("button");
    button.textContent = `Draft ${player.name} (${player.position}) - Rating: ${player.rating}`;
    button.disabled = currentPick !== userPick || currentRound > totalRounds; // Disable the button when it's not the user's turn or the draft is over
    button.addEventListener("click", () => {
      draftPlayer(index);
      updatePlayerList();
    });
    listItem.appendChild(button);
    availablePlayersList.appendChild(listItem);
  });

  // Update the depth chart for "My Team"
  const positions = ["QB", "RB", "WR", "TE", "OL", "DL", "LB", "CB", "S", "K"];
  positions.forEach(position => {
    let playerAtPosition = myTeam.roster.find(player => player.position === position);
    const listItem = document.createElement("li");
    if (playerAtPosition) {
      listItem.textContent = `${position}: ${playerAtPosition.name} - Rating: ${playerAtPosition.rating}`;
    } else {
      listItem.textContent = `${position}: `;
    }
    myTeamList.appendChild(listItem);
  });
  
  // Update the rosters for "Other Teams"
  otherTeams.forEach((team, index) => {
    const teamList = document.getElementById(`team-${index + 1}`);
    if (!teamList) {
      console.error(`No element found with ID 'team-${index + 1}'. Please make sure the ID is correct in your HTML file.`);
      return;
    }
    teamList.innerHTML = '';

    team.roster.forEach(player => {
      const listItem = document.createElement("li");
      listItem.textContent = `${player.name} (${player.position}) - Rating: ${player.rating}`;
      teamList.appendChild(listItem);
    });
  });  
  // Display a message when the draft is over
  if (currentRound > totalRounds) {
    const draftStatus = document.getElementById("draft-status");
    if (draftStatus) {
      draftStatus.textContent = "The draft is over!";
    }
    simulateSeason(); // Call the simulateSeason function when the draft is over
  }
    
}


let currentRound = 1;
const totalRounds = 3;
let userPick;
let currentPick = 1;

function runDraft() {
  if (currentRound <= totalRounds) {
    if (currentPick === userPick) {
      // It's the user's turn to pick
      updatePlayerList();
    } else {
      // Simulate drafting for the other teams
      const teamIndex = currentPick < userPick ? currentPick - 1 : currentPick - 2; // Correctly calculate the team index
      const team = otherTeams[teamIndex];
      let playerIndex;
      let playerInRoster;

      do {
        playerIndex = Math.floor(Math.random() * availablePlayers.length);
        playerInRoster = allTeams.some(team => team.roster.includes(availablePlayers[playerIndex]));
      } while (playerInRoster);

      const draftedPlayer = team.draftPlayer(playerIndex);
      availablePlayers.splice(playerIndex, 1); // Remove the drafted player from availablePlayers

      incrementPickAndRound();
      setTimeout(runDraft, 100); // Add a short delay to help with the display of the roster
    }
  } else {
    updatePlayerList(); // Update the player list after the draft is over
  }
}

function draftPlayer(playerIndex) {
  myTeam.draftPlayer(playerIndex);
  availablePlayers.splice(playerIndex, 1); // Remove the drafted player from availablePlayers
  incrementPickAndRound();
  setTimeout(runDraft, 100); // Trigger the next round after drafting a player
}

function incrementPickAndRound() {
  if (currentRound % 2 === 1) {
    if (currentPick === allTeams.length) {
      currentRound++;
    } else {
      currentPick++;
    }
  } else {
    if (currentPick === 1) {
      currentRound++;
    } else {
      currentPick--;
    }
  }
}


function promptForPlayerSelection(availablePlayers) {
  // In this example, the user selects a player by their index in the list
  const playerNames = availablePlayers.map(player => `${player.name} (${player.position}) - Rating: ${player.rating}`);
  const userInput = parseInt(prompt(`Select a player to draft by entering their index (0 - ${playerNames.length - 1}):\n${playerNames.join("\n")}`));

  // Validate user input
  if (!isNaN(userInput) && userInput >= 0 && userInput < availablePlayers.length) {
    return userInput;
  } else {
    alert("Invalid input. Please try again.");
    return promptForPlayerSelection(availablePlayers);
  }
}

function simulateSeason() {
  console.log("Simulating the season...");
  const schedule = generateSchedule();

  // Create a container for each week
  const seasonResults = document.getElementById("season-results");
  seasonResults.innerHTML = ""; // Clear previous results
  const weeks = [];
  for (let i = 0; i < numberOfWeeks; i++) {
    const weekContainer = document.createElement("div");
    weekContainer.id = `week-${i + 1}`;
    weekContainer.innerHTML = `<h3>Week ${i + 1}</h3>`;
    seasonResults.appendChild(weekContainer);
    weeks.push(weekContainer);
  }

  // Simulate regular season games
  schedule.forEach((game, index) => {
    const scores = calculateScore(game.teamA, game.teamB);
    game.scoreA = scores.scoreA;
    game.scoreB = scores.scoreB;

    // Display game results
    displayGameResult(game, `week-${game.week}`);
  });
  
  // Calculate final standings and display them
  const standings = allTeams.slice().sort((a, b) => (b.wins || 0) - (a.wins || 0));

  // Create containers for playoff weeks
  const semiFinalsContainer = document.createElement("div");
  semiFinalsContainer.id = "semi-finals";
  semiFinalsContainer.innerHTML = "<h3>Semi-finals</h3>";
  seasonResults.appendChild(semiFinalsContainer);

  const finalsContainer = document.createElement("div");
  finalsContainer.id = "finals";
  finalsContainer.innerHTML = "<h3>Championship</h3>";
  seasonResults.appendChild(finalsContainer);

  simulatePlayoffs(standings, semiFinalsContainer, finalsContainer);
    
}

function simulatePlayoffs(standings, semiFinalsContainer, finalsContainer) {
  // Get the top 4 teams
  const playoffTeams = standings.slice(0, 4);

  // Simulate the semi-finals
  const semiFinals = [
    { teamA: playoffTeams[0], teamB: playoffTeams[3] },
    { teamA: playoffTeams[1], teamB: playoffTeams[2] },
  ];

  semiFinals.forEach((game, index) => {
    const scores = calculateScore(game.teamA, game.teamB);
    game.scoreA = scores.scoreA;
    game.scoreB = scores.scoreB;
    displayGameResult(game, semiFinalsContainer.id);
  });

  // Simulate the final game
  const finalGame = {
    teamA: semiFinals[0].scoreA > semiFinals[0].scoreB ? semiFinals[0].teamA : semiFinals[0].teamB,
    teamB: semiFinals[1].scoreA > semiFinals[1].scoreB ? semiFinals[1].teamA : semiFinals[1].teamB,
  };

  const finalScores = calculateScore(finalGame.teamA, finalGame.teamB);
  finalGame.scoreA = finalScores.scoreA;
  finalGame.scoreB = finalScores.scoreB;

  displayGameResult(finalGame, finalsContainer.id);

  return finalGame;
}




function getUserPicks(initialPick, totalRounds) {
  const picks = [];
  for (let round = 1; round <= totalRounds; round++) {
    const pickInRound = round % 2 === 1 ? initialPick : allTeams.length - initialPick + 1;
    const overallPick = (round - 1) * allTeams.length + pickInRound;
    picks.push(overallPick);
  }
  return picks;
}

function calculateTeamRating(team) {
  return team.roster.reduce((total, player) => total + player.rating, 0);
}

function generateSchedule() {
  const schedule = [];

  for (let week = 0; week < numberOfWeeks; week++) {
    const teams = [...allTeams];
    while (teams.length > 1) {
      const indexA = Math.floor(Math.random() * teams.length);
      const teamA = teams[indexA];
      teams.splice(indexA, 1);
      const indexB = Math.floor(Math.random() * teams.length);
      const teamB = teams[indexB];
      teams.splice(indexB, 1);
      schedule.push({ teamA, teamB, week: week + 1 });
    }
  }

  return schedule;
}


function calculateScore(teamA, teamB) {
  const scoreA = Math.floor((Math.random() * 7) * 3) + 10;
  const scoreB = Math.floor((Math.random() * 7) * 3) + 10;
  return { scoreA, scoreB };
}

function displayGameResult(game, containerId) {
  const gameResult = document.createElement("p");
  gameResult.textContent = `${game.teamA.name} ${game.scoreA} - ${game.scoreB} ${game.teamB.name}`;

  const container = document.getElementById(containerId);
  container.appendChild(gameResult);
}
document.getElementById("start-draft").addEventListener("click", () => {
  userPick = Math.floor(Math.random() * allTeams.length) + 1;
  const userPicks = getUserPicks(userPick, totalRounds).join(', ');
  document.getElementById("user-pick").textContent = userPicks;
  document.getElementById("start-draft").disabled = true;
  runDraft();
});
