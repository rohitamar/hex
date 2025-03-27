# Hex with Minimax AI

## Introduction 
Web Application (JS, Python) that implements the game of [Hex (or Nash)](https://en.wikipedia.org/wiki/Hex_(board_game)) against an AI. The plan is to build two AIs: one with minimax, second with MCTS. I don't plan on using a policy network; hence, this AI is purely tree and heuristic based search.

You (might) should be able to access the project [here.](https://hex.d1hjg2b0quixy.amplifyapp.com/).

Things that I could further improve:
- Cold start issue: MCTS performs poorly in the early game. 
- Currently using random rollout. Heuristic based rollout might make MCTS more powerful.

![Hex Image](https://github.com/rohitamar/hex/blob/main/img/heximage.png)
