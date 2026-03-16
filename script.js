class Stopwatch {
  constructor() {
    // Initialize properties
    this.startTime = 0;
    this.elapsedTime = 0;
    this.timerInterval = null;
    this.isRunning = false;
    this.lapTimes = [];
    this.lapCounter = 0;

    // Wait for DOM to be ready before initializing
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.init());
    } else {
      this.init();
    }
  }

  init() {
    try {
      this.initializeElements();
      this.attachEventListeners();
      this.updateDisplay();
      console.log("Stopwatch initialized successfully");
    } catch (error) {
      console.error("Error initializing stopwatch:", error);
    }
  }

  initializeElements() {
    // Get DOM elements with error checking
    this.display = this.getElement("display");
    this.startBtn = this.getElement("startBtn");
    this.pauseBtn = this.getElement("pauseBtn");
    this.resetBtn = this.getElement("resetBtn");
    this.lapBtn = this.getElement("lapBtn");
    this.lapList = this.getElement("lapList");

    // Verify all elements exist
    if (
      !this.display ||
      !this.startBtn ||
      !this.pauseBtn ||
      !this.resetBtn ||
      !this.lapBtn ||
      !this.lapList
    ) {
      throw new Error("One or more required DOM elements not found");
    }
  }

  getElement(id) {
    const element = document.getElementById(id);
    if (!element) {
      console.error(`Element with id '${id}' not found`);
    }
    return element;
  }

  attachEventListeners() {
    // Use arrow functions to maintain 'this' context
    this.startBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.start();
    });

    this.pauseBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.pause();
    });

    this.resetBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.reset();
    });

    this.lapBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.recordLap();
    });

    // Add keyboard support
    document.addEventListener("keydown", (e) => this.handleKeyPress(e));
  }

  handleKeyPress(event) {
    // Add keyboard shortcuts
    switch (event.code) {
      case "Space":
        event.preventDefault();
        if (this.isRunning) {
          this.pause();
        } else {
          this.start();
        }
        break;
      case "KeyR":
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          this.reset();
        }
        break;
      case "KeyL":
        if (this.isRunning) {
          event.preventDefault();
          this.recordLap();
        }
        break;
    }
  }

  start() {
    try {
      if (!this.isRunning) {
        this.startTime = performance.now() - this.elapsedTime;
        this.timerInterval = setInterval(() => this.updateDisplay(), 10);
        this.isRunning = true;

        this.updateButtonStates();
        console.log("Stopwatch started");
      }
    } catch (error) {
      console.error("Error starting stopwatch:", error);
    }
  }

  pause() {
    try {
      if (this.isRunning) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.isRunning = false;

        this.updateButtonStates();
        console.log("Stopwatch paused");
      }
    } catch (error) {
      console.error("Error pausing stopwatch:", error);
    }
  }

  reset() {
    try {
      // Clear any existing interval
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }

      // Reset all properties
      this.isRunning = false;
      this.elapsedTime = 0;
      this.startTime = 0;
      this.lapTimes = [];
      this.lapCounter = 0;

      // Update display and UI
      this.updateDisplay();
      this.updateLapDisplay();
      this.updateButtonStates();

      console.log("Stopwatch reset");
    } catch (error) {
      console.error("Error resetting stopwatch:", error);
    }
  }

  recordLap() {
    try {
      if (this.isRunning) {
        this.lapCounter++;
        const lapTime = this.elapsedTime;

        // Add lap with additional metadata
        this.lapTimes.push({
          number: this.lapCounter,
          time: lapTime,
          timestamp: new Date().toISOString(),
        });

        this.updateLapDisplay();
        console.log(
          `Lap ${this.lapCounter} recorded: ${this.formatTime(lapTime)}`
        );
      }
    } catch (error) {
      console.error("Error recording lap:", error);
    }
  }

  updateDisplay() {
    try {
      if (this.isRunning) {
        this.elapsedTime = performance.now() - this.startTime;
      }

      const formattedTime = this.formatTime(this.elapsedTime);
      if (this.display) {
        this.display.textContent = formattedTime;

        // Add/remove running animation class
        if (this.isRunning) {
          this.display.classList.add("running");
        } else {
          this.display.classList.remove("running");
        }
      }
    } catch (error) {
      console.error("Error updating display:", error);
    }
  }

  updateLapDisplay() {
    try {
      if (!this.lapList) return;

      if (this.lapTimes.length === 0) {
        this.lapList.innerHTML =
          '<div class="no-laps">No lap times recorded yet</div>';
        return;
      }

      // Create lap items HTML with error handling
      const lapItemsHTML = this.lapTimes
        .slice()
        .reverse()
        .map((lap) => {
          const formattedTime = this.formatTime(lap.time);
          return `
                        <div class="lap-item" data-lap="${lap.number}">
                            <span class="lap-number">Lap ${lap.number}</span>
                            <span class="lap-time">${formattedTime}</span>
                        </div>
                    `;
        })
        .join("");

      this.lapList.innerHTML = lapItemsHTML;
    } catch (error) {
      console.error("Error updating lap display:", error);
      if (this.lapList) {
        this.lapList.innerHTML =
          '<div class="no-laps">Error displaying lap times</div>';
      }
    }
  }

  updateButtonStates() {
    try {
      if (this.startBtn) this.startBtn.disabled = this.isRunning;
      if (this.pauseBtn) this.pauseBtn.disabled = !this.isRunning;
      if (this.lapBtn) this.lapBtn.disabled = !this.isRunning;
      if (this.resetBtn) this.resetBtn.disabled = false; // Reset is always available
    } catch (error) {
      console.error("Error updating button states:", error);
    }
  }

  formatTime(milliseconds) {
    try {
      // Ensure milliseconds is a valid number
      const ms = Math.max(0, Math.floor(milliseconds));

      const totalSeconds = Math.floor(ms / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      const centiseconds = Math.floor((ms % 1000) / 10);

      // Use padStart for consistent formatting
      return `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}:${centiseconds.toString().padStart(2, "0")}`;
    } catch (error) {
      console.error("Error formatting time:", error);
      return "00:00:00";
    }
  }

  // Public method to get current state (useful for debugging)
  getState() {
    return {
      isRunning: this.isRunning,
      elapsedTime: this.elapsedTime,
      formattedTime: this.formatTime(this.elapsedTime),
      lapCount: this.lapTimes.length,
      lapTimes: this.lapTimes.map((lap) => ({
        number: lap.number,
        formattedTime: this.formatTime(lap.time),
      })),
    };
  }

  // Public method to destroy the stopwatch (cleanup)
  destroy() {
    try {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }

      // Remove event listeners
      document.removeEventListener("keydown", this.handleKeyPress);

      console.log("Stopwatch destroyed");
    } catch (error) {
      console.error("Error destroying stopwatch:", error);
    }
  }
}

// Initialize the stopwatch when the page loads
let stopwatchInstance = null;

// Function to initialize stopwatch
function initializeStopwatch() {
  try {
    if (stopwatchInstance) {
      stopwatchInstance.destroy();
    }
    stopwatchInstance = new Stopwatch();
  } catch (error) {
    console.error("Failed to initialize stopwatch:", error);
  }
}

// Multiple initialization methods to ensure compatibility
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeStopwatch);
} else {
  initializeStopwatch();
}

// Fallback initialization
window.addEventListener("load", () => {
  if (!stopwatchInstance) {
    initializeStopwatch();
  }
});

// Export for module systems (if needed)
if (typeof module !== "undefined" && module.exports) {
  module.exports = Stopwatch;
}

// Global access for debugging
window.Stopwatch = Stopwatch;
window.stopwatchInstance = stopwatchInstance;
