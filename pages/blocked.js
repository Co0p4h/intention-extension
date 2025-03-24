async function get_quote() {
  const response = await fetch('https://animechan.io/api/v1/quotes/random', { mode: 'no-cors' });
  const data = await response.json();
  // console.log(data, "datatatata");

  document.getElementById("quote").innerHTML = `"${data.quote}"`;
  document.getElementById("character").innerHTML = `-${data.character}`;
  document.getElementById("anime").innerHTML = `(${data.anime})`;
}

window.onload = get_quote;
get_quote();