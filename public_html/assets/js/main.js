(function () {

  async function submitForm(form) {
    const formData = new FormData(form);
    const jsonData = {};
    formData.forEach((value, key) => {
      jsonData[key] = value;
    });

    try {
      const response = await fetch("https://n8n-i8g8.onrender.com/webhook/submit-form", {
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
    const forms = document.querySelectorAll(".contact, .audit-form, .newsletter-form-inline");
    const loader = document.getElementById("form-loader");
    
    forms.forEach(function(form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (loader) loader.classList.add("show");
        submitForm(e.target).finally(() => {
          if (loader) loader.classList.remove("show");
        });
      });
    });

    // Fix for audit form select dropdown
    const auditSelect = document.querySelector('select[name="audit_type"]');
    if (auditSelect) {
      // Ensure the select is properly styled and functional
      auditSelect.style.pointerEvents = 'auto';
      auditSelect.style.position = 'relative';
      auditSelect.style.zIndex = '1000';
      
      // Add click event listener as backup
      auditSelect.addEventListener('click', function(e) {
        e.stopPropagation();
      });
      
      // Test functionality
      auditSelect.addEventListener('change', function() {
        console.log('Audit type changed to:', this.value);
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

