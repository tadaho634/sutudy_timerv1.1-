let timerInterval;
let isBreak = false;
let remainingTime = 25 * 60; // 初期値は25分
let workMusicFile, breakMusicFile;

const minutesDisplay = document.getElementById("minutes");
const secondsDisplay = document.getElementById("seconds");
const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const resetButton = document.getElementById("resetButton");
const workMusicInput = document.getElementById("workMusic");
const breakMusicInput = document.getElementById("breakMusic");
const audioPlayer = document.getElementById("audioPlayer");
const levelDisplay = document.getElementById("level");
const progressBar = document.getElementById("progress");
const totalTimeDisplay = document.getElementById("totalTime");

// タイマーの表示を更新
function updateDisplay() {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    minutesDisplay.textContent = minutes.toString().padStart(2, "0");
    secondsDisplay.textContent = seconds.toString().padStart(2, "0");
}

// 音楽を切り替える
function switchMusic() {
    const musicFile = isBreak ? breakMusicFile : workMusicFile;
    if (musicFile) {
        audioPlayer.src = musicFile;
        audioPlayer.play();
    }
}

// タイマーのスタート
startButton.addEventListener("click", () => {
    if (!timerInterval) {
        timerInterval = setInterval(() => {
            if (remainingTime > 0) {
                remainingTime--;
                updateDisplay();
            } else {
                clearInterval(timerInterval);
                timerInterval = null;
                isBreak = !isBreak;
                remainingTime = isBreak ? 5 * 60 : 25 * 60;
                switchMusic();
            }
        }, 1000);
    }
});

// タイマーの一時停止
pauseButton.addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;
});

// タイマーのリセット
resetButton.addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;
    remainingTime = 25 * 60;
    isBreak = false;
    updateDisplay();
});

// 音楽ファイルの選択
workMusicInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        workMusicFile = URL.createObjectURL(file);
    }
});

breakMusicInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        breakMusicFile = URL.createObjectURL(file);
    }
});

// 勉強時間の記録を取得
async function fetchProgress() {
    const response = await fetch("/data");
    const data = await response.json();
    levelDisplay.textContent = `レベル: ${data.level}`;
    progressBar.style.width = `${(data.experience_points / (data.level * 100)) * 100}%`;
    totalTimeDisplay.textContent = `総勉強時間: ${Math.floor(data.total_study_time / 60)}分`;
}

// 勉強時間の記録を送信
async function saveProgress() {
    await fetch("/update", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ study_time: 25 * 60 })
    });
    fetchProgress();
}

// 初期化
updateDisplay();
fetchProgress();
