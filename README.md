# Hex with Minimax AI

Web Application (Python, JavaScript) that implements the game of [Hex (or Nash)](https://en.wikipedia.org/wiki/Hex_(board_game)) against an AI. The plan is to build two AIs: one with minimax, second with MCTS. I don't plan on using a policy network; hence, this AI is purely tree and heuristic based search. 

I also do want to point out that AWS API Gateway seems to enforce a 29s timeout, which makes MCTS with more than 300 iterations difficult to achieve. I'm actually not sure why you can only 300 iterations even on a 29s timeout. I ran it locally, and on my PC, you can run ~4000 iterations. Right now, I am thinking that it might because serverless computing probably wasn't a good idea for a intensive recursive algorithm. Even so, this doesn't really matter to me since I was just hosting the website for a proof-of-concept. Locally, I am running 10,000 iterations. 

As for rules and gameplay, it's on the website, but the gist is you go first (red), the computer goes second (blue). You (might) should be able to access the project [here.](https://hex.d1hjg2b0quixy.amplifyapp.com/).

Things that I could further improve:
- Cold start issue: MCTS performs poorly in the early game. 
- Currently using random rollout. Heuristic based rollout might make MCTS more powerful.

![Hex Image](https://github.com/rohitamar/hex/blob/main/img/heximage.png)
