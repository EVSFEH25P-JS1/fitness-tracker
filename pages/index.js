// Denna sida visar alla sparade träningspass – uppdelat i kommande och avklarade.
import { getWorkouts } from "../storage/workout.js";

// Vi hämtar containrarna där vi ska rendera passen
const upcomingWorkoutsContainer = document.getElementById("upcoming-workouts");
const completedWorkoutsContainer =
  document.getElementById("completed-workouts");

// Renderar ett enskilt träningspass som en <article> med övningslista
function renderWorkout(parent, index, workout) {
  const article = document.createElement("article");

  const h3 = document.createElement("h3");
  h3.textContent = workout.title + " (#" + (index + 1) + ")";

  // Vi använder en ordnad lista (<ol>) för övningarna
  const exercisesList = document.createElement("ol");

  for (const exercise of workout.exercises) {
    const exerciseItem = document.createElement("li");

    if (workout.completed) {
      // Om passet är avklarat visar vi loggade vs planerade värden (t.ex. "3/5 sets")
      exerciseItem.textContent =
        exercise.type +
        " (" +
        exercise.loggedSets +
        "/" +
        exercise.plannedSets +
        " sets) " +
        "(" +
        exercise.loggedRepetitions +
        "/" +
        exercise.plannedRepetitions +
        " reps) ";
    } else {
      // Annars visar vi bara de planerade värdena och tidsgränsen
      exerciseItem.textContent =
        exercise.type +
        " (" +
        exercise.plannedSets +
        " sets) " +
        "(" +
        exercise.plannedRepetitions +
        " reps) " +
        " (" +
        exercise.timeLimitSeconds +
        "s tidsgräns) ";
    }

    exercisesList.append(exerciseItem);
  }

  article.append(h3, exercisesList);

  // Kommande pass får en "Starta pass"-knapp
  if (!workout.completed) {
    const startWorkoutBtn = document.createElement("button");
    startWorkoutBtn.textContent = "Starta pass";

    // Temporär lösning bara för att testa completed-funktionalitet
    startWorkoutBtn.addEventListener("click", () => {
      const workouts = getWorkouts();
      // Vi hittar rätt pass via id och markerar det som avklarat
      const w = workouts.find((all) => all.id === workout.id);
      w.completed = true;
      // Vi renderar om med den uppdaterade listan
      renderWorkouts(workouts);
    });

    article.append(startWorkoutBtn);
  }

  // Vi lägger till article-elementet i rätt förälder-container
  parent.append(article);
}

// Renderar alla pass – sorterar dem i kommande vs avklarade
function renderWorkouts(workouts) {
  // Vi tömmer båda containrarna innan vi renderar om
  upcomingWorkoutsContainer.textContent = "";
  completedWorkoutsContainer.textContent = "";

  // Vi har separata index för varje kategori så numreringen stämmer
  let completedIndex = 0;
  let upcomingIndex = 0;
  let totalIndex = 0;
  for (const workout of workouts) {
    if (workout.completed) {
      renderWorkout(completedWorkoutsContainer, completedIndex, workout);
      completedIndex++;
    } else {
      renderWorkout(upcomingWorkoutsContainer, upcomingIndex, workout);
      upcomingIndex++;
    }

    totalIndex++;
  }
}

// Vi kör direkt när sidan laddas – hämta alla pass och rendera dem
const workouts = getWorkouts();
renderWorkouts(workouts);
