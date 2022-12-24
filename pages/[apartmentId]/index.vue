<template>
  <div class="container mx-auto py-10">
    <div class="flex justify-between">
      <div class="text-3xl">Apartment Detail</div>
      <button class="btn" @click="onBack">Back to List</button>
    </div>

    <div v-if="!!apartmentData" class="hero bg-base-200 mt-10">
      <div class="hero-content flex-col lg:flex-row w-full lg:items-start">
        <img
          :src="apartmentData.preview"
          class="max-w-sm w-full lg:min-w-300 rounded-lg shadow-2xl"
        />
        <div class="flex-1">
          <h1 class="text-5xl font-bold mb-4">{{ apartmentData.address }}</h1>
          <p class="py-1">Floor: {{ apartmentData.floor }}</p>
          <p class="py-1">Door Number: {{ apartmentData.doorNumber }}</p>
          <div class="flex justify-between">
            <p class="py-1 font-bold">
              Inventory ({{ apartmentData.inventories.length }})
            </p>
            <div class="flex justify-end items-center gap-4">
              <button
                :disabled="apartmentData.approvals.length <= 0"
                class="btn btn-accent"
                @click="goToApproval"
              >
                Preview ({{ apartmentData.approvals.length }})
              </button>
              <button
                :disabled="
                  apartmentData.inventories.length +
                    apartmentData.approvals.length >
                  20
                "
                class="btn btn-secondary"
                @click="onAddInventory"
              >
                Add
              </button>
            </div>
          </div>
          <div
            v-if="apartmentData.inventories.length > 0"
            class="overflow-x-auto mt-10"
          >
            <table class="table w-full">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th></th>
                </tr>
                <tr>
                  <th></th>
                  <th>
                    <select
                      v-model="filters.name"
                      :class="['select select-bordered w-full']"
                    >
                      <option value="" selected>All</option>
                      <option
                        v-for="opt in listSuppliers"
                        :key="opt.value"
                        :value="opt.value"
                      >
                        {{ opt.label }}
                      </option>
                    </select>
                  </th>
                  <th>
                    <input
                      v-model="filters.quantity"
                      type="number"
                      :class="['input input-bordered w-full']"
                    />
                  </th>
                  <th>
                    <button class="btn" @click="onClearFilter">
                      Clear
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(inventory, index) in inventories"
                  :key="index"
                  class="hover"
                  @click="onEditInventory(inventory)"
                >
                  <td>
                    <div class="avatar">
                      <div class="mask mask-squircle w-12 h-12">
                        <img :src="inventory.image" />
                      </div>
                    </div>
                  </td>
                  <td>{{ inventory.name }}</td>
                  <td>{{ inventory.quantity }}</td>
                  <td>
                    <button class="btn" @click.stop="onRemove(index)">
                      Remove
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useApartmentStore } from "@/stores/app";
import { IInventory } from "@/types/app";
import { listSuppliers } from "@/constant/inventory";
import { cloneDeep, get } from "lodash";

export default defineComponent({
  setup() {
    const route = useRoute();
    const router = useRouter();
    const apartmentStore = useApartmentStore();
    const apartmentData = computed(() => apartmentStore.apartmentDetail);

    let filters: { [key: string]: string } = reactive({
      name: "",
      quantity: "",
    });

    const inventories = computed(() => {
      let list = cloneDeep(apartmentStore.inventories);
      Object.keys(filters).forEach((prop: string) => {
        if (filters[prop]) {
          list = list.filter((el: IInventory) => {
            return get(el, prop, "")
              .toString()
              .toLowerCase()
              .includes(filters[prop].toString().toLowerCase());
          });
        }
      });
      return list;
    });

    const onBack = () => {
      router.push({
        path: "/",
      });
    };
    const onAddInventory = () => {
      router.push({
        path: `${route.path}/create`,
      });
    };
    const goToApproval = () => {
      router.push({
        path: `${route.path}/approval`,
      });
    };
    const onEditInventory = (inventory: IInventory) => {
      router.push({
        path: `${route.path}/${inventory.id}/update`,
      });
    };
    const onRemove = async (index: number) => {
      apartmentStore.remove(index);
    };
    const onClearFilter = () => {
      filters = Object.assign(filters, {
        name: "",
        quantity: "",
      });
    };
    return {
      apartmentData,
      filters,
      inventories,
      listSuppliers,
      onBack,
      onAddInventory,
      goToApproval,
      onRemove,
      onEditInventory,
      onClearFilter,
    };
  },
});
</script>
