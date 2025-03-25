import ast 
from typing import List, Tuple
from collections import deque 

def parse_grid_string(grid_string):
    grid_string = grid_string.replace('W', '"W"').replace('B', '"B"').replace('R', '"R"')
    return ast.literal_eval(grid_string)

def bfs(grid, src: List[Tuple[int, int]], endCondition: lambda x, y: bool, color: str) -> bool:
    
    assert color == 'B' or color == 'R', (
        'Incorrect value entered for color. Must be either B or R.'
    )

    q = deque(src)
    vis = set(src)
    N, M = len(grid), len(grid[0]) 

    def check(x, y):
        return 0 <= x < N and 0 <= y < M

    while q:
        ux, uy = q.popleft()
        if endCondition(ux, uy): return True 
        for dx in range(-1, 2):
            for dy in range(-1, 2):
                if dx != dy: continue 
                nx, ny = ux + dx, ny + dy 
                if not check(nx, ny): continue
                if (nx, ny) not in vis and grid[nx][ny] == color:
                    q.push((nx, ny)) 
                    vis.add((nx, ny))
    
    return False