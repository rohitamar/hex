import random 
import math 
import copy 
from collections import defaultdict 
from utils import check_endgame

class Node:
    def __init__(self, grid, *, prev_action, parent):
        self.grid = grid 
        self.children = {} # action --> Node
        self.parent = parent
        self.prev_action = prev_action

        self.Q = defaultdict(int) # action --> Q(s, a)
        self.N = defaultdict(int)
        self.avail_actions = []
        
        for i in range(len(self.grid)):
            for j in range(len(self.grid[0])):
                if grid[i][j] == 'W':
                    self.avail_actions.append((i, j))
        
    def argmax_action(self):
        return max(self.Q, key=self.Q.get)

    def select(self):
        cur = self 
        while len(cur.avail_actions) == 0:
            vals = cur.uct() 
            action = max(vals, key = vals.get)
            cur = cur.children[action]
        return cur 

    def uct(self):
        C = math.sqrt(2)
        self.vals = {}
        tot_N = sum(self.N.values())
        for action in self.children.keys():
            self.vals[action] = self.Q[action] + C * math.sqrt(math.log(tot_N) / self.N[action])
        return self.vals
    
    def expand(self):
        action = random.choice(self.avail_actions)
        self.avail_actions.remove(action)

        new_grid = copy.deepcopy(self.grid)
        new_grid[action[0]][action[1]] = 'B'

        self.children[action] = Node(new_grid, prev_action=action, parent=self)
        return self.children[action]

    def backprop(self, reward, first_action, *, gamma): 
        G = reward
        self.N[first_action] += 1 
        self.Q[first_action] += 1 / self.N[first_action] * (G - self.Q[first_action])
        cur = self 
        while cur and cur.parent: 
            action = cur.prev_action
            cur = cur.parent 
            G *= gamma 
            cur.N[action] += 1
            cur.Q[action] += (1 / cur.N[action]) * (G - cur.Q[action])

class MCTS:
    def __init__(self, grid):
        self.root_node = Node(grid, prev_action=None, parent=None) 
        self.num_iterations = 10000

    def run(self):
        for _ in range(self.num_iterations):
            new_node = self.root_node.select()
            child_node = new_node.expand()
            reward, first_action = self.simulate(child_node)
            child_node.backprop(reward, first_action, gamma=0.9)
        
        return self.root_node.argmax_action()

    def simulate(self, node):
        
        possible_actions = random.sample(node.avail_actions, len(node.avail_actions))
        first_action = possible_actions[-1]
        grid = copy.deepcopy(node.grid)

        player = 'B'

        while (endstate := check_endgame(grid)) == 0:
            x, y = possible_actions.pop()
            grid[x][y] = player 
            player = 'R' if player == 'B' else 'B'
        
        return endstate, first_action


