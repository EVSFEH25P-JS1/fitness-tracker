// Vår datamodell för ett träningspass
export class Workout {
  constructor(title, date, exercises) {
    // Vi använder Date.now() som id – det ger oss ett unikt nummer (millisekunder sedan 1970)
    // Perfekt som enkel id-lösning när vi inte har en databas
    this.id = Date.now();
    this.title = title;
    this.date = date;
    this.exercises = exercises;
    // Alla pass börjar som ej avklarade
    this.completed = false;
    this.startTime = null;
    this.endTime = null;
  }
}

// Vår datamodell för en enskild övning i ett pass
export class Exercise {
  // Vi definierar övningstyperna som "static" properties – de tillhör klassen, inte instansen
  // Det gör att vi kan använda dem utan att skapa ett objekt, t.ex. Exercise.SQUATS
  static SQUATS = "Squats";
  static BENCHPRESS = "Benchpress";
  static DEADLIFT = "Deadlift";
  static PUSHUPS = "Pushups";

  // En lista med alla typer, smidig att loopa över när vi bygger dropdowns
  static TYPES = [this.SQUATS, this.BENCHPRESS, this.DEADLIFT, this.PUSHUPS];

  constructor(type, sets, repetitions, timeLimitSeconds) {
    this.type = type;

    // Vi skiljer på planerade och loggade värden –
    // planned = vad vi tänker göra, logged = vad vi faktiskt gjorde
    this.plannedSets = sets;
    this.plannedRepetitions = repetitions;
    this.loggedSets = 0;
    this.loggedRepetitions = 0;

    this.timeLimitSeconds = timeLimitSeconds;
  }
}
