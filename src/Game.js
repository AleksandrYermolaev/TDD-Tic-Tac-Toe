export class Game {
  constructor() {
    this._board = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ];
    this._userMoveSymbol = 'x';
    this._computerMoveSymbol = '0';
    this._fieldSize = 3;
    this._history = [];
    this._userName = 'user';
    this._computerName = 'computer';
  }

  getState() {
    return this._board;
  };

  acceptUserMove(x, y) {
    if (!this._isCellFree(x, y)) {
      this._throwExeption('cell is already taken');
    }
    this._updateHistory(this._userName, x, y);
    this._updateBoard(x, y);
  };

  createComputerMove() {
    if (this._getFreeCellsCount() === 0) {
      return this._throwExeption('no cells available');
    }
    const [x, y] = this._getFreeRandomCoordinates();
    this._updateHistory(this._computerName, x, y);
    this._updateBoard(x, y, {
      symbol: this._computerMoveSymbol
    });
  }

  _updateBoard(x, y, config = {
    symbol: this._userMoveSymbol
  }) {
    this._board[x][y] = config.symbol;
  }

  _isCellFree(x, y) {
    return !this._board[x][y]
  }

  _throwExeption(msg) {
    throw new Error(msg);
  }

  getMoveHistory() {
    return this._history;
  }

  _updateHistory(turn, x, y) {
    this._history.push({ turn, x, y })
  }

  _getRandomCoordinate() {
    return Math.floor(Math.random() * (this._fieldSize - 0));
  }

  _getFreeRandomCoordinates() {
    let x = this._getRandomCoordinate()
    let y = this._getRandomCoordinate()

    while (!!this._board[x][y]) {
      x = this._getRandomCoordinate()
      y = this._getRandomCoordinate()
    }

    return [x, y]
  }

  _getFreeCellsCount() {
    return this._board.reduce((total, row) =>
      row.reduce((count, el) =>
        el === '' ? ++count : count, total), 0)
  }
}