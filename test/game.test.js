import { Game } from '../src/Game';

const initialGameBoard = [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
];

const userMoveSymbol = 'x';
const computerMoveSymbol = '0';
const userName = 'user';
const computerName = 'computer';
let game;

const fillCells = (game, config = {}) => {
  const { x = -1, y = -1 } = config;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (i !== x || j !== y) game.acceptUserMove(i, j);
    }
  }
};

const count = (arr, symbol) =>
  arr.reduce((result, row) => {
    return row.reduce((count, el) => {
      return el === symbol ? ++count : count
    }, result)
  }, 0);

beforeEach(() => { game = new Game() });

describe('Game', () => {
  it('Should return empty game board', () => {
    const board = game.getState();
    expect(board).toEqual(initialGameBoard);
  });

  it('Should writes user\'s symbol in cell with given coordinates', () => {
    const x = 1, y = 1;
    game.acceptUserMove(x, y);
    const board = game.getState();
    expect(board[x][y]).toEqual(userMoveSymbol);
  });

  it('Sholud throw an exeption when user moves in takes cell', () => {
    const x = 2, y = 2;
    game.acceptUserMove(x, y);
    expect(() => { game.acceptUserMove(x, y) }).toThrow('cell is already taken');
  });

  it('Game saves user\'s move in history', () => {
    const x = 1, y = 1;
    game.acceptUserMove(x, y);
    const history = game.getMoveHistory();
    expect(history).toEqual([{ turn: userName, x, y }]);
  });

  it('Game saves computers\'s move in history', () => {
    const mock = jest.spyOn(global.Math, 'random').mockReturnValue(0.5);
    game.createComputerMove();
    const history = game.getMoveHistory();
    expect(history).toEqual([{ turn: computerName, x: 1, y: 1 }]);
    mock.mockRestore();
  });

  it('Game saves 1 user\'s move and 1 computer\'s move in history', () => {
    const x = 1, y = 1;
    game.acceptUserMove(x, y);
    game.createComputerMove();
    const history = game.getMoveHistory();
    expect(history.length).toBe(2);
    expect(history[0].turn).toEqual(userName);
    expect(history[1].turn).toEqual(computerName);
  });

  it('Computer moves in randomly chosen cell', () => {
    const mock = jest.spyOn(global.Math, 'random').mockReturnValue(0.5);
    game.createComputerMove();
    const board = game.getState();
    expect(board[1][1]).toEqual(computerMoveSymbol);
    mock.mockRestore();
  });

  it('Computer moves in cell that is not taken', () => {
    fillCells(game, { x: 2, y: 2 });
    game.createComputerMove();
    const board = game.getState();
    expect(count(board, userMoveSymbol)).toBe(8);
    expect(count(board, computerMoveSymbol)).toBe(1);
    expect(board[2][2]).toEqual(computerMoveSymbol);
  });

  test('If there are no free cells computer throws an exception', () => {
    fillCells(game);
    const func = game.createComputerMove.bind(game)
    expect(func).toThrow('no cells available');
  })
});


