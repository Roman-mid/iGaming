const getGata = async () => {
  const res = await fetch('http://localhost:3000/test');
  const data = await res.json();

  console.log(data);
};

getGata();
