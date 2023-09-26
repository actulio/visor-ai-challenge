import * as yup from 'yup';

export const loginReqSchema = yup.object({
  email: yup.string().required(),
  password: yup.string().required(),
});

export const registerReqSchema = yup.object({
  name: yup.string().required().max(14),
  email: yup.string().required(),
  password: yup.string().required(),
});

export const promptSchema = yup.object({
  prompt: yup.string().required(), //NOTE: maybe limit size
});
