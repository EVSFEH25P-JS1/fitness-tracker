import { getWorkouts } from "../storage/workout.js";

const searchParams = new URLSearchParams(window.location.search);
const workoutId = Number.parseInt(searchParams.get("workoutId"));

const h1 = document.querySelector("h1");
const workoutTimerEl = document.getElementById("workout-timer");

let workout = null;
let activeExerciseIndex = 0;

if (Number.isNaN(workoutId)) {
  h1.textContent = "Error loading workout";
} else {
  const workouts = getWorkouts();
  workout = workouts.find((all) => all.id === workoutId);
  if (!workout) {
    h1.textContent = "Workout not found";
  } else {
    startWorkout();
  }
}

function startWorkout() {
  h1.textContent = workout.title;

  startWorkoutTimer();
}

function startWorkoutTimer() {
  workout.startTime = Date.now();
  setInterval(() => {
    const now = Date.now();
    const diff = now - workout.startTime;
    const minutes = Math.floor(diff / 1000 / 60);
    const remaining = diff - minutes * 60 * 1000;
    const seconds = Math.floor(remaining / 1000);

    workoutTimerEl.textContent =
      ("" + minutes).padStart(2, "0") + ":" + ("" + seconds).padStart(2, "0");
  }, 1000);
}

function renderExercises(exercises) {
  renderActiveExercise(exercises[activeExerciseIndex]);
  for (let i = activeExerciseIndex + 1; i < exercises.length; i++) {
    const exercise = exercises[i];
    renderUpcomingExercise(exercise);
  }
}

function renderActiveExercise(exercise) {}

function renderUpcomingExercise(exercise) {}
