(function () {

  async function submitForm(form) {
    const formData = new FormData(form);
    const jsonData = {};
    formData.forEach((value, key) => {
      jsonData[key] = value;
    });

    try {
      const response = await fetch("https://calm-parts-attend.loca.lt/webhook/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(jsonData)
      });

      const result = await response.json();
      showToast(result.message || "Form submitted!", 'success');
      form.reset();
    } catch (error) {
      showToast("Something went wrong. Try again.", 'error');
      console.error(error);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".contact");
    const loader = document.getElementById("form-loader");
    
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (loader) loader.classList.add("show");
        submitForm(e.target).finally(() => {
          if (loader) loader.classList.remove("show");
        });
      });
    }
  });

  function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');
    if (!toast || !toastMsg) return;
    toastMsg.textContent = message;
    toast.className = `toast-notification show ${type}`;
    setTimeout(() => {
      toast.classList.remove('show');
    }, 6500);
  }

})();

