import { rfcValidatorRegex } from '../utils/validations';

export function validateRFC(value) {
    let error;
    if (!value) {
      error = 'el RFC es requerido para validar la identidad de la persona fisica o moral';
    } else if (!rfcValidatorRegex(value)) {
      error = 'El Formato del RFC no es valido';
    }
    return error;
}