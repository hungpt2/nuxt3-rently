<template>
  <div class="container mx-auto py-10">
    <div class="text-3xl">Apartment List</div>

    <div class="overflow-x-auto mt-10">
      <table class="table w-full">
        <thead>
          <tr>
            <th>ID</th>
            <th class="table-cell sm:hidden">Apartment</th>
            <th class="hidden sm:table-cell">Preview</th>
            <th class="hidden sm:table-cell">Address</th>
            <th class="hidden sm:table-cell">Floor</th>
            <th class="hidden sm:table-cell">Door Number</th>
            <th class="hidden sm:table-cell"></th>
          </tr>
          <tr>
            <th></th>
            <th class="table-cell sm:hidden">
              <input
                v-model="filters.all"
                type="text"
                :class="['input input-bordered w-full']"
              />
            </th>
            <th class="hidden sm:table-cell"></th>
            <th class="hidden sm:table-cell">
              <input
                v-model="filters.address"
                type="number"
                :class="['input input-bordered w-full']"
              />
            </th>
            <th class="hidden sm:table-cell">
              <input
                v-model="filters.floor"
                type="number"
                :class="['input input-bordered w-full']"
              />
            </th>
            <th class="hidden sm:table-cell">
              <input
                v-model="filters.doorNumber"
                type="number"
                :class="['input input-bordered w-full']"
              />
            </th>
            <th class="hidden sm:table-cell">
              <button class="btn" @click="onClearFilter">Clear</button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="apartment in apartmentList"
            :key="apartment.id"
            class="hover"
            @click="onView(apartment)"
          >
            <td>{{ apartment.id }}</td>
            <td class="table-cell sm:hidden">
              <div class="flex items-center space-x-3">
                <div class="avatar">
                  <div class="mask mask-squircle w-12 h-12">
                    <img :src="apartment.preview" />
                  </div>
                </div>
                <div>
                  <div class="font-bold">{{ apartment.address }}</div>
                  <div class="text-sm opacity-50">
                    {{ apartment.floor }} - {{ apartment.doorNumber }}
                  </div>
                </div>
              </div>
            </td>
            <td class="hidden sm:table-cell">
              <div class="avatar">
                <div class="mask mask-squircle w-12 h-12">
                  <img :src="apartment.preview" />
                </div>
              </div>
            </td>
            <td class="hidden sm:table-cell">{{ apartment.address }}</td>
            <td class="hidden sm:table-cell">{{ apartment.floor }}</td>
            <td class="hidden sm:table-cell">{{ apartment.doorNumber }}</td>
            <td class="hidden sm:table-cell">
              <button class="btn btn-info" @click.stop="onView(apartment)">
                View
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { useApartmentStore } from "@/stores/app";
import { IApartment } from "@/types/app";
import cloneDeep from "lodash/cloneDeep";
import get from "lodash/get";

export default defineComponent({
  setup() {
    const router = useRouter();
    const apartmentStore = useApartmentStore();

    let filters: { [key: string]: string } = reactive({
      name: "",
      address: "",
      floor: "",
      doorNumber: "",
      all: "",
    });
    const apartmentList = computed(() => {
      let list = cloneDeep(apartmentStore.apartmentList);
      Object.keys(filters).forEach((prop: string) => {
        if (filters[prop]) {
          list = list.filter((el: IApartment) => {
            const compareValue =
              prop === "all"
                ? `${el.address} ${el.floor} ${el.doorNumber}`
                : get(el, prop, "");
            return compareValue
              .toString()
              .toLowerCase()
              .includes(filters[prop].toString().toLowerCase());
          });
        }
      });
      return list;
    });

    const onView = (apartment: IApartment) => {
      apartmentStore.setApartment(apartment);
      router.push({
        path: `/${apartment.id}`,
      });
    };
    const onClearFilter = () => {
      filters = Object.assign(filters, {
        name: "",
        address: "",
        floor: "",
        doorNumber: "",
        all: "",
      });
    };
    return { apartmentList, filters, onView, onClearFilter };
  },
});
</script>
