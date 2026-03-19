const jsonata = require('jsonata');

// eslint-disable-next-line no-unused-vars
/*
const expression = jsonata`Order[OrderID = "order104"].Product.{
      "Account": $AccName(),
  "SKU-" & $string(ProductID): $.ProductName
}`;
*/

// eslint-disable-next-line no-unused-vars
const expression2 = /* jsonata */`Order[OrderID = "order104"].Product.{
  "Account": $AccName(), /* this is a comment */
"SKU-" & $string(ProductID): $.ProductName
}`;
