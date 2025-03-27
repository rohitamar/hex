import random 
import math 
import copy 
from collections import defaultdict 

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
                
    def select(self):
        cur = self 
        while len(cur.avail_actions) == 0:
            # use UCT to select from self.children
            tot_N = sum(self.N.values())

        return cur 

    def uct(self):
        vals = [] * len(self.avail_actions)



    def expand(self):
        action = random.choice(self.avail_actions)

        new_grid = copy.deepcopy(self.grid)
        new_grid[action[0]][action[1]] = 'B'

        self.children[action] = Node(new_grid, prev_action=action, parent=self)
        return self.children[action]

    def backprop(self, reward, first_action, gamma): 
        G = reward
        self.N[first_action] += 1 
        self.Q[first_action] += 1 / self.N[first_action] * (G - self.Q[first_action])
        cur = self 

        while cur: 
            action = cur.prev_action
            cur = cur.parent 

            G = reward + gamma * G
            cur.N[action] += 1
            cur.Q[action] += (1 / cur.N[action]) * (G - cur.Q[action])


class MCTS:
    def __init__(self, grid):
        self.root_node = Node(grid, None) 
        self.num_iterations = 1000

    def run(self):
        for _ in range(self.num_iterations):
            new_node = self.root_node.select()
            child_node = new_node.expand()
            reward, first_action = self.simulate(child_node)
            child_node.backprop(reward)

    def simulate(self, node):
        
        # take the grid
        # and make random moves ???
        # and then check if either person wins
        # whoever wins, -1 or 1 (depending on who wins)
        # computer wins --> 1, player wins -1

        # first_action must be saved, rest don't matter


         
         



