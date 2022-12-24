<template>
  <div class="app">
    <slot />
  </div>
</template>

<script lang="ts">
import { useApartmentStore } from "@/stores/app";

export default defineComponent({
  setup() {
    const route = useRoute();
    const apartmentStore = useApartmentStore();
    const list = apartmentStore.apartmentList;
    const detail = apartmentStore.apartmentDetail;
    const apartmentId = route.params.apartmentId as string;
    if (!!apartmentId && !detail) {
      apartmentStore.fetchApartmentDetail(apartmentId);
    }
    if (list.length === 0) {
      apartmentStore.fetchApartmentData();
    }
  },
});
</script>
