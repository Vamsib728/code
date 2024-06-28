var ajaxCall = (key, url, prompt) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: url,
      type: "POST",
      dataType: "json",
      data: JSON.stringify({
        model: "gpt-3.5-turbo-instruct",
        prompt: prompt,
        max_tokens: 1024,
        n: 1,
        temperature: 0.5,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      crossDomain: true,
      success: function (response, status, xhr) {
        resolve({ response, status, xhr });
      },
      error: function (xhr, status, error) {
        const err = new Error('XHR error');
        err.status = xhr.status;
        reject(err);
      },
    });
  });
};

const url = "https://api.openai.com/v1";

(function () {
  const template = document.createElement("template");
  template.innerHTML = `
    <style>
      /* Add any custom styles here */
      #root {
        width: 100%;
        height: 100%;
      }
    </style>
    <div id="root">
      <!-- Your widget's HTML content goes here -->
    </div>
  `;

  class MainWebComponent extends HTMLElement {
    async post(apiKey, endpoint, prompt) {
      try {
        const { response } = await ajaxCall(apiKey, `${url}/${endpoint}`, prompt);
        console.log(response.choices[0].text);
        return response.choices[0].text;
      } catch (error) {
        console.error('Error calling API:', error);
        throw error; // Re-throw the error to propagate it
      }
    }
  }

  customElements.define("custom-widget", MainWebComponent);
})();