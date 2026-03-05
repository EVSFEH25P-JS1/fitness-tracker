// Här hanterar vi all kommunikation med localStorage.
// Vi samlar storage-logiken på ett ställe så att resten av appen
// inte behöver veta hur datan sparas – den bara anropar dessa funktioner.

// Lägger till ett nytt träningspass i localStorage
export function addWorkout(workout) {
  // Vi hämtar först alla befintliga pass
  const workouts = getWorkouts();
  // Lägger till det nya passet i arrayen
  workouts.push(workout);
  // Sparar tillbaka hela arrayen – localStorage kan bara lagra strängar,
  // så vi måste konvertera till JSON med JSON.stringify()
  localStorage.setItem("workouts", JSON.stringify(workouts));
}

// Hämtar alla träningspass från localStorage
export function getWorkouts() {
  const workouts = localStorage.getItem("workouts");

  // Om det inte finns något sparat ännu, returnerar vi en tom array
  // så att resten av koden alltid kan räkna med att få tillbaka en array
  if (workouts === null) {
    return [];
  }

  // Vi parsar JSON-strängen tillbaka till ett JavaScript-objekt (array)
  return JSON.parse(workouts);
}

// function removeWorkoutById(workoutId) {}
