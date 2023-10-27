const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send(`\
  <script>(() => {
    location.href = "https://ggrbk.github.io/";
  })();</script>
  `);
})

app.get("/:q", async (req, res) => {
  // #以降の文字列を取得
  const hash = (req.params.q || "").replace(/&/g, "%26").replace(/\"/g, "%22");
  console.log("hash is " + hash);

  let ogtitle = "";
  let ogdescription = "";
  // GoogleAPIを用いて検索結果を取得
  try {
    const response = await fetch("https://www.googleapis.com/customsearch/v1?key=AIzaSyCCpKYlHvd81Za8mNfXmv04cmAtp0CcwDE&cx=471781583b19d4c94&cx=471781583b19d4c94&lr=lang_ja&q=" + hash);
    const json = await response.json();
    console.log(json);
    const item = json.items[0];

    if (item.title) {
      ogtitle = "<meta property='og:title' content='" + item.title + "'>";
    }
    if (item.snippet) {
      ogdescription = "<meta property='og:description' content='" + item.snippet + "'>";
    }
  } catch (e) {
    console.error(e);
  }
  res.send(`\
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GooglingGo!Japan</title>
  <meta id="themeColor" name="theme-color" content="#2196f3">
  ${ogtitle}
  ${ogdescription}
  <meta property="og:type" content="website">
  <script>
    const ggr = () => {
      location.href = "https://www.google.com/search?q=" + "${hash}";
    };
  </script>
</head>
<body onload="ggr();">
</body>
</html>
`);
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}!`);
});
