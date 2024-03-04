async function get_quote() {
  const response = await fetch('https://animechan.xyz/api/random');
  const data = await response.json();
  document.getElementById("quote").innerHTML = `"${data.quote}"`;
  document.getElementById("character").innerHTML = `-${data.character}`;
  document.getElementById("anime").innerHTML = `(${data.anime})`;
}

window.onload = get_quote;