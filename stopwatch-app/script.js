/**
 * Stopwatch Web Application
 * 
 * A precision stopwatch with start, pause, reset, and lap functionality.
 * Features:
 * - High precision timing (10ms update interval)
 * - Pause/resume functionality using adjusted start time calculation
 * - Lap time recording and display
 * - Time format: HH:MM:SS.mmm (hours:minutes:seconds.milliseconds)
 * 
 * Key Implementation Details:
 * - Uses Date.now() for accurate time measurement
 * - Pause/resume works by adjusting startTime backwards by elapsedTime
 * - 10ms update interval provides smooth visual updates
 * - All times stored and calculated in milliseconds for precision
 */

// Global variables for stopwatch state management
let startTime = null;        // Timestamp when the timer was started (adjusted for pauses)
let elapsedTime = 0;         // Total elapsed time in milliseconds
let timerInterval = null;    // Reference to the setInterval timer for cleanup
let laps = [];              // Array to store lap times

// Get references to DOM elements for manipulation
const timeDisplay = document.getElementById("time-display");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const resetBtn = document.getElementById("reset-btn");
const lapBtn = document.getElementById("lap-btn");
const lapTimes = document.getElementById("lap-times");

/**
 * Formats milliseconds into HH:MM:SS.mmm format
 * @param {number} ms - Time in milliseconds to format
 * @returns {string} Formatted time string (e.g., "01:23:45.678")
 */
function formatTime(ms) {
  // Extract time components from milliseconds
  const milliseconds = Math.floor(ms % 1000);           // Get remaining milliseconds (0-999)
  const seconds = Math.floor(ms / 1000) % 60;           // Get seconds (0-59)
  const minutes = Math.floor(ms / (1000 * 60)) % 60;    // Get minutes (0-59)
  const hours = Math.floor(ms / (1000 * 60 * 60));      // Get hours (0+)
  
  // Format each component with leading zeros and return formatted string
  return (
    String(hours).padStart(2, "0") +
    ":" +
    String(minutes).padStart(2, "0") +
    ":" +
    String(seconds).padStart(2, "0") +
    "." +
    String(milliseconds).padStart(3, "0")              // Show 3 digits for milliseconds
  );
}

/**
 * Starts the stopwatch timer
 * The key logic here: startTime = Date.now() - elapsedTime
 * This allows the timer to resume from where it was paused by adjusting
 * the start time backwards by the already elapsed time.
 */
function startTimer() {
  // Calculate adjusted start time to account for any previous elapsed time
  // This is crucial for pause/resume functionality
  startTime = Date.now() - elapsedTime;
  
  // Update the display every 10ms for smooth visual updates
  // 10ms provides good balance between smoothness and performance
  timerInterval = setInterval(() => {
    elapsedTime = Date.now() - startTime;               // Calculate current elapsed time
    timeDisplay.textContent = formatTime(elapsedTime);  // Update the display
  }, 10); 
}

/**
 * Pauses the stopwatch timer
 * Stops the interval but preserves the elapsed time for resume functionality
 */
function pauseTimer() {
  clearInterval(timerInterval);  // Stop the timer updates
}

/**
 * Resets the stopwatch to initial state
 * Clears all timing data and lap records
 */
function resetTimer() {
  clearInterval(timerInterval);                    // Stop any running timer
  elapsedTime = 0;                                // Reset elapsed time
  laps = [];                                      // Clear lap records
  timeDisplay.textContent = "00:00:00.000";       // Reset display to initial state
  lapTimes.innerHTML = "";                        // Clear lap times from UI
}

/**
 * Records a lap time at the current elapsed time
 * Adds the lap to both the internal array and the UI display
 */
function recordLap() {
  laps.push(elapsedTime);                                           // Store lap time in array
  const lapItem = document.createElement("li");                     // Create new list item
  lapItem.textContent = `Lap ${laps.length}: ${formatTime(elapsedTime)}`;  // Set lap text
  lapTimes.appendChild(lapItem);                                    // Add to lap times list
}

// Event listeners for button interactions
startBtn.addEventListener("click", startTimer);    // Start/Resume the timer
pauseBtn.addEventListener("click", pauseTimer);    // Pause the timer
resetBtn.addEventListener("click", resetTimer);    // Reset timer and clear laps
lapBtn.addEventListener("click", recordLap);       // Record current time as a lap
