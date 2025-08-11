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

  function validateAuditForm(form) {
    const checkboxes = form.querySelectorAll('input[name="audit_type[]"]');
    const isChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
    
    if (!isChecked) {
      showToast("Please select at least one audit type.", 'error');
      return false;
    }
    return true;
  }

  document.addEventListener("DOMContentLoaded", function () {
    const forms = document.querySelectorAll(".contact, .audit-form, .newsletter-form-inline");
    const loader = document.getElementById("form-loader");
    
    forms.forEach(function(form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        
        // Special validation for audit form
        if (form.classList.contains('audit-form')) {
          if (!validateAuditForm(form)) {
            return;
          }
        }
        
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

    // Add interactive checkbox behavior
    const checkboxItems = document.querySelectorAll('.checkbox-item');
    checkboxItems.forEach(item => {
      const checkbox = item.querySelector('input[type="checkbox"]');
      const label = item.querySelector('label');
      
      if (checkbox && label) {
        // Handle special case for "Complete Digital Audit"
        if (checkbox.value === 'all') {
          checkbox.addEventListener('change', function() {
            if (this.checked) {
              // Uncheck other options when "Complete" is selected
              checkboxItems.forEach(otherItem => {
                const otherCheckbox = otherItem.querySelector('input[type="checkbox"]');
                if (otherCheckbox && otherCheckbox.value !== 'all') {
                  otherCheckbox.checked = false;
                }
              });
              showToast("Complete Digital Audit selected - includes all 3 audits!", 'success');
            }
          });
        } else {
          // Uncheck "Complete" when individual options are selected
          checkbox.addEventListener('change', function() {
            if (this.checked) {
              const completeCheckbox = document.querySelector('input[value="all"]');
              if (completeCheckbox) {
                completeCheckbox.checked = false;
              }
            }
          });
        }
      }
    });
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

