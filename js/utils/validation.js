// Input validation schemas
export const schemas = {
  letters: {
    regex: /^[A-Za-zÀ-ÿ-' ]{3,}$/g,
    message: 'Minimum 3 caractères, lettres uniquement',
  },
  lettersDigits: {
    regex: /^[0-9A-Za-zÀ-ÿ-', ]{3,}$/g,
    message: 'Minimum 3 caractères, chiffres et lettres uniquement',
  },
  email: {
    regex: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    message: 'Adresse email non valide',
  },
};

// Validate an input and display message if error
export const validateInput = (e, schema) => {
  const inputElem = e.target;
  const inputErrorElem = inputElem.nextElementSibling;
  const inputValue = inputElem.value.trim();

  let isValid = false;
  let errorMessage = schema.message;

  if (inputValue && inputValue.match(schema.regex)) {
    isValid = true;
    errorMessage = '';
  }

  inputElem.valid = isValid;
  inputErrorElem.textContent = errorMessage;
};
