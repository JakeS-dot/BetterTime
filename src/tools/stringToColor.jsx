/********************************************************
 Name: str_to_color
 Description: create a hash from a string then generates a color
 Usage: alert('#'+str_to_color("Any string can be converted"));
 author: Brandon Corbin [code@icorbin.com]
 website: http://icorbin.com
 ********************************************************/

function stringToNeonColor(str, prc) {
  "use strict";

  // Check for optional lightness/darkness
  const adjustedPrc = typeof prc === "number" ? prc : -10;

  // Generate a Hash for the String
  const hash = function (word) {
    let h = 0;
    for (let i = 0; i < word.length; i++) {
      h = word.charCodeAt(i) + ((h << 5) - h);
    }
    return h;
  };

  // Change the darkness or lightness
  const shade = function (color, prc) {
    const num = parseInt(color, 16),
      amt = Math.round(2.55 * prc),
      R = (num >> 16) + amt,
      G = ((num >> 8) & 0x00ff) + amt,
      B = (num & 0x0000ff) + amt;
    return (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1);
  };

  // Convert init to an RGBA
  const int_to_rgba = function (i) {
    return (
      ((i >> 24) & 0xff).toString(16) +
      ((i >> 16) & 0xff).toString(16) +
      ((i >> 8) & 0xff).toString(16) +
      (i & 0xff).toString(16)
    );
  };

  return shade(int_to_rgba(hash(str)), adjustedPrc);
}
export { stringToNeonColor };
