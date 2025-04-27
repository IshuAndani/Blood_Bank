module.exports = function cleanString(str) {
    return str.trim().replace(/\s+/g, ' ');
}
// This function takes a string as input, trims leading and trailing whitespace, and replaces multiple spaces with a single space.
  