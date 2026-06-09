import fs from "fs";
import csv from "csv-parser";

const INPUT_FILE = "/Users/trent/Desktop/IT/data/lichess_db_puzzle.csv";
const OUTPUT_FILE = "src/data/puzzle_1900.json";

const LIMIT = 5000;

const results = [];

fs.createReadStream(INPUT_FILE)
  .pipe(csv())
  .on("data", (row) => {
    const rating = Number(row.Rating);
    if (rating > 1900 && results.length < LIMIT) {
      results.push({
        id: row.PuzzleId,
        fen: row.FEN,
        moves: row.Moves.split(" "),
        rating: rating,
        themes: row.Themes.split(" "),
      });
    }
  })
  .on("end", () => {
    (fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2)),
      console.log("done"));
  });
