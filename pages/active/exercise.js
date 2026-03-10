import { timePretty } from "../../utilities/time.js";
import { activeWorkout } from "./workout.js";

const activeExerciseTimerEl = document.getElementById("exercise-timer");
const activeExerciseH2 = document.querySelector("#active-exercise h2");
const activeExerciseStartBtn = document.getElementById("start-exercise");
const activeExerciseForm = document.getElementById("active-exercise-form");
const activeExerciseSetsEl = document.getElementById("active-exercise-sets");
const activeExerciseRepsEl = document.getElementById("active-exercise-reps");

export function startExerciseSet(exercise) {
  let timer = Date.now() + exercise.timeLimitSeconds * 1000;
  activeExerciseTimerEl.textContent = timePretty(
    exercise.timeLimitSeconds * 1000,
  );

  activeWorkout.exerciseTimer = setInterval(() => {
    const now = Date.now();
    const diff = timer - now;

    activeExerciseTimerEl.textContent = timePretty(diff);

    if (diff <= 0) {
      completeExerciseSet(exercise);
    }
  }, 1000);
}

function completeExerciseSet(exercise) {
  clearInterval(activeWorkout.exerciseTimer);

  activeExerciseTimerEl.textContent = "Klar";

  exercise.loggedSets += 1;

  const repsInput = document.createElement("input");
  const repsSave = document.createElement("button");

  repsInput.value = exercise.plannedRepetitions;
  repsSave.textContent = "Välj antal reps";

  repsSave.addEventListener("click", () => {
    const reps = Number.parseInt(repsInput.value);
    if (Number.isNaN(reps)) {
      return;
    }

    exercise.loggedRepetitions += reps;
    activeWorkout.exerciseTimer = null;
    renderActiveExercise(exercise);
    repsInput.remove();
    repsSave.remove();
  });

  activeExerciseForm.append(repsInput, repsSave);
}

export function renderExercises(exercises, activeExerciseIndex) {
  renderActiveExercise(exercises[activeExerciseIndex]);
  for (let i = activeExerciseIndex + 1; i < exercises.length; i++) {
    const exercise = exercises[i];
    renderUpcomingExercise(exercise);
  }
}

export function renderActiveExercise(exercise) {
  activeExerciseH2.textContent = exercise.type;
  activeExerciseSetsEl.textContent = "Sets: " + exercise.loggedSets;
  activeExerciseRepsEl.textContent =
    "Totala reps: " + exercise.loggedRepetitions;

  if (!activeWorkout.exerciseTimer) {
    activeExerciseStartBtn.disabled = false;
  } else {
    activeExerciseStartBtn.disabled = true;
  }
}

function renderUpcomingExercise(exercise) {}
