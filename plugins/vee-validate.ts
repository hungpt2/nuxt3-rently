import { Form, Field, ErrorMessage, defineRule } from "vee-validate";
import { required, min_value, max_value } from "@vee-validate/rules";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("VForm", Form);
  nuxtApp.vueApp.component("VField", Field);
  nuxtApp.vueApp.component("VErrorMessage", ErrorMessage);

  defineRule('required', required);
  defineRule('max_value', max_value);
  defineRule('min_value', min_value);
});
