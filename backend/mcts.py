import random 
import math 

class Node:
    def __init__(self, grid, parent=None):
        
        self.grid = grid 
        self.children = {} # action --> Node
        self.parent = parent
        self.Q = {} # action --> Q(s, a)
        self.N = {} 
        self.avail_actions = 0
        
        for i in range(len(self.grid)):
            for j in range(len(self.grid[0])):
                if grid[i][j] == 'W':
                    self.avail_actions += 1
                
    def select(self):
        cur = self 
        while cur.avail_actions == 0:
            # basically use self.children to select one i think
            child = random.choice(self.children.values())
            cur = child

        return None 
    
    def expand(self):
        pass 

    def backprop(self):
        pass 

class MCTS:
    def __init__(self):
        pass 

    def simulate(self, node):
        pass 



