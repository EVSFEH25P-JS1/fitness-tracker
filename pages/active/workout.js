import { getWorkouts } from "../../storage/workout.js";
import { timePretty } from "../../utilities/time.js";
import {
  renderActiveExercise,
  renderExercises,
  startExerciseSet,
} from "./exercise.js";

const searchParams = new URLSearchParams(window.location.search);
const workoutId = Number.parseInt(searchParams.get("workoutId"));

const h1 = document.querySelector("h1");
const workoutTimerEl = document.getElementById("workout-timer");
const activeExerciseStartBtn = document.getElementById("start-exercise");

export const activeWorkout = {
  workout: null,
  activeExerciseIndex: 0,
  exerciseTimer: null,
};

if (Number.isNaN(workoutId)) {
  h1.textContent = "Error loading workout";
} else {
  const workouts = getWorkouts();
  activeWorkout.workout = workouts.find((all) => all.id === workoutId);
  if (!activeWorkout.workout) {
    h1.textContent = "Workout not found";
  } else {
    startWorkout();
  }
}

activeExerciseStartBtn.addEventListener("click", () => {
  if (activeWorkout.exerciseTimer) {
    return;
  }

  const exercise =
    activeWorkout.workout.exercises[activeWorkout.activeExerciseIndex];
  startExerciseSet(exercise);
  renderActiveExercise(exercise);
});

function startWorkout() {
  h1.textContent = activeWorkout.workout.title;

  startWorkoutTimer();
}

function startWorkoutTimer() {
  activeWorkout.workout.startTime = Date.now();
  setInterval(() => {
    const now = Date.now();
    const diff = now - activeWorkout.workout.startTime;

    workoutTimerEl.textContent = timePretty(diff);
  }, 1000);
}

renderExercises(
  activeWorkout.workout.exercises,
  activeWorkout.activeExerciseIndex,
);
