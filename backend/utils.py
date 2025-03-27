import ast 
from typing import List, Tuple
from collections import deque 

def parse_grid_string(grid_string):
    grid_string = grid_string.replace('W', '"W"').replace('B', '"B"').replace('R', '"R"')
    return ast.literal_eval(grid_string)

def bfs(grid: List[List[str]], src: List[Tuple[int, int]], color: str, endCondition: lambda x, y: bool) -> bool:
    
    assert color == 'B' or color == 'R', (
        'Incorrect value entered for color. Must be either B or R.'
    )

    q = deque(src)
    vis = set(src)
    N, M = len(grid), len(grid[0]) 

    def check(x, y):
        return 0 <= x < N and 0 <= y < M and (nx, ny) not in vis and grid[nx][ny] == color

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
        if endCondition(ux, uy): return True 
        for dx, dy in dirs:
            if dx == 0 and dy == 0: continue 
            nx, ny = ux + dx, uy + dy 
            if not check(nx, ny): continue
            q.append((nx, ny)) 
            vis.add((nx, ny))
    
    return False

def check_endgame(grid):
    src_red = [(0, i) for i in range(len(grid[0])) if grid[0][i] == 'R']
    red = bfs(grid, src_red, 'R', lambda x, y: x == len(grid) - 1) 

    src_blue = [(i, 0) for i in range(len(grid)) if grid[i][0] == 'B']
    blue = bfs(grid, src_blue, 'B', lambda x, y: y == len(grid[0]) - 1)
    
    end_state = 0 if not red and not blue else (-1 if red else 1)

    return end_state