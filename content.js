// Function to replace ui-monospace with monospace
function replaceMonospaceFonts() {
  const target = [`ui-monospace`, `"Roboto Mono"`];
  document.querySelectorAll("*").forEach(function (element) {
    const currentFont = window.getComputedStyle(element).fontFamily;
    target.forEach(function (e) {
      if (currentFont.toLowerCase().includes(e.toLowerCase())) {
        element.style.setProperty("font-family", "monospace", "important");
      }
    });
  });
}

function replaceSansSerifFonts() {
  const target = [
    `"Segoe UI"`,
    `"Google Sans"`,
    `ui-sans-serif`,
    `Roboto`,
    `Arial`,
  ];
  document.querySelectorAll("*").forEach(function (element) {
    const currentFont = window.getComputedStyle(element).fontFamily;
    target.forEach(function (e) {
      console.log(`current font: ${currentFont.toLowerCase()}`);
      console.log(`elem: ${e.toLowerCase()}`);
      if (currentFont.toLowerCase().includes(e.toLowerCase())) {
        element.style.setProperty("font-family", "sans-serif", "important");
      }
    });
  });
}

class Mutex {
  constructor() {
    this.lock = Promise.resolve();
  }

  async acquire() {
    let release;
    const newLock = new Promise((resolve) => (release = resolve));
    const oldLock = this.lock;
    this.lock = newLock;
    await oldLock;
    return release;
  }
}

const mutex = new Mutex();

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Run initially
replaceMonospaceFonts();
replaceSansSerifFonts();

// Set up a MutationObserver to watch for DOM changes
const observer = new MutationObserver(async function (mutations) {
  const release = await mutex.acquire();
  try {
    replaceMonospaceFonts();
    replaceSansSerifFonts();
    await delay(2000);
  } finally {
    release();
  }
});

// Start observing the document with the configured parameters
observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ["style", "class"],
});
