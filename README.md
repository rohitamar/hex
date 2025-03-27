# Hex with Minimax AI

## Introduction 
Web Application (JS, Python) that implements the game of [Hex (or Nash)](https://en.wikipedia.org/wiki/Hex_(board_game)) against an AI. The plan is to build two AIs: one with minimax, second with MCTS. I don't plan on using a policy network; hence, this AI is purely tree and heuristic based search. I also do want to point out that AWS API Gateway seems to enforce a 29s timeout, which makes MCTS with more than 1000 iterations difficult to achieve. Locally, I am running 10,000 iterations. Anyhow, hosting this website was just for a proof-of-concept, so this doesn't matter much. 

You (_the human_) go first (red), the computer goes second (blue). You (might) should be able to access the project [here.](https://hex.d1hjg2b0quixy.amplifyapp.com/).

Things that I could further improve:
- Cold start issue: MCTS performs poorly in the early game. 
- Currently using random rollout. Heuristic based rollout might make MCTS more powerful.

![Hex Image](https://github.com/rohitamar/hex/blob/main/img/heximage.png)
