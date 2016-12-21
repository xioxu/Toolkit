var ua = "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36";
var idxUrl = "https://search.jd.com/Search?keyword=%E7%A9%BA%E6%B0%94%E5%87%80%E5%8C%96%E5%99%A8&enc=utf-8&qrst=1&rt=1&stop=1&vt=2&wq=%E7%A9%BA%E6%B0%94%E5%87%80%E5%8C%96%E5%99%A8&stock=1&page={$page}&s={$start}&click=0";
var request = require("request");
var $ = require("cheerio");
var fs = require("fs");
var iconv = require('iconv-lite');
var cachAllProducts = {};


function getDetail(product,callback) {
  var optionsForIdx = {
    url: product.href,
    headers: {
      'User-Agent': ua
    },
    strictSSL: false,
    encoding: null
  };


  request(optionsForIdx, function (error, response, body) {
    var htmlContent = iconv.decode(body, 'GBK');

    var bodyDom = $.load(htmlContent);

    var rows = bodyDom("#product-detail-2 table tr");
    var detailItem = {};

    if (rows.length > 3) {
      rows.each((idx, row) => {
        var tds = $(row).find("td");

        if (tds.length > 1) {
          detailItem[tds.eq(0).text()] = tds.eq(1).text();
        }
      });

      if (callback) {
        callback(detailItem,product);
      }
    }else{
       delete cachAllProducts[product.sku];
    }
  });
}

  function doFetch(url){
 
          var optionsForIdx = {
      url: url,
      headers: {
        'User-Agent': ua
      }
    };

          request(optionsForIdx, function (error, response, body) {
      var allProducts = [];

      if (!error && response.statusCode == 200) {
        var bodyDom = $.load(body);

        var products = bodyDom("#J_goodsList li");

       
        products.each((idx, item) => {

           var sku = $(item).attr("data-sku");

          var alnk = $(item).find(".p-img a");

          var newProd = {};
          newProd.title = alnk.attr("title").trim();
          newProd.sku = sku;

          if (!cachAllProducts.hasOwnProperty(sku)) {
            cachAllProducts[sku] = 1;

            var href = alnk.attr("href");

            if (href.startsWith("http") || href.startsWith("https")) {
              newProd.href = href;
            } else {
              newProd.href = "https:" + href;
            }

            var strong = $(item).find(".p-price strong");
            newProd.price = strong.attr("data-price");
            allProducts.push(newProd);

            getDetail(newProd, (detail,x) => {
              var prodStr = x.title + "," + x.price + "," + x.sku;

              Object.keys(detail).forEach(function (key) {
                var val = detail[key];
                prodStr += "," + val
              });

              prodStr += "\r\n";

              fs.appendFile('./data.csv', prodStr, function (err) {
                if (err) {
                  console.log("write data wrong");
                } else {
                  //  console.log("write data done");
                }
              })
            });

          }else{
           //  console.log(newProd.title);
          }
        });
      }
    });
    }

function fetchProducts() {
  for (var i = 1; i < 30; i += 2) {
    var newUrl = idxUrl.replace("{$page}", i);
    newUrl = newUrl.replace("{$start}", ((i - 1) * 30 + 1));
    
    
    doFetch(newUrl);
  }
}

fs.writeFile('./data.csv', '\ufeff',err=>{
  fetchProducts();
});




