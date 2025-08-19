
const formatPercentage = (value, prefix = 4) => {
  const floatValue = parseFloat(value || 0);
  return !isNaN(floatValue) ? floatValue.toFixed(prefix) + "%" : "";
};

const formatCurrency = (value,decimalCount = 2) => {
  try {
    let num = parseFloat(
        (value || "").toString().replace("$", "").replace(",", "")
      )
        ?.toFixed(decimalCount)
        .toString(),
      numParts = num.split("."),
      dollars = numParts[0],
      cents = numParts[1] || "",
      sign = num == (num = Math.abs(num));
 
    dollars = dollars.replace(/\$|\,/g, "");
 
    if (isNaN(dollars)) dollars = "0";
 
    dollars = dollars.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
 
    let val =
      "$" +
      ((sign ? "" : "-") +
        dollars +
        (decimalCount ? (cents ? "." + cents : ".00") : ""));
 
    val = val.replaceAll("--", "");
 
    if (["$-0.00", "$-0"].includes(val)) val = "$0.00";
 
    return val;
  } catch (error) {
    console.error("Error form formatCurrency ===> ", error);
  }
};
 
export { formatPercentage, formatCurrency };