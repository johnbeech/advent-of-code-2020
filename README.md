# Advent of Code 2020

My solutions for Advent of Code 2020.

## Setup


Clone this repo, then run `npm install` to install dependencies.


## Running

To run a solution by day, use:
```
npm start day1
```

If a solution exists for that day, then it will run with basic tests. If a solution does not exist, it will copy the template, and then try to download that day's puzzle input using [AOCD](https://github.com/wimglenn/advent-of-code-data).

If you don't have AOCD configured, populate `input.txt` with your solution input from the AOC website, and then start implementing your solution in the new folder for that day.

Once you have calculated a solution, you should manually submit your answer through the website.

## Explorer

A local webserver has been provided to browse the solutions, and optionally create web based visualisations to go with the code.

To start the server run: `npm run webserver` - a new hardcoded index.html will be generated each time you browse the index.

Solutions with visualisations can be browsed online at: [https://johnbeech.github.io/advent-of-code-2020/solutions/](https://johnbeech.github.io/advent-of-code-2020/solutions/)
