const zeroPoint = (req, res) => {
  console.log("home route");
  // res.send("hello");
  const data = "sahos Data";
  res.render("home", { data: false });
};

module.exports = { zeroPoint };
