import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const startBtn = document.querySelector('[data-start]');
const fieldsValue = document.querySelectorAll('.field');
const daysElement = fieldsValue[0].firstElementChild;
const hoursElement = fieldsValue[1].firstElementChild;
const minutesElement = fieldsValue[2].firstElementChild;
const secondsElement = fieldsValue[3].firstElementChild;
let delta = 0;
let intervalId;
let userSelectedDate;
let timerStarted = false;
let zerosDisplayed = false;
startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0].getTime();
    delta = userSelectedDate - Date.now();

    if (delta > 0) {
      startBtn.disabled = false;
      zerosDisplayed = true;

      if (timerStarted) {
        startTimer();
      }

      startBtn.addEventListener('click', startTimer);
    } else {
      startBtn.disabled = true;
      iziToast.error({
        message: 'Please choose a date in the future',
        messageColor: '#fff',
        messageSize: '16',
        messageLineHeight: '',
        backgroundColor: '#ef4040',
        icon: 'x',
        position: "topRight"
      });

      delta = 0;
      if (!timerStarted) {
        daysElement.textContent = '00';
        hoursElement.textContent = '00';
        minutesElement.textContent = '00';
        secondsElement.textContent = '00';
        zerosDisplayed = false;
      }
    }
  },
};

const input = document.querySelector('#datetime-picker');
flatpickr(input, options);

function setDateToField(delta) {
  if (zerosDisplayed) {
    daysElement.textContent = convertMs(delta).days.toString().padStart(2, '0');
    hoursElement.textContent = convertMs(delta).hours.toString().padStart(2, '0');
    minutesElement.textContent = convertMs(delta).minutes.toString().padStart(2, '0');
    secondsElement.textContent = convertMs(delta).seconds.toString().padStart(2, '0');
  }
}

function startTimer() {
  if (!timerStarted && zerosDisplayed) {
    input.disabled = true;
    startBtn.disabled = true;
    timerStarted = true;

    setDateToField(delta);

    intervalId = setInterval(() => {
      delta -= 1000;
      setDateToField(delta);

      if (delta <= 0) {
        stopTimer();
      }
    }, 1000);
  }
}

function stopTimer() {
  clearInterval(intervalId);
  input.disabled = false;
  startBtn.disabled = true;
  timerStarted = false;
  zerosDisplayed = false;
  daysElement.textContent = '00';
  hoursElement.textContent = '00';
  minutesElement.textContent = '00';
  secondsElement.textContent = '00';
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}