// Sudoku generator and validator

// Function to generate a valid Sudoku puzzle
export function generateSudoku(difficulty: "easy" | "medium" | "hard" = "medium") {
    // Create an empty 9x9 grid
    const grid: (number | null)[][] = Array(9)
      .fill(null)
      .map(() => Array(9).fill(null))
  
    // Fill the grid with a valid solution
    fillGrid(grid)
  
    // Create a copy of the filled grid as the solution
    const solution = JSON.parse(JSON.stringify(grid))
  
    // Remove numbers based on difficulty to create the puzzle
    const cellsToRemove = {
      easy: 30,
      medium: 40,
      hard: 50,
    }
  
    // Remove numbers randomly
    let count = cellsToRemove[difficulty]
    while (count > 0) {
      const row = Math.floor(Math.random() * 9)
      const col = Math.floor(Math.random() * 9)
      if (grid[row][col] !== null) {
        grid[row][col] = null
        count--
      }
    }
  
    return { puzzle: grid, solution }
  }
  
  // Function to fill the grid with a valid solution using backtracking
  function fillGrid(grid: (number | null)[][]) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === null) {
          // Try each number 1-9
          const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9])
          for (const num of numbers) {
            if (isValidPlacement(grid, row, col, num)) {
              grid[row][col] = num
  
              // Recursively try to fill the rest of the grid
              if (fillGrid(grid)) {
                return true
              }
  
              // If we couldn't fill the grid with this number, backtrack
              grid[row][col] = null
            }
          }
  
          // If no number works, we need to backtrack
          return false
        }
      }
    }
  
    // If we've filled all cells, we're done
    return true
  }
  
  // Function to check if a number can be placed at a specific position
  export function isValidPlacement(grid: (number | null)[][], row: number, col: number, num: number) {
    // Check row
    for (let c = 0; c < 9; c++) {
      if (grid[row][c] === num) {
        return false
      }
    }
  
    // Check column
    for (let r = 0; r < 9; r++) {
      if (grid[r][col] === num) {
        return false
      }
    }
  
    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3
    const boxCol = Math.floor(col / 3) * 3
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        if (grid[r][c] === num) {
          return false
        }
      }
    }
  
    return true
  }
  
  // Function to shuffle an array (Fisher-Yates algorithm)
  function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }
  
  // Function to check if a board is valid
  export function isBoardValid(board: (number | null)[][]) {
    // Check rows
    for (let row = 0; row < 9; row++) {
      const seen = new Set<number>()
      for (let col = 0; col < 9; col++) {
        const value = board[row][col]
        if (value === null) return false
        if (seen.has(value)) return false
        seen.add(value)
      }
    }
  
    // Check columns
    for (let col = 0; col < 9; col++) {
      const seen = new Set<number>()
      for (let row = 0; row < 9; row++) {
        const value = board[row][col]
        if (value === null) return false
        if (seen.has(value)) return false
        seen.add(value)
      }
    }
  
    // Check 3x3 boxes
    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        const seen = new Set<number>()
        for (let row = boxRow * 3; row < boxRow * 3 + 3; row++) {
          for (let col = boxCol * 3; col < boxCol * 3 + 3; col++) {
            const value = board[row][col]
            if (value === null) return false
            if (seen.has(value)) return false
            seen.add(value)
          }
        }
      }
    }
  
    return true
  }
  
  // Function to check if a solution is correct
  export function checkSolution(board: (number | null)[][], solution: number[][]) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] !== solution[row][col]) {
          return false
        }
      }
    }
    return true
  }
  