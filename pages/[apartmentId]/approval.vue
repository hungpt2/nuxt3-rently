<template>
  <div class="container mx-auto py-10">
    <div class="flex justify-between">
      <div class="text-3xl">Approval Inventory</div>
      <button class="btn" @click="onBack">Back</button>
    </div>

    <div class="overflow-x-auto mt-10">
      <table class="table w-full">
        <thead>
          <tr>
            <th class="table-cell sm:hidden">Inventory</th>
            <th class="hidden sm:table-cell">ID</th>
            <th class="hidden sm:table-cell">Image</th>
            <th class="hidden sm:table-cell">Name</th>
            <th class="hidden sm:table-cell">Quantity</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(inventory, index) in approvals"
            :key="index"
            class="hover"
          >
            <td class="table-cell sm:hidden">
              <div class="flex items-center space-x-3">
                <div class="avatar">
                  <div class="mask mask-squircle w-12 h-12">
                    <img :src="inventory.image" />
                  </div>
                </div>
                <div>
                  <div class="font-bold">{{ inventory.name }} - {{ inventory.id }}</div>
                  <div class="text-sm opacity-50">
                    Quantity: {{ inventory.quantity }}
                  </div>
                </div>
              </div>
            </td>
            <td class="hidden sm:table-cell">{{ inventory.id }}</td>
            <td class="hidden sm:table-cell">
              <div class="avatar">
                <div class="mask mask-squircle w-12 h-12">
                  <img :src="inventory.image" />
                </div>
              </div>
            </td>
            <td class="hidden sm:table-cell">{{ inventory.name }}</td>
            <td class="hidden sm:table-cell">{{ inventory.quantity }}</td>
            <td>
              <div class="flex justify-end gap-5">
                <button
                  class="btn btn-outline btn-error"
                  @click="onSubmit(index, 'rejected')"
                >
                  Reject
                </button>
                <button
                  class="btn btn-outline btn-success"
                  @click="onSubmit(index, 'inventories')"
                >
                  Accept
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { useApartmentStore } from "@/stores/app";

export default defineComponent({
  setup() {
    const route = useRoute();
    const router = useRouter();
    const apartmentStore = useApartmentStore();
    const apartmentId = route.params.apartmentId;
    const approvals = computed(() => apartmentStore.approvals);

    const onBack = () => {
      router.push({
        path: `/${apartmentId}`,
      });
    };
    const onSubmit = async (index: number, type: string) => {
      if (type === "rejected") {
        apartmentStore.reject(index);
      } else {
        apartmentStore.accept(index);
      }
    };
    return { approvals, onBack, onSubmit };
  },
});
</script>
