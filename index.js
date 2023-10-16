const { starterPrompt } = require('./lib/cli');

const init = () => {
    console.log(`
    +---+---+---+---+---+---+---+---+
    | E | m | p | l | o | y | e | e |
    +---+---+---+---+---+---+---+---+
    | T | r | a | c | k | e | r |
    +---+---+---+---+---+---+---+

    `);
    starterPrompt();
};

init();