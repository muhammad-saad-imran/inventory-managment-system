import { object, string } from 'yup';

export const clientSchema = object({
  name: string()
    .required('Client name is required.'),
  email: string()
    .required('Email is required.')
    .email('Email must be a valid email address.'),
  phone_number: string()
    .required('Phone number is required.')
    .matches(/^[0-9]+$/, 'Phone number must contain only digits.')
    .min(10, 'Phone number must be at least 10 digits long.')
    .max(15, 'Phone number must be no more than 15 digits long.'),
});
