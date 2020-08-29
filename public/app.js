const form = document.querySelector('#shortUrlForm');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const { url, slug } = event.target;
  if (!url.value || !url.value.match(/^(https?):\/\/[^\s$.?#].[^\s]*$/gm)) {
    return;
  }
  console.log('here');
});
