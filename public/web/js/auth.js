$(document).ready(function () {
  'use strict';

  // --- Regex Validators ---
  const REGEX = {
    // Name: letters, spaces, hyphens, periods, apostrophes, 3-60 chars
    name: /^[a-zA-Z\s\.\'\-]{3,60}$/,
    // Email standard RFC format
    email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/,
    // Indian Mobile Number: 10 digits starting with 6, 7, 8, or 9 (optional +91, 91, or 0 prefix)
    indianMobile: /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/,
    // Clean 10 digits extractor
    digitsOnly: /\D/g
  };

  // --- Password Strength Evaluator ---
  function evaluatePasswordStrength(password) {
    let score = 0;
    const rules = {
      length: password.length >= 8 && password.length <= 64,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };

    // Count met criteria
    if (rules.length) score += 1;
    if (rules.lowercase) score += 1;
    if (rules.uppercase) score += 1;
    if (rules.number) score += 1;
    if (rules.special) score += 1;

    let strength = 'none';
    let label = 'Too short';
    let cssClass = '';

    if (password.length === 0) {
      strength = 'none';
      label = '';
      cssClass = '';
    } else if (score <= 2) {
      strength = 'weak';
      label = 'Weak';
      cssClass = 'strength-weak';
    } else if (score === 3 || score === 4) {
      strength = 'fair';
      label = 'Moderate';
      cssClass = 'strength-fair';
    } else if (score === 5 && password.length < 12) {
      strength = 'good';
      label = 'Strong';
      cssClass = 'strength-good';
    } else if (score === 5 && password.length >= 12) {
      strength = 'strong';
      label = 'Very Strong';
      cssClass = 'strength-strong';
    }

    return { score, rules, strength, label, cssClass };
  }

  // --- UI Password Strength Meter Update ---
  function updatePasswordMeter(passwordInput) {
    const val = $(passwordInput).val() || '';
    const result = evaluatePasswordStrength(val);
    const container = $(passwordInput).closest('.password-field-group');

    const indicator = container.find('.strength-indicator');
    const label = container.find('.strength-text');

    // Update progress bar
    indicator.removeClass('strength-weak strength-fair strength-good strength-strong');
    if (result.cssClass) {
      indicator.addClass(result.cssClass);
    }
    label.text(result.label);

    // Update rule checklist icons
    container.find('[data-rule="length"]').toggleClass('met', result.rules.length);
    container.find('[data-rule="letter"]').toggleClass('met', result.rules.lowercase && result.rules.uppercase);
    container.find('[data-rule="number"]').toggleClass('met', result.rules.number);
    container.find('[data-rule="special"]').toggleClass('met', result.rules.special);

    // Update checklist icons
    container.find('.password-requirements li').each(function () {
      const isMet = $(this).hasClass('met');
      const icon = $(this).find('i');
      if (isMet) {
        icon.removeClass('bi-circle fa-circle fa-regular').addClass('bi-check-circle-fill fa-solid fa-circle-check text-success');
      } else {
        icon.removeClass('bi-check-circle-fill fa-solid fa-circle-check text-success').addClass('bi-circle fa-regular fa-circle');
      }
    });

    return result;
  }

  // Listen to password input events
  $(document).on('input keyup', '.password-meter-input', function () {
    updatePasswordMeter(this);
  });

  // --- Show / Hide Password Toggle ---
  $(document).on('click', '.btn-password-toggle', function () {
    const btn = $(this);
    const targetInput = btn.siblings('input');
    const icon = btn.find('i');

    if (targetInput.attr('type') === 'password') {
      targetInput.attr('type', 'text');
      icon.removeClass('bi-eye fa-eye').addClass('bi-eye-slash fa-eye-slash');
      btn.attr('aria-label', 'Hide password');
    } else {
      targetInput.attr('type', 'password');
      icon.removeClass('bi-eye-slash fa-eye-slash').addClass('bi-eye fa-eye');
      btn.attr('aria-label', 'Show password');
    }
  });

  // --- Field Validator Helpers ---
  function validateField(input) {
    const $el = $(input);
    const id = $el.attr('id') || $el.attr('name');
    const val = ($el.val() || '').trim();
    let isValid = true;
    let message = '';

    // If element is not required and empty, consider valid unless specific rules apply
    const isRequired = $el.prop('required') || $el.attr('data-required') === 'true';

    // Full Name
    if ($el.hasClass('validate-name')) {
      if (!val) {
        isValid = false;
        message = 'Full name is required.';
      } else if (val.length < 3) {
        isValid = false;
        message = 'Full name must be at least 3 characters.';
      } else if (!REGEX.name.test(val)) {
        isValid = false;
        message = 'Name should only contain letters and standard punctuation.';
      }
    }

    // Email
    else if ($el.hasClass('validate-email')) {
      if (!val) {
        isValid = false;
        message = 'Email address is required.';
      } else if (!REGEX.email.test(val)) {
        isValid = false;
        message = 'Please enter a valid email address (e.g., name@example.com).';
      }
    }

    // Mobile (Indian format)
    else if ($el.hasClass('validate-mobile')) {
      const cleanDigits = val.replace(REGEX.digitsOnly, '');
      if (!val) {
        isValid = false;
        message = 'Mobile number is required.';
      } else if (!REGEX.indianMobile.test(val.replace(/\s+/g, ''))) {
        isValid = false;
        message = 'Enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.';
      } else if (cleanDigits.length < 10 || cleanDigits.length > 12) {
        isValid = false;
        message = 'Mobile number must be a valid 10-digit number.';
      }
    }

    // Email or Mobile (Forgot Password)
    else if ($el.hasClass('validate-email-or-mobile')) {
      if (!val) {
        isValid = false;
        message = 'Please enter your registered email address or mobile number.';
      } else {
        const isEmail = REGEX.email.test(val);
        const isMobile = REGEX.indianMobile.test(val.replace(/\s+/g, ''));
        if (!isEmail && !isMobile) {
          isValid = false;
          message = 'Please enter a valid email address or 10-digit Indian mobile number.';
        }
      }
    }

    // Password creation (Register)
    else if ($el.hasClass('validate-password-create')) {
      const strength = evaluatePasswordStrength(val);
      if (!val) {
        isValid = false;
        message = 'Password is required.';
      } else if (val.length < 8) {
        isValid = false;
        message = 'Password must be at least 8 characters long.';
      } else if (val.length > 64) {
        isValid = false;
        message = 'Password cannot exceed 64 characters.';
      } else if (
        !strength.rules.lowercase ||
        !strength.rules.uppercase ||
        !strength.rules.number ||
        !strength.rules.special
      ) {
        isValid = false;
        message = 'Password must include uppercase, lowercase, a number, and a special character.';
      }
    }

    // Password Login
    else if ($el.hasClass('validate-password-login')) {
      if (!val) {
        isValid = false;
        message = 'Password is required.';
      } else if (val.length < 6) {
        isValid = false;
        message = 'Password is too short.';
      }
    }

    // Confirm Password
    else if ($el.hasClass('validate-confirm-password')) {
      const passwordRef = $($el.attr('data-match-target') || '#password').val() || '';
      if (!val) {
        isValid = false;
        message = 'Please confirm your password.';
      } else if (val !== passwordRef) {
        isValid = false;
        message = 'Passwords do not match.';
      }
    }

    // Standard required text/select
    else if (isRequired && !val) {
      isValid = false;
      message = $el.attr('data-err-msg') || 'This field is required.';
    }

    // Terms & Conditions checkbox
    else if ($el.is(':checkbox') && isRequired) {
      if (!$el.is(':checked')) {
        isValid = false;
        message = $el.attr('data-err-msg') || 'You must accept the Terms and Conditions to proceed.';
      }
    }

    // Apply UI state
    applyValidationUI($el, isValid, message);
    return isValid;
  }

  // --- UI Validation State Updater ---
  function applyValidationUI($el, isValid, message) {
    const parent = $el.closest('.form-group, .mb-3, .mb-4');
    const feedback = parent.find('.invalid-feedback');

    if (isValid) {
      $el.removeClass('is-invalid').addClass('is-valid');
      if (feedback.length) feedback.text('');
    } else {
      $el.removeClass('is-valid').addClass('is-invalid');
      if (feedback.length && message) {
        feedback.text(message);
      }
    }
  }

  // Live validation on blur & input
  $(document).on('blur', '.form-control, .form-select', function () {
    validateField(this);
  });

  $(document).on('input change', '.form-control.is-invalid, .form-select.is-invalid', function () {
    validateField(this);
  });

  // Re-check confirm password when main password changes
  $(document).on('input keyup', '#password', function () {
    const confirmInput = $('#confirmPassword');
    if (confirmInput.length && confirmInput.val().length > 0) {
      validateField(confirmInput[0]);
    }
  });

  // Terms and condition checkbox change
  $(document).on('change', 'input[type="checkbox"][required]', function () {
    validateField(this);
  });

  // Check crop selection for farmer
  function validateCropsGroup() {
    const cropsGroup = $('#farmerCropsGroup');
    if (!cropsGroup.length) return true;

    const selected = cropsGroup.find('input[type="checkbox"]:checked').length;
    const feedback = cropsGroup.find('.crop-feedback');

    if (selected === 0) {
      cropsGroup.addClass('is-invalid-group');
      if (feedback.length) feedback.show();
      return false;
    } else {
      cropsGroup.removeClass('is-invalid-group');
      if (feedback.length) feedback.hide();
      return true;
    }
  }

  $(document).on('change', '#farmerCropsGroup input[type="checkbox"]', function () {
    validateCropsGroup();
  });

  // --- Form Submission Handlers ---

  // 1. Farmer Registration Form
$('#farmerRegisterForm').on('submit', function (e) {
  const form = $(this);
  let isFormValid = true;

  form.find('input, select').each(function () {
    if (!validateField(this)) isFormValid = false;
  });

  if (!validateCropsGroup()) isFormValid = false;

  if (!isFormValid) {
    e.preventDefault();   // block ONLY when invalid
    const firstInvalid = form.find('.is-invalid').first();
    if (firstInvalid.length) {
      $('html, body').animate({ scrollTop: firstInvalid.offset().top - 120 }, 300);
      firstInvalid.focus();
    }
    return false;
  }

  // Valid: do NOT preventDefault, so the browser POSTs to /farmer_register_save
  toggleButtonLoading(form.find('button[type="submit"]'), true, 'Creating Farmer Account...');
});

  // 2. Buyer Registration Form
  $('#buyerRegisterForm').on('submit', function (e) {
    const form = $(this);
    let isFormValid = true;

    form.find('input, select').each(function () {
      if (!validateField(this)) {
        isFormValid = false;
      }
    });

    if (!isFormValid) {
      e.preventDefault();
      const firstInvalid = form.find('.is-invalid').first();
      if (firstInvalid.length) {
        $('html, body').animate({ scrollTop: firstInvalid.offset().top - 120 }, 300);
        firstInvalid.focus();
      }
      return false;
    }

    const submitBtn = form.find('button[type="submit"]');
    toggleButtonLoading(submitBtn, true, 'Creating Buyer Account...');
  });

  // 3. Login Form
  $('#loginForm').on('submit', function (e) {
    const form = $(this);
    let isFormValid = true;

    form.find('input').each(function () {
      if (!validateField(this)) {
        isFormValid = false;
      }
    });

    if (!isFormValid) {
      e.preventDefault();
      const firstInvalid = form.find('.is-invalid').first();
      if (firstInvalid.length) {
        firstInvalid.focus();
      }
      return false;
    }

    const submitBtn = form.find('button[type="submit"]');
    toggleButtonLoading(submitBtn, true, 'Verifying Credentials...');
  });

  // 4. Forgot Password Form
  $('#forgotPasswordForm').on('submit', function (e) {
    e.preventDefault();
    const form = $(this);
    let isFormValid = true;

    form.find('input').each(function () {
      if (!validateField(this)) {
        isFormValid = false;
      }
    });

    if (!isFormValid) {
      const firstInvalid = form.find('.is-invalid').first();
      if (firstInvalid.length) {
        firstInvalid.focus();
      }
      return false;
    }

    const identifier = $('#resetIdentifier').val().trim();
    const submitBtn = form.find('button[type="submit"]');
    toggleButtonLoading(submitBtn, true, 'Sending Verification Code...');

    setTimeout(function () {
      toggleButtonLoading(submitBtn, false);
      showAlert(
        '#authAlertPlaceholder',
        'success',
        `<i class="bi bi-send-check-fill me-2"></i><strong>Reset Link & OTP Sent!</strong> We've dispatched verification instructions to <strong>${escapeHtml(identifier)}</strong>. Please check your SMS or email inbox.`,
        false
      );

      // Reveal simulated OTP verification box
      $('#otpVerificationSection').slideDown(350);
      $('#forgotInputSection').slideUp(350);
    }, 1200);
  });

  // Simulated OTP Verification
  $('#verifyOtpBtn').on('click', function () {
    const otp = $('#otpInput').val().trim();
    if (!otp || otp.length < 4) {
      showAlert(
        '#otpAlertPlaceholder',
        'danger',
        '<i class="bi bi-exclamation-triangle-fill me-2"></i>Please enter a valid 4 to 6 digit verification code.',
        false
      );
      return;
    }

    const btn = $(this);
    toggleButtonLoading(btn, true, 'Verifying OTP...');

    setTimeout(function () {
      toggleButtonLoading(btn, false);
      showAlert(
        '#otpAlertPlaceholder',
        'success',
        '<i class="bi bi-check-circle-fill me-2"></i><strong>OTP Verified!</strong> You may now set your new password.',
        false
      );
      $('#newPasswordSection').slideDown(350);
      $('#otpVerificationSection').slideUp(350);
    }, 1100);
  });

  // Simulated New Password Update
  $('#resetPasswordForm').on('submit', function (e) {
    e.preventDefault();
    const newPass = $('#newPassword').val();
    const confirmPass = $('#confirmNewPassword').val();

    if (!newPass || newPass.length < 8) {
      showAlert('#newPassAlertPlaceholder', 'danger', 'Password must be at least 8 characters.', false);
      return;
    }
    if (newPass !== confirmPass) {
      showAlert('#newPassAlertPlaceholder', 'danger', 'Passwords do not match.', false);
      return;
    }

    const btn = $(this).find('button[type="submit"]');
    toggleButtonLoading(btn, true, 'Updating Password...');

    setTimeout(function () {
      toggleButtonLoading(btn, false);
      showAlert(
        '#newPassAlertPlaceholder',
        'success',
        '<i class="bi bi-check-circle-fill me-2"></i><strong>Password Reset Successfully!</strong> Redirecting to login...',
        false
      );
      setTimeout(function () {
        window.location.href = '/login';
      }, 1800);
    }, 1200);
  });

  // --- Helper Utilities ---

  // Button loading spinner toggle
  function toggleButtonLoading(btn, isLoading, loadingText) {
    if (isLoading) {
      btn.data('original-html', btn.html());
      btn.prop('disabled', true);
      btn.html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> ${loadingText || 'Loading...'}`);
    } else {
      btn.prop('disabled', false);
      const original = btn.data('original-html');
      if (original) {
        btn.html(original);
      }
    }
  }

  // Alert Banner Renderer
  function showAlert(targetSelector, type, messageHtml, autoDismiss) {
    const container = $(targetSelector);
    if (!container.length) return;

    const alertHtml = `
      <div class="alert alert-${type} alert-dismissible fade show alert-feedback shadow-sm" role="alert">
        <div>${messageHtml}</div>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
    container.html(alertHtml);

    if (autoDismiss) {
      setTimeout(function () {
        container.find('.alert').alert('close');
      }, 4000);
    }
  }

  // HTML escape helper
  function escapeHtml(string) {
    return String(string).replace(/[&<>"'`=\/]/g, function (s) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
      }[s];
    });
  }

  // Format Indian mobile number as user types (keeps clean digits)
  $('.validate-mobile').on('input', function () {
    let raw = $(this).val();
    // Allow digits and '+' at the start
    let cleaned = raw.replace(/[^\d+]/g, '');
    if (cleaned.startsWith('+91')) {
      if (cleaned.length > 13) cleaned = cleaned.substring(0, 13);
    } else if (cleaned.length > 10) {
      cleaned = cleaned.substring(0, 10);
    }
    if (raw !== cleaned) {
      $(this).val(cleaned);
    }
  });

});
