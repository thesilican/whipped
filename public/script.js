// Because Safari Dumb
try {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioCtx = new AudioContext();
} catch {}
const audio = new Audio("whipped.mp3");

let threshold = 10;
function setHandler() {
  const handler = (e) => {
    const x = e.acceleration.x;
    const y = e.acceleration.y;
    const z = e.acceleration.z;
    const dist = Math.hypot(x, y, z);
    if (dist >= threshold) {
      audio.play();
    }
  };
  window.addEventListener("devicemotion", handler, true);
}

const button = document.querySelector("button");
button.addEventListener("click", () => {
  audio.play();
});

const cover = document.querySelector(".cover");
cover.addEventListener("click", () => {
  cover.remove();
  if (window.DeviceMotionEvent) {
    if (typeof window.DeviceMotionEvent.requestPermission === "function") {
      window.DeviceMotionEvent.requestPermission()
        .then((response) => {
          if (response === "granted") {
            setHandler();
          }
        })
        .catch(() => {
          alert("There was an error granting permission to use accelerometer");
        });
    } else {
      setHandler();
    }
  } else {
    alert("Your device doesn't have an accelerometer :(");
  }
});

const input = document.querySelector("input");
const sensitivity = document.querySelector(".sensitivity");
function render() {
  const value = parseInt(input.value, 10);
  try {
    window.localStorage.setItem("whipped-sensitivity", value.toString());
  } catch {}
  sensitivity.innerText = `Shake Sensitivity: ${value.toFixed(0)}%`;
  threshold = value === 0 ? Infinity : 100 - value;
}
input.addEventListener("input", () => {
  render();
});
let value;
try {
  const store = window.localStorage.getItem("whipped-sensitivity");
  value = parseInt(store, 10);
} catch {}
if (!(value >= 0 && value <= 100)) {
  value = 50;
}
input.value = value;
render();
