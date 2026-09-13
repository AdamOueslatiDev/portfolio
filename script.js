// Highlight the nav link of the section currently in view,
// and keep it highlighted until another section takes over.
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar a');

function setActiveLink(id) {
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
}

window.addEventListener('scroll', () => {
    let current = sections[0].id;
    const scrollPos = window.scrollY + window.innerHeight / 3;

    sections.forEach(section => {
        if (scrollPos >= section.offsetTop) {
            current = section.id;
        }
    });

    setActiveLink(current);
});

// Instantly mark the clicked link as active (don't wait for scroll to catch up)
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        setActiveLink(link.getAttribute('href').replace('#', ''));
    });
});

// Hamburger menu toggle (mobile view)
const menuIcon = document.getElementById('menu-icon');
const navbar = document.querySelector('.navbar');

if (menuIcon && navbar) {
    menuIcon.addEventListener('click', () => {
        navbar.classList.toggle('active');
        menuIcon.classList.toggle('fa-bars');
        menuIcon.classList.toggle('fa-xmark');
    });

    // Close the menu after a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('active');
            menuIcon.classList.add('fa-bars');
            menuIcon.classList.remove('fa-xmark');
        });
    });
}

// Show a success message under the contact form when it's submitted
const contactForm = document.getElementById('contact-form');
const formSuccessMsg = document.getElementById('form-success-msg');
const formErrorMsg = document.getElementById('form-error-msg');
const nameInput = document.getElementById('name-input');
const emailInput = document.getElementById('email');
const countrySelect = document.getElementById('country-code');
const phoneInput = document.getElementById('phone-number');

const nameError = document.getElementById('name-error');
const emailError = document.getElementById('email-error');
const phoneError = document.getElementById('phone-error');

// Capitalize the first letter of each word in the name field as the user types
function capitalizeWords(value) {
    return value.replace(/(^|\s)\S/g, (c) => c.toUpperCase());
}

if (nameInput) {
    nameInput.addEventListener('input', () => {
        const pos = nameInput.selectionStart;
        nameInput.value = capitalizeWords(nameInput.value);
        nameInput.setSelectionRange(pos, pos);
        validateName(false);
    });
    nameInput.addEventListener('blur', () => validateName(true));
}

function setFieldState(input, errorEl, message) {
    if (message) {
        input.classList.add('invalid');
        input.classList.remove('valid');
        if (errorEl) errorEl.textContent = message;
    } else {
        input.classList.remove('invalid');
        input.classList.add('valid');
        if (errorEl) errorEl.textContent = '';
    }
}

function validateName(showEmptyError) {
    const value = nameInput.value.trim();
    if (!value) {
        if (showEmptyError) setFieldState(nameInput, nameError, 'Name is required.');
        else { nameInput.classList.remove('invalid', 'valid'); nameError.textContent = ''; }
        return false;
    }
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[\s'-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/.test(value)) {
        setFieldState(nameInput, nameError, 'Name should only contain letters.');
        return false;
    }
    setFieldState(nameInput, nameError, '');
    return true;
}

function validateEmailField(showEmptyError) {
    const value = emailInput.value.trim();
    if (!value) {
        if (showEmptyError) setFieldState(emailInput, emailError, 'Email is required.');
        else { emailInput.classList.remove('invalid', 'valid'); emailError.textContent = ''; }
        return false;
    }
    if (!isValidEmail(value)) {
        setFieldState(emailInput, emailError, 'Enter a valid email (e.g. name@example.com).');
        return false;
    }
    setFieldState(emailInput, emailError, '');
    return true;
}

function validatePhoneField(showEmptyError) {
    const expectedDigits = parseInt(countrySelect.selectedOptions[0].dataset.digits, 10);
    const phoneDigits = phoneInput.value.replace(/\D/g, '');
    if (!phoneDigits) {
        if (showEmptyError) setFieldState(phoneInput, phoneError, 'Phone number is required.');
        else { phoneInput.classList.remove('invalid', 'valid'); phoneError.textContent = ''; }
        return false;
    }
    if (phoneDigits.length !== expectedDigits) {
        const countryName = countries.find(c => c.dial === countrySelect.value)?.name || "the selected country";
        setFieldState(phoneInput, phoneError, `Must be exactly ${expectedDigits} digits for ${countryName}.`);
        return false;
    }
    setFieldState(phoneInput, phoneError, '');
    return true;
}

if (emailInput) {
    emailInput.addEventListener('input', () => validateEmailField(false));
    emailInput.addEventListener('blur', () => validateEmailField(true));
}
if (phoneInput) {
    phoneInput.addEventListener('blur', () => validatePhoneField(true));
}
if (countrySelect) {
    countrySelect.addEventListener('change', () => {
        phoneInput.classList.remove('invalid', 'valid');
        phoneError.textContent = '';
    });
}

// Country dial codes + expected national phone number length (digits, no country code)
const countries = [
    { name: "Tunisia", iso: "TN", flag: "🇹🇳", dial: "+216", digits: 8 },
    { name: "Algeria", iso: "DZ", flag: "🇩🇿", dial: "+213", digits: 9 },
    { name: "Morocco", iso: "MA", flag: "🇲🇦", dial: "+212", digits: 9 },
    { name: "Libya", iso: "LY", flag: "🇱🇾", dial: "+218", digits: 9 },
    { name: "Egypt", iso: "EG", flag: "🇪🇬", dial: "+20", digits: 10 },
    { name: "France", iso: "FR", flag: "🇫🇷", dial: "+33", digits: 9 },
    { name: "Germany", iso: "DE", flag: "🇩🇪", dial: "+49", digits: 10 },
    { name: "Italy", iso: "IT", flag: "🇮🇹", dial: "+39", digits: 10 },
    { name: "Spain", iso: "ES", flag: "🇪🇸", dial: "+34", digits: 9 },
    { name: "United Kingdom", iso: "GB", flag: "🇬🇧", dial: "+44", digits: 10 },
    { name: "United States", iso: "US", flag: "🇺🇸", dial: "+1", digits: 10 },
    { name: "Canada", iso: "CA", flag: "🇨🇦", dial: "+1", digits: 10 },
    { name: "Belgium", iso: "BE", flag: "🇧🇪", dial: "+32", digits: 9 },
    { name: "Switzerland", iso: "CH", flag: "🇨🇭", dial: "+41", digits: 9 },
    { name: "Qatar", iso: "QA", flag: "🇶🇦", dial: "+974", digits: 8 },
    { name: "Saudi Arabia", iso: "SA", flag: "🇸🇦", dial: "+966", digits: 9 },
    { name: "UAE", iso: "AE", flag: "🇦🇪", dial: "+971", digits: 9 },
    { name: "Turkey", iso: "TR", flag: "🇹🇷", dial: "+90", digits: 10 },
];

if (countrySelect) {
    countries.forEach((c, i) => {
        const opt = document.createElement('option');
        opt.value = c.dial;
        opt.dataset.digits = c.digits;
        opt.textContent = `${c.flag} ${c.dial}`;
        if (i === 0) opt.selected = true; // Tunisia default
        countrySelect.appendChild(opt);
    });

    countrySelect.addEventListener('change', () => {
        const digits = countrySelect.selectedOptions[0].dataset.digits;
        phoneInput.setAttribute('maxlength', digits);
        phoneInput.value = '';
    });
    // Set initial maxlength for the default (Tunisia)
    phoneInput.setAttribute('maxlength', countrySelect.selectedOptions[0].dataset.digits);
}

// Only allow digits to be typed in the phone field
if (phoneInput) {
    phoneInput.addEventListener('input', () => {
        phoneInput.value = phoneInput.value.replace(/\D/g, '');
        if (phoneInput.classList.contains('invalid')) validatePhoneField(true);
    });
}

function isValidEmail(value) {
    // requires something@something.something (e.g. name@domain.com)
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

if (contactForm && formSuccessMsg) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const isNameValid = validateName(true);
        const isEmailValid = validateEmailField(true);
        const isPhoneValid = validatePhoneField(true);

        if (!isNameValid || !isEmailValid || !isPhoneValid) {
            formSuccessMsg.style.display = 'none';
            formErrorMsg.textContent = 'Please fix the highlighted fields above.';
            formErrorMsg.style.display = 'block';
            return;
        }

        formErrorMsg.style.display = 'none';
        formSuccessMsg.style.display = 'block';
        contactForm.reset();
        [nameInput, emailInput, phoneInput].forEach(el => el.classList.remove('invalid', 'valid'));
        [nameError, emailError, phoneError].forEach(el => el.textContent = '');
        phoneInput.setAttribute('maxlength', countries[0].digits);

        setTimeout(() => {
            formSuccessMsg.style.display = 'none';
        }, 4000);
    });
}
