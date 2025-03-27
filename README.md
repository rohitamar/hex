# Hex with Minimax AI

Web Application (Python, JavaScript) that implements the game of [Hex (or Nash)](https://en.wikipedia.org/wiki/Hex_(board_game)) against an AI. The plan is to build two AIs: one with minimax, second with MCTS. I don't plan on using a policy network; hence, this AI is purely tree and heuristic based search.

You (_the human_) go first (red), the computer goes second (blue). You (might) should be able to access the project [here.](https://hex.d1hjg2b0quixy.amplifyapp.com/).

Things that I could further improve:
- Cold start issue: MCTS performs poorly in the early game. 
- Currently using random rollout. Heuristic based rollout might make MCTS more powerful.

![Hex Image](https://github.com/rohitamar/hex/blob/main/img/heximage.png)
