import { defineStore } from "pinia";
import axios from "axios";
import cloneDeep from "lodash/cloneDeep";
import get from "lodash/get";
import { IApartment, IInventory, IApartmentStore } from "~~/types/app";

export const useApartmentStore = defineStore("apartment", {
  state: (): IApartmentStore => ({
    loading: true,
    list: [],
    detail: undefined,
  }),
  actions: {
    setLoading(value: boolean) {
      this.loading = value;
    },
    setListApartment(list: IApartment[]) {
      this.list = list;
    },
    setApartment(apartment: IApartment) {
      this.detail = apartment;
    },
    async fetchApartmentData() {
      this.setLoading(true);
      const { data }: { data: IApartment[] } = await axios(
        "https://63a469ad2a73744b00771d62.mockapi.io/rently/v1/apartments"
      );
      this.setListApartment(data);
      this.setLoading(false);
    },
    async fetchApartmentDetail(apartmentId: string) {
      this.setLoading(true);
      const { data }: { data: IApartment } = await axios(
        `https://63a469ad2a73744b00771d62.mockapi.io/rently/v1/apartments/${apartmentId}`
      );
      this.setApartment(data);
      this.setLoading(false);
    },
    async addInventory(newInventory: IInventory) {
      this.setLoading(true);
      if (!this.apartmentDetail) {
        return;
      }
      const payload = {
        ...this.apartmentDetail,
        approvals: [...this.approvals, newInventory],
      };
      const { data } = await axios.put(
        `https://63a469ad2a73744b00771d62.mockapi.io/rently/v1/apartments/${this.apartmentDetail.id}`,
        payload
      );
      this.setApartment(data);
      this.fetchApartmentData();
      this.setLoading(false);
    },
    async remove(index: number) {
      this.setLoading(true);
      if (!this.apartmentDetail) {
        return;
      }
      const newInventory = cloneDeep(this.inventories);
      newInventory.splice(index, 1);
      const payload = {
        ...this.apartmentDetail,
        inventories: newInventory,
      };
      const { data } = await axios.put(
        `https://63a469ad2a73744b00771d62.mockapi.io/rently/v1/apartments/${this.apartmentDetail.id}`,
        payload
      );
      this.setApartment(data);
      this.fetchApartmentData();
      this.setLoading(false);
    },
    async reject(index: number) {
      this.setLoading(true);
      if (!this.apartmentDetail) {
        return;
      }
      const newApprovals = cloneDeep(this.approvals);
      newApprovals.splice(index, 1);
      const payload = {
        ...this.apartmentDetail,
        approvals: newApprovals,
      };
      const { data } = await axios.put(
        `https://63a469ad2a73744b00771d62.mockapi.io/rently/v1/apartments/${this.apartmentDetail.id}`,
        payload
      );
      this.setApartment(data);
      this.fetchApartmentData();
      this.setLoading(false);
    },
    async accept(index: number) {
      this.setLoading(true);
      if (!this.apartmentDetail) {
        return;
      }
      const newApprovals = cloneDeep(this.approvals);
      const tmp: IInventory[] = newApprovals.splice(index, 1);
      const payload = {
        ...this.apartmentDetail,
        approvals: newApprovals,
        inventories: [...this.inventories, ...tmp],
      };
      const { data } = await axios.put(
        `https://63a469ad2a73744b00771d62.mockapi.io/rently/v1/apartments/${this.apartmentDetail.id}`,
        payload
      );
      this.setApartment(data);
      this.fetchApartmentData();
      this.setLoading(false);
    },
  },
  getters: {
    isLoading: (state) => state.loading,
    apartmentDetail: (state) => state.detail,
    apartmentList: (state) => state.list,
    inventories: (state) => get(state, "detail.inventories", []),
    approvals: (state) => get(state, "detail.approvals", []),
  },
});
