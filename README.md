# Hex with Minimax AI

Web Application (Python, JavaScript) that implements the game of [Hex (or Nash)](https://en.wikipedia.org/wiki/Hex_(board_game)) against an AI. The plan is to build two AIs: one with minimax, second with MCTS. I don't plan on using a policy network; hence, this AI is purely tree and heuristic based search. 

You (might) should be able to access the project [here.](https://hex.d1hjg2b0quixy.amplifyapp.com/).

I do want to point out that AWS API Gateway seems to enforce a 29s timeout, which makes running MCTS with a large number of iterations difficult to achieve. I was only able to perofrm 300 iterations on the Amplify hosted backend, which is surprising even on a 29s timeout. I ran it locally, and on my PC, you can run ~6000 iterations. Perhaps, serverless computing probably wasn't a good idea for an intensive recursive algorithm, and maybe the Lambda CPUs are not too good. Even so, this doesn't really matter to me since I was just hosting the website for a proof-of-concept. Locally, I am running 10,000 iterations.

As for rules and gameplay, it's on the website, but the gist is you go first (red), the computer goes second (blue). You are trying to connect a line of red hexagons from top to bottom while simultaneously preventing the computer from connecting a line of blue hexagons from left to right. There is a slight advantage with going first (that's why you go first), and a draw is not possible in this game.

Things that I could further improve:
- Cold start issue: MCTS performs poorly in the early game. 
- Currently using random rollout. Heuristic based rollout might make MCTS more powerful.

![Hex Image](https://github.com/rohitamar/hex/blob/main/img/heximage.png)
