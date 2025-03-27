from typing import List 
import math 
from collections import deque 

from utils import check_endgame

def count_needed(grid: List[List[str]], color: str):
    q = deque()
    dist = [[math.inf] * len(grid[0]) for _ in range(len(grid))]

    # note that len(grid) == len(grid[0])
    if color == 'R':
        for i in range(len(grid[0])):
            if grid[0][i] == color:
                q.appendleft((0, i))
                dist[0][i] = 0
            else:
                q.append((0, i))
                dist[0][i] = 1
    else:
        for i in range(len(grid)):
            if grid[i][0] == color:
                q.appendleft((i, 0))
                dist[i][0] = 0
            else:
                q.append((i, 0))
                dist[i][0] = 1

    def check(x, y):
        return 0 <= x < len(grid) and 0 <= y < len(grid[0]) and (grid[x][y] == 'W' or grid[x][y] == color)
    
    dirs = [
        [0, 1],
        [1, 0],
        [-1, 0],
        [0, -1],
        [1, -1],
        [-1, 1]
    ]

    while q:
        ux, uy = q.popleft()
        for dx, dy in dirs:
            nx, ny = ux + dx, uy + dy 
            if not check(nx, ny): continue 
            weight = 0 if grid[nx][ny] == color else 1 
            if dist[ux][uy] + weight < dist[nx][ny]:
                dist[nx][ny] = dist[ux][uy] + weight 
                if weight == 1:
                    q.append((nx, ny))
                else:
                    q.appendleft((nx, ny))
        
    mn = len(grid)
    if color == 'R':
        for i in range(len(grid[0])):
            mn = min(mn, dist[len(grid) - 1][i])
    else:
        for i in range(len(grid)):
            mn = min(mn, dist[i][len(grid[0]) - 1])
    
    return mn

def need_heuristic(grid,):
    return count_needed(grid, 'R') - count_needed(grid, 'B')

def minimax_alg(grid, depth, player, alpha, beta):
    if all(grid[i][j] != 'W' for i in range(len(grid)) for j in range(len(grid[0]))):
        return -1, -1, need_heuristic(grid)

    end_state = check_endgame(grid)

    if end_state == -1:
        return -1, -1, math.inf 
    elif end_state == -1: 
        return -1, -1, -math.inf 
    
    if depth == 0:
        return -1, -1, need_heuristic(grid) 

    pos_x = pos_y = -1
    best = -math.inf if player else math.inf
    for i in range(len(grid)):
        for j in range(len(grid[0])):
            if grid[i][j] != 'W': 
                continue 
           
            grid[i][j] = 'B' if player else 'R'
            _, _, heur = minimax_alg(grid, depth - 1, not player, alpha, beta)
            grid[i][j] = 'W'
            
            if (player and heur > best) or (not player and heur < best):
                pos_x, pos_y, best =  i, j, heur

            if player:
                alpha = max(alpha, best)
                if best >= beta:
                    return pos_x, pos_y, best 
            else:
                beta = min(beta, best)
                if best <= alpha:
                    return pos_x, pos_y, best

    return pos_x, pos_y, best
    
