// Denna sida hanterar formuläret för att skapa ett nytt träningspass.
// Vi importerar våra modeller och storage-funktionen
import { Workout, Exercise } from "../models/workout.js";
import { addWorkout } from "../storage/workout.js";

// Vi hämtar alla DOM-element vi behöver jobba med.
// Vi gör det högst upp så att vi har dem tillgängliga i alla funktioner.
const titleInput = document.getElementById("title-input");
const dateInput = document.getElementById("date-input");
const addExerciseBtn = document.getElementById("add-exercise-btn");
const createExerciseForm = document.getElementById("create-exercise-form");
const exercisesContainer = document.getElementById("exercises-container");
const statusContainer = document.getElementById("status");

// Vår lokala array som håller koll på alla övningar användaren har lagt till.
// Varje element är ett objekt med { exercise, editable } –
// "editable" avgör om övningen visas som redigerbar eller sparad.
const exercises = [];

// Körs när användaren submittar formuläret (klickar "Spara")
function onCreateWorkout(event) {
  // Vi stoppar sidans default-reload som sker vid vanlig form submit
  event.preventDefault();

  // Validering: kontrollera att titel och datum är giltiga
  const title = titleInput.value;
  if (title.trim().length === 0) {
    setErrorStatus("Titel måste inkluderas.");
    return; // Vi avbryter tidigt om valideringen misslyckas
  }

  // Date.parse() returnerar NaN om strängen inte kan tolkas som ett datum
  const dateMs = Date.parse(dateInput.value);
  if (Number.isNaN(dateMs)) {
    setErrorStatus("Datumet är ogiltigt.");
    return;
  }

  const date = new Date(dateMs);

  // Vi skapar ett nytt Workout-objekt och skickar med bara Exercise-objekten
  // (inte editable-flaggan), därför mappar vi ut exercise.exercise
  const workout = new Workout(
    title,
    date,
    exercises.map((exercise) => exercise.exercise),
  );
  // Sparar till localStorage via vår storage-funktion
  addWorkout(workout);
  setSuccessStatus("Träningspass sparat!");

  // Vi rensar formuläret och listan efter sparning
  // .length = 0 tömmer arrayen utan att skapa en ny referens
  exercises.length = 0;
  exercisesContainer.textContent = "";
  titleInput.value = "";
  dateInput.value = "";
}

// Körs när användaren klickar "Lägg till" för att lägga till en ny övning
function onAddExercise() {
  // Vi skapar en ny övning med default-värden och markerar den som redigerbar
  exercises.push({
    exercise: new Exercise(Exercise.TYPES[0], 1, 1, 15),
    editable: true,
  });

  // Vi renderar om hela listan – enklare än att bara lägga till ett element
  renderExercises(exercises);
}

// Renderar alla övningar. Vi tömmer containern och bygger upp allt från scratch.
// Det är enklare att resonera kring än att försöka uppdatera enskilda element.
function renderExercises(exercises) {
  exercisesContainer.textContent = "";

  for (let i = 0; i < exercises.length; i++) {
    const exerciseEntry = exercises[i];

    // Beroende på editable-flaggan renderar vi olika vyer
    if (exerciseEntry.editable) {
      renderEditableExercise(exercises, i, exerciseEntry);
    } else {
      renderSavedExercise(exercises, i, exerciseEntry);
    }
  }
}

// Renderar en sparad (icke-redigerbar) övning – bara visar värdena som text
function renderSavedExercise(exercises, index, exerciseEntry) {
  const exercise = exerciseEntry.exercise;

  const article = document.createElement("article");

  const h3 = document.createElement("h3");
  // +1 eftersom vi vill visa 1-baserat index till användaren (inte 0-baserat)
  h3.textContent = "Övning #" + (index + 1);

  // Vi skapar ett div-element per fält för att visa informationen
  const typeDiv = document.createElement("div");
  const setsDiv = document.createElement("div");
  const repsDiv = document.createElement("div");
  const timeDiv = document.createElement("div");

  typeDiv.textContent = "Övning: " + exercise.type;
  setsDiv.textContent = "Sets: " + exercise.plannedSets;
  repsDiv.textContent = "Reps: " + exercise.plannedRepetitions;
  timeDiv.textContent = "Tidsgräns (s): " + exercise.timeLimitSeconds;

  // .append() kan ta emot flera element på en gång
  article.append(h3, typeDiv, setsDiv, repsDiv, timeDiv);
  exercisesContainer.append(article);
}

// Renderar en redigerbar övning – med inputs, dropdown och knappar
function renderEditableExercise(exercises, index, exerciseEntry) {
  const exercise = exerciseEntry.exercise;

  const article = document.createElement("article");

  const h3 = document.createElement("h3");
  h3.textContent = "Övning #" + (index + 1);

  // Vi bygger en <select> dropdown med alla övningstyper
  const typeSelector = document.createElement("select");
  for (const type of Exercise.TYPES) {
    const typeOption = document.createElement("option");
    typeOption.value = type;
    typeOption.textContent = type;
    typeSelector.append(typeOption);
  }

  // Vi sätter det valda värdet efter att alla options är tillagda
  typeSelector.value = exercise.type;

  // När användaren ändrar typ i dropdownen, uppdaterar vi exercise-objektet direkt
  typeSelector.addEventListener("input", (event) => {
    exercise.type = event.target.value;
  });

  // Labels för alla fält
  const typeLabel = document.createElement("label");
  const setsLabel = document.createElement("label");
  const repsLabel = document.createElement("label");
  const timeLabel = document.createElement("label");

  typeLabel.textContent = "Övning";
  setsLabel.textContent = "Sets";
  repsLabel.textContent = "Repetitioner";
  timeLabel.textContent = "Tidsgräns (s)";

  // Input-fält för siffervärden
  const setsInput = document.createElement("input");
  const repsInput = document.createElement("input");
  const timeInput = document.createElement("input");

  // Vi sätter startvärden – "" + tal konverterar numret till en sträng
  setsInput.value = "" + exercise.plannedSets;
  repsInput.value = "" + exercise.plannedRepetitions;
  timeInput.value = "" + exercise.timeLimitSeconds;

  // Hjälpfunktion som parsar input-värdet till ett heltal och sparar det
  // på rätt property. Vi använder bracket notation (exercise[propertyName])
  // så att vi kan återanvända samma funktion för alla tre inputs.
  const updateNumberInput = (element, propertyName) => {
    const value = Number.parseInt(element.value);
    if (Number.isNaN(value)) {
      // TODO: Show error
      return;
    }

    exercise[propertyName] = value;
  };

  // Vi lyssnar på "input"-eventet – det triggas varje gång värdet ändras
  setsInput.addEventListener("input", (event) =>
    updateNumberInput(event.target, "plannedSets"),
  );
  repsInput.addEventListener("input", (event) =>
    updateNumberInput(event.target, "plannedRepetitions"),
  );
  timeInput.addEventListener("input", (event) =>
    updateNumberInput(event.target, "timeLimitSeconds"),
  );

  // "Spara övning"-knappen – växlar till sparad vy genom att sätta editable = false
  const saveExerciseBtn = document.createElement("button");
  saveExerciseBtn.textContent = "Spara övning";
  // type="button" förhindrar att knappen submittar formuläret (default är "submit")
  saveExerciseBtn.type = "button";

  saveExerciseBtn.addEventListener("click", () => {
    exerciseEntry.editable = false;
    renderExercises(exercises);
  });

  // "Radera övning"-knappen – tar bort övningen ur arrayen med splice
  const deleteExerciseBtn = document.createElement("button");
  deleteExerciseBtn.textContent = "Radera övning";
  deleteExerciseBtn.type = "button";

  deleteExerciseBtn.addEventListener("click", () => {
    // splice(index, 1) tar bort 1 element på position index
    exercises.splice(index, 1);
    renderExercises(exercises);
  });

  // Vi lägger alla element i article-elementet i rätt ordning
  article.append(
    h3,
    typeLabel,
    typeSelector,
    setsLabel,
    setsInput,
    repsLabel,
    repsInput,
    timeLabel,
    timeInput,
    saveExerciseBtn,
    deleteExerciseBtn,
  );

  exercisesContainer.append(article);
}

// Hjälpfunktioner för att visa status-meddelanden (error/success).
// Vi lägger till/tar bort CSS-klasser så att vi kan styla dem olika.
function setErrorStatus(message) {
  statusContainer.textContent = message;
  statusContainer.classList.add("error");
  statusContainer.classList.remove("success");
}

function setSuccessStatus(message) {
  statusContainer.textContent = message;
  statusContainer.classList.remove("error");
  statusContainer.classList.add("success");
}

// Vi kopplar event listeners till formuläret och "Lägg till"-knappen
// "submit" triggas när användaren klickar på Spara-knappen i formuläret
createExerciseForm.addEventListener("submit", onCreateWorkout);
addExerciseBtn.addEventListener("click", onAddExercise);
