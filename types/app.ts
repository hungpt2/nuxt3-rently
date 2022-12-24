export interface IApartmentStore {
  list: IApartment[];
  detail?: IApartment;
  loading: boolean;
}

export interface IApartment {
  id: string;
  address: string;
  floor: string;
  doorNumber: string;
  slug: string;
  preview: string;
  inventories: IInventory[];
  approvals: IInventory[];
  rejected: IInventory[];
}

export interface IInventory {
  id: string;
  name: string;
  quantity: number;
  image: string;
}
