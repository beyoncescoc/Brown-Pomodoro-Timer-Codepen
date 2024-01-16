class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      intervalID: null,
      countdown: 1500,
      'session-length': 25,
      'break-length': 5,
      running: false,
      isSession: true };

    this.handleClick = this.handleClick.bind(this);
    this.handleToggleStartStop = this.handleToggleStartStop.bind(this);
    this.handleResetTimer = this.handleResetTimer.bind(this);
    this.startTime = this.startTime.bind(this);
    this.runTime = this.runTime.bind(this);
    this.timerControl = this.timerControl.bind(this);
  }

  handleClick(e) {
    const value = e.target.parentNode.attributes.for.value;
    if (this.state.running) {
      return;
    }
    if (value === "session-length") {
      if (e.target.textContent === '-' && this.state[value] > 1) {
        this.setState({
          [value]: this.state[value] - 1,
          countdown: this.state.countdown - 60 });

      } else if (e.target.textContent === '+' && this.state[value] < 60) {
        this.setState({
          [value]: this.state[value] + 1,
          countdown: this.state.countdown + 60 });

      }
    } else {
      if (e.target.textContent === '-' && this.state[value] > 1) {
        this.setState({
          [value]: this.state[value] - 1 });

      } else if (e.target.textContent === '+' && this.state[value] < 60) {
        this.setState({
          [value]: this.state[value] + 1 });

      }
    }
  }

  handleToggleStartStop() {
    if (this.state.running) {
      this.setState({ running: false });
      this.state.intervalID && clearInterval(this.state.intervalID);
    } else {
      this.startTime();
      this.setState({ running: true });
    }
  }

  startTime() {
    this.setState({
      intervalID: setInterval(() => {
        this.runTime();
        this.timerControl();
      }, 1000) });

  }

  runTime() {
    this.setState({ countdown: this.state.countdown - 1 });
  }

  timerControl() {
    let timer = this.state.countdown;
    this.buzzer(timer);
    if (timer < 0) {
      if (this.state.isSession) {
        this.state.intervalID && clearInterval(this.state.intervalID);
        this.startTime();
        this.switchTimer(this.state["break-length"] * 60, false);
      } else {
        this.state.intervalID && clearInterval(this.state.intervalID);
        this.startTime();
        this.switchTimer(this.state["session-length"] * 60, true);
      }
    }
  }

  buzzer(_timer) {
    if (_timer === 0) {
      this.audioBeep.play();
    }
  }

  switchTimer(num, str) {
    this.setState({
      countdown: num,
      isSession: str });

  }

  handleResetTimer() {
    this.setState({
      'session-length': 25,
      'break-length': 5,
      running: false,
      isSession: true,
      countdown: 1500,
      intervalID: null });

    this.state.intervalID && clearInterval(this.state.intervalID);
    this.audioBeep.pause();
    this.audioBeep.currentTime = 0;
  }

  render() {
    return /*#__PURE__*/(
      React.createElement("div", { className: "container" }, /*#__PURE__*/
      React.createElement(SetTimers, {
        sessionTime: this.state['session-length'],
        breakTime: this.state['break-length'],
        setTime: this.handleClick }), /*#__PURE__*/
      React.createElement(Timer, {
        label: this.state.isSession,
        running: this.state.running,
        time: this.state.countdown }), /*#__PURE__*/
      React.createElement(Buttons, {
        startStopTimer: this.handleToggleStartStop,
        resetTimer: this.handleResetTimer,
        running: this.state.running }), /*#__PURE__*/
      React.createElement("audio", { id: "beep", preload: "auto",
        src: "https://drive.google.com/uc?export=view&id=1hxyx8yo0VdrBjqDNNHNWZtcKeTOLmtU_",
        ref: audio => {this.audioBeep = audio;} })));


  }}


class SetTimers extends React.Component {
  render() {
    const timers = {
      session: {
        id: 'session-length',
        name: 'Session',
        label: 'session-label',
        inc: 'session-increment',
        dec: 'session-decrement',
        value: this.props.sessionTime },

      break: {
        id: 'break-length',
        name: 'Break',
        label: 'break-label',
        inc: 'break-increment',
        dec: 'break-decrement',
        value: this.props.breakTime } };


    return /*#__PURE__*/(
      React.createElement("div", { className: "setter" }, /*#__PURE__*/
      React.createElement(SetTimer, { values: timers.session, setTime: this.props.setTime }), /*#__PURE__*/
      React.createElement(SetTimer, { values: timers.break, setTime: this.props.setTime })));


  }}



const SetTimer = props => {
  return /*#__PURE__*/(
    React.createElement("div", null, /*#__PURE__*/
    React.createElement("label", { htmlFor: props.values.id }, /*#__PURE__*/
    React.createElement("p", { id: props.values.label }, props.values.name), /*#__PURE__*/
    React.createElement("button", { className: "minus", id: props.values.dec, onClick: props.setTime }, "-"), /*#__PURE__*/
    React.createElement("span", { id: props.values.id }, props.values.value), /*#__PURE__*/
    React.createElement("button", { className: "plus", id: props.values.inc, onClick: props.setTime }, "+"))));



};


class Timer extends React.Component {
  render() {
    const secs = this.props.time % 60;
    const mins = Math.floor(this.props.time / 60);
    return /*#__PURE__*/(
      React.createElement("div", null, /*#__PURE__*/
      React.createElement("div", { className: "timer" }, /*#__PURE__*/
      React.createElement("div", { className: "time", id: "time-left" },
      (mins > 9 ? mins : '0' + mins) + ':' + (secs > 9 ? secs : '0' + secs)), /*#__PURE__*/

      React.createElement("div", { className: "filler" })), /*#__PURE__*/

      React.createElement("p", { id: "timer-label" }, this.props.label ? 'Session' : 'Break')));


  }}


class Buttons extends React.Component {
  render() {
    return /*#__PURE__*/(
      React.createElement("div", { class: "buttons" }, /*#__PURE__*/
      React.createElement("button", { className: this.props.running ? 'pause' : 'start', id: "start_stop", onClick: this.props.startStopTimer }, this.props.running ? 'Pause' : 'Start'), /*#__PURE__*/
      React.createElement("button", { className: "stop", id: "reset", onClick: this.props.resetTimer }, "Reset")));


  }}


ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById('root'));