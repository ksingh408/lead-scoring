const { parse } = require("csv-parse/sync");

function parseCsvBuffer(buffer) {
  const text = buffer.toString();
  const records = parse(text, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
  return records;
}

module.exports = { parseCsvBuffer };
