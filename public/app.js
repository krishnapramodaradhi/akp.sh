const form = document.querySelector('#shortLinkForm');
const errorMsg = document.querySelector('#errorMsg');
const successMsg = document.querySelector('#success');
const submitBtn = document.querySelector('#submitBtn');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const { url, slug } = event.target;
  try {
    submitBtn.disabled = true;
    if (!url.value || !url.value.match(/^(https?):\/\/[^\s$.?#].[^\s]*$/gm)) {
      return handleError('Please provide a valid URL');
    }
    const response = await fetch('/url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ url: url.value, slug: slug.value }),
    });
    const actualResponse = await response.json();
    let message;
    if (actualResponse.statusCode && actualResponse.statusCode !== 200) {
      if (!actualResponse.data) {
        message = `${actualResponse.message}`;
      } else if (actualResponse.data.length === 2) {
        const [first, second] = actualResponse.data;
        message = `
            <div>${actualResponse.message}</div>
            <ol>
              <li>${first.msg}: ${first.param}</li>
              <li>${second.msg}: ${second.param}</li>
            </ol>
          `;
      } else {
        const [error] = actualResponse.data;
        message = `${actualResponse.message} - ${error.msg}: ${error.param}`;
      }
      return handleError(message);
    }
    successMsg.innerHTML = `Shortened Link - 
    <a class="shortLink" href=${window.location.protocol}//${window.location.host}/${actualResponse.slug}>${window.location.protocol}//${window.location.host}/${actualResponse.slug}</a>`;
    const span = document.createElement('span');
    successMsg.appendChild(span);
    span.innerHTML = 'X';
    span.className = 'close';
    span.onclick = function () {
      successMsg.innerHTML = '';
      successMsg.className = 'success-rm';
    };
    successMsg.className = 'success';
  } catch (error) {
    console.error(error);
  } finally {
    url.value = '';
    slug.value = '';
    submitBtn.disabled = false;
  }
});

function handleError(message) {
  errorMsg.innerHTML = message;
  errorMsg.className = 'error';
  return setTimeout(() => {
    errorMsg.innerHTML = '';
    errorMsg.className = 'error-rm';
  }, 4000);
}
