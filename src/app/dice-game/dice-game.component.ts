import {AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';

interface DiceOutcome {
  dice1Value: number;
  dice2Value: number;
  dice3Value: number;
  sum: number;
  index: number;
}

@Component({
  selector: 'app-dice-game',
  templateUrl: './dice-game.component.html',
  styleUrls: ['./dice-game.component.scss']
})
export class DiceGameComponent implements OnInit, AfterViewInit {

  public time: number;
  public isTimerStarted: boolean;
  public isStartDisabled: boolean;
  public isInputButtonDisabled = false;

  public diceOutcomeRows: DiceOutcome[] = [];
  public lastOutcome: DiceOutcome;
  public smallNum = 0;
  public largeNum = 0;
  public threeKindNum = 0;
  public twoKindNum = 0;
  public refreshSecond: number;

  private timerInterval;
  private rollDiceInterval;

  @ViewChild('inputTime') inputEle: ElementRef;
  @ViewChildren('radio') radios: QueryList<ElementRef>;

  constructor() {
  }

  ngOnInit() {
    this.isTimerStarted = false;
    this.isStartDisabled = true;
  }

  ngAfterViewInit(): void {
    this.inputEle.nativeElement.value = null;
  }

  onTimeChange(second: number) {

    this.onStopTimer();
    this.isStartDisabled = false;

    this.refreshSecond = second;
    this.time = second;

    this.inputEle.nativeElement.value = null;
  }

  onEnterTime() {
    if (this.inputEle.nativeElement.valueAsNumber > 0) {
      this.refreshSecond = this.inputEle.nativeElement.valueAsNumber;
      this.radios.forEach((radio) => {
        radio.nativeElement.checked = false;
      });

      this.isStartDisabled = false;
    }
  }


  onStartTimer() {
    this.isTimerStarted = true;
    this.isStartDisabled = true;
    this.time = this.refreshSecond;
    this.isInputButtonDisabled = true;

    this.timerInterval = setInterval(() => {
      if (this.time > 0) {
        this.time = this.time - 1;
      } else {
        this.time = this.refreshSecond;
      }
    }, 1000);

    this.rollDiceInterval = setInterval(() => {
      console.log('Roll Dices');

      const diceOutcome: DiceOutcome = {
        dice1Value: this.getRandomInt(6),
        dice2Value: this.getRandomInt(6),
        dice3Value: this.getRandomInt(6),
        sum: 0,
        index: 0
      };

      diceOutcome.sum = diceOutcome.dice1Value + diceOutcome.dice2Value + diceOutcome.dice3Value;
      diceOutcome.index = this.diceOutcomeRows.length + 1;

      this.lastOutcome = diceOutcome;
      // this.diceOutcomeRows.push(diceOutcome);
      this.diceOutcomeRows.unshift(diceOutcome);

      this.setDataAnalytic(diceOutcome);

    }, (this.refreshSecond + 1) * 1000);
  }

  onStopTimer() {
    clearInterval(this.timerInterval);
    clearInterval(this.rollDiceInterval);
    this.isTimerStarted = false;
    this.isStartDisabled = false;
    this.isInputButtonDisabled = false;
  }

  setDataAnalytic(lastOutCome: DiceOutcome) {

    const v1 = lastOutCome.dice1Value;
    const v2 = lastOutCome.dice2Value;
    const v3 = lastOutCome.dice3Value;

    if (v1 === v2 && v1 === v3 && v1 !== null) {
      this.threeKindNum++;
    } else if (lastOutCome.sum < 11) {
      this.smallNum++;
    } else if (lastOutCome.sum >= 11) {
      this.largeNum++;
    }

    if ((v1 === v2 && v1 !== v3) ||
      (v1 === v3 && v1 !== v2) ||
      (v2 === v3 && v2 !== v1)) {
      this.twoKindNum++;
    }
  }

  getRandomInt(max: number): number {
    return Math.floor(Math.random() * Math.floor(max)) + 1;
  }

  getSumColor(diceOutcome: DiceOutcome) {
    const color: Set<string> = new Set();

    const v1 = diceOutcome.dice1Value;
    const v2 = diceOutcome.dice2Value;
    const v3 = diceOutcome.dice3Value;

    if (v1 === v2 && v1 === v3 && v1 !== null) {
      color.add('green');
    } else if (diceOutcome.sum < 11) {
      color.add('red');
    } else if (diceOutcome.sum >= 11) {
      color.add('blue');
    }

    return color;
  }

  getDataColor(diceOutcome: DiceOutcome, index: number) {
    const color: Set<string> = new Set();

    const v1 = diceOutcome.dice1Value;
    const v2 = diceOutcome.dice2Value;
    const v3 = diceOutcome.dice3Value;

    switch (index) {
      case 1: {
        if (v1 === v2 && v1 === v3 && v1 !== null) {
          color.add('green');
        } else if (v1 === v2 && v1 !== v3) {
          color.add('yellow');
        } else if (v1 === v3 && v1 !== v2) {
          color.add('yellow');
        }
        break;
      }
      case 2: {
        if (v2 === v1 && v2 === v3 && v2 !== null) {
          color.add('green');
        } else if (v2 === v1 && v2 !== v3) {
          color.add('yellow');
        } else if (v2 === v3 && v2 !== v1) {
          color.add('yellow');
        }
        break;
      }
      case 3: {
        if (v3 === v2 && v1 === v3 && v3 !== null) {
          color.add('green');
        } else if (v3 === v2 && v3 !== v1) {
          color.add('yellow');
        } else if (v3 === v1 && v3 !== v2) {
          color.add('yellow');
        }
        break;
      }
      default: {
        break;
      }
    }

    return color;
  }
}
