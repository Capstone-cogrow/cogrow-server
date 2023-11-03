const axios = require("axios");
const cheerio = require("cheerio");
const express = require('express');
const app = express();

const cors = require('cors');

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const crop = "옥수수";

const getHtml = async () => {
  try {
    return await axios.get("https://www.2bob.co.kr/search_list.php?a=result_recipe&fKeyValue=" + crop);
  } catch (error) {
    console.error(error);
  }
};

getHtml()
  .then(html => {
    const $ = cheerio.load(html.data);
    const RecipeList = $("div.contain > div.search_con > div > ul > li");
    const recipeListData = RecipeList
      .map((index, div) => ({
        id: index,
        link: 'https://www.2bob.co.kr'+ $(div).find("a").attr('href'),
        img_url: 'https://www.2bob.co.kr/'+ $(div).find("a > div.img_wrap > img").attr('src'),
        sub_title: $(div).find("a > div.text_box > p.s_title").text(),
        title: $(div).find("a > div.text_box > p.b_title").text(),
      }))
      .toArray();
    console.log(recipeListData);

    app.get('/api/recipe', (req, res) => {
        res.json(recipeListData);
    });
  });

app.listen(3000, () => {
    console.log('server start!!');
});