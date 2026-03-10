import { getWorkouts } from "../storage/workout.js";

const searchParams = new URLSearchParams(window.location.search);
const workoutId = Number.parseInt(searchParams.get("workoutId"));

const h1 = document.querySelector("h1");

let workout = null;

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

function startWorkout() {}
