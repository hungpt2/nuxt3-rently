<template>
  <div class="container mx-auto py-10">
    <div class="flex justify-between">
      <div class="text-3xl">Request Inventory</div>
      <button class="btn" @click="onBack">Back</button>
    </div>

    <div class="card bg-base-100 shadow-xl mt-10 w-full p-5">
      <VForm
        v-slot="{ meta, errors, setFieldValue, values }"
        :initial-values="initValues"
        :validation-schema="schema"
        @submit="handleSubmit"
      >
        <div class="flex flex-col gap-5">
          <VField name="name" v-slot="{ field, meta }">
            <select
              v-bind="field"
              :class="[
                'select select-bordered w-full',
                !meta.valid && meta.touched ? 'border-red-400' : '',
                meta.valid && meta.touched ? 'border-green-400' : '',
              ]"
            >
              <option value="" disabled selected>Select your inventory</option>
              <option
                v-for="opt in listSuppliers"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </option>
            </select>
          </VField>

          <VField name="quantity" v-slot="{ field, meta }">
            <input
              v-bind="field"
              type="number"
              placeholder="Quantity here"
              :class="[
                'input input-bordered w-full',
                !meta.valid && meta.touched ? 'border-red-400' : '',
                meta.valid && meta.touched ? 'border-green-400' : '',
              ]"
            />
          </VField>

          <VField name="image" v-slot="{ field, meta }">
            <input
              ref="imageRef"
              type="file"
              class="hidden"
              @change="
                (e) => {
                  onInputChange(e, setFieldValue);
                }
              "
            />
            <button
              class="btn"
              type="button"
              :class="[
                !meta.valid && meta.touched ? 'border-red-400' : '',
                meta.valid && meta.touched ? 'border-green-400' : '',
              ]"
              @click="onUpload"
            >
              Upload Image
            </button>
          </VField>

          <div v-if="values.image" class="flex justify-center">
            <img :src="values.image" class="max-h-200" />
          </div>

          <template v-if="Object.keys(errors).length && meta.touched">
            <ul>
              <li
                v-for="(message, field) in errors"
                :key="field"
                class="text-sm text-red-400"
              >
                {{ message }}
              </li>
            </ul>
          </template>

          <div class="flex justify-between items-center">
            <button class="btn" type="button" @click="onBack">Cancel</button>
            <button
              class="btn btn-primary"
              :disabled="!meta.valid"
              type="submit"
            >
              Request
            </button>
          </div>
        </div>
      </VForm>
    </div>
  </div>
</template>

<script lang="ts">
import * as yup from "yup";
import { useApartmentStore } from "@/stores/app";
import { IInventory } from "@/types/app";
import { listSuppliers } from "@/constant/inventory";
import { findIndex } from "lodash";

export default defineComponent({
  setup() {
    const imageRef = ref();
    const schema = yup.object({
      name: yup.string().required().label("Item"),
      quantity: yup.number().required().min(1).max(100).label("Quantity"),
      image: yup.string().label("Preview"),
    });

    const route = useRoute();
    const router = useRouter();
    const apartmentId = route.params.apartmentId;
    const inventoryId = route.params.inventoryId;
    const apartmentStore = useApartmentStore();
    const isLoading = computed(() => apartmentStore.isLoading);
    const inventories = computed(() => apartmentStore.inventories);
    const approvals = computed(() => apartmentStore.approvals);

    const getInitValue = (): IInventory => {
      const tmp: IInventory = {
        id: Math.floor(Math.random() * 999999).toString(),
        name: "",
        quantity: 0,
        image: "",
      };
      if (inventoryId) {
        const inventoryIdx = findIndex(
          inventories.value,
          (el: IInventory) => el.id === inventoryId
        );
        return inventoryIdx > -1 ? inventories.value[inventoryIdx] : tmp;
      }
      return tmp;
    };

    let initValues: IInventory = reactive(getInitValue());

    watch(
      inventories,
      () => {
        Object.assign(initValues, getInitValue());
      },
      { deep: true }
    );

    const onBack = () => {
      router.push({
        path: `/${apartmentId}`,
      });
    };

    const onUpload = async () => {
      await nextTick();
      imageRef.value && (imageRef.value as any).click();
    };

    const onInputChange = (
      event: Event,
      setFieldValue: (field: string, value: string) => void
    ) => {
      const files = (event.target as HTMLInputElement).files || [];
      setFieldValue("image", "https://picsum.photos/seed/picsum/300/300");
    };

    const handleSubmit = async (
      values: IInventory,
      actionForm: Record<string, (...args: any) => void>
    ) => {
      await apartmentStore.addInventory(values);
      if (inventories.value.length + approvals.value.length >= 20) {
        router.push({
          path: `/${apartmentId}`,
        });
      }
      initValues = getInitValue();
      actionForm.setValues(initValues);
      actionForm.resetForm();
    };
    return {
      listSuppliers,
      isLoading,
      schema,
      initValues,
      imageRef,
      onBack,
      onUpload,
      onInputChange,
      handleSubmit,
    };
  },
});
</script>
