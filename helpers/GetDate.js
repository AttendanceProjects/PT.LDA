module.exports = () => {
  var IndoTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Jakarta"});
    IndoTime = new Date(IndoTime);
    return IndoTime
}